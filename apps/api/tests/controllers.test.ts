import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import app from '../src/app'
import env from '../src/env'
import ms from 'ms'
import * as constants from '../src/constants'
import * as userModel from '../src/models/user.model'
import * as topicsModel from '../src/models/topics.model'
import * as videosModel from '../src/models/videos.model'
import * as userCompletedVideosModel from '../src/models/user-completed-videos.model'
import * as videoUtils from '../src/utils/videos.utils'
import * as youtubeService from '../src/services/youtube'
import { mockUser } from './testData'
import { generateKeyBetween } from 'fractional-indexing'
import setCookie from 'set-cookie-parser'
import events from '../src/events'
import * as authUtils from '../src/utils/auth.utils'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Controllers', () => {
  describe('Auth', () => {
    describe('GET /auth/google/url', () => {
      const endpoint = '/auth/google/url'
      const { verifyOauthState } = authUtils

      it('should return a valid Google OAuth URL with encoded state', async () => {
        const next_url = '/example'
        const res = await request(app).get(endpoint).query({ next_url })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('url')

        const authUrl = new URL(res.body.url)

        expect(authUrl.origin + authUrl.pathname).toBe('https://accounts.google.com/o/oauth2/auth')
        expect(authUrl.searchParams.get('client_id')).toBe(env.GOOGLE_CLIENT_ID)
        expect(authUrl.searchParams.get('redirect_uri')).toBe(env.GOOGLE_REDIRECT_URI)
        expect(authUrl.searchParams.get('response_type')).toBe('code')
        expect(authUrl.searchParams.get('scope')).toBe('email profile')
        expect(authUrl.searchParams.get('access_type')).toBe('online')
        expect(authUrl.searchParams.get('prompt')).toBe('select_account')

        const state = authUrl.searchParams.get('state')!
        const decoded = verifyOauthState(state)
        expect(decoded).toMatchObject({ next_url })

        const cookies = setCookie(res.headers['set-cookie'], { map: true })
        expect(cookies[constants.OAUTH_STATE_COOKIE_NAME].value).toBe(state)
      })
    })

    describe('GET /auth/me', () => {
      const endpoint = '/auth/me'
      const { generateAccessToken } = authUtils

      it('should return current authenticated user', async () => {
        const token = generateAccessToken('1h', mockUser)

        const res = await request(app)
          .get(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
          email: mockUser.email,
          role: mockUser.role,
        })
      })
    })

    describe('POST /auth/logout', () => {
      const endpoint = '/auth/logout'

      it('should clear the access token cookie and return 204', async () => {
        const res = await request(app).post(endpoint)

        expect(res.status).toBe(204)

        const cookies = setCookie(res.headers['set-cookie'], { map: true })
        const accessTokenCookie = cookies[constants.ACCESS_TOKEN_COOKIE_NAME]

        expect(accessTokenCookie.expires?.toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT')
        expect(accessTokenCookie.value).toBe('')
      })
    })

    describe('GET /auth/google/callback', () => {
      const endpoint = '/auth/google/callback'
      const { generateOauthState, verifyAccessToken } = authUtils

      it('should log in a learner', async () => {
        const nextUrl = '/example'
        const state = generateOauthState(nextUrl)
        const createSpy = vi
          .spyOn(userModel, 'createIfNotExists')
          .mockResolvedValue(undefined as any)

        vi.spyOn(authUtils, 'fetchGoogleIdToken').mockResolvedValue('fake-id-token')
        vi.spyOn(authUtils, 'decodeGoogleIdToken').mockReturnValue({
          sub: 'google-123',
          email: 'learner@example.com',
        })

        const res = await request(app)
          .get(endpoint)
          .query({ code: 'auth-code', state })
          .set('Cookie', `${constants.OAUTH_STATE_COOKIE_NAME}=${state}`)

        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe(new URL(nextUrl, env.CLIENT_ORIGIN).toString())
        expect(createSpy).toHaveBeenCalled()

        const cookies = setCookie(res.headers['set-cookie'], { map: true })

        const accessCookie = cookies[constants.ACCESS_TOKEN_COOKIE_NAME]
        const accessExpirySeconds = ms(constants.DEFAULT_ACCESS_TOKEN_EXPIRY) / 1000
        expect(accessCookie.maxAge).toBe(accessExpirySeconds)

        const decoded = verifyAccessToken(accessCookie.value) as any
        expect(decoded).toMatchObject({
          email: 'learner@example.com',
          role: 'learner',
          googleId: 'google-123',
        })
        expect(decoded.exp - decoded.iat).toBe(accessExpirySeconds)

        const stateCookie = cookies[constants.OAUTH_STATE_COOKIE_NAME]
        expect(stateCookie.expires?.toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT')
        expect(stateCookie.value).toBe('')
      })

      it('should log in an admin', async () => {
        const nextUrl = '/example'
        const state = generateOauthState(nextUrl)
        const createSpy = vi
          .spyOn(userModel, 'createIfNotExists')
          .mockResolvedValue(undefined as any)

        vi.spyOn(authUtils, 'fetchGoogleIdToken').mockResolvedValue('fake-id-token')
        vi.spyOn(authUtils, 'decodeGoogleIdToken').mockReturnValue({
          sub: env.ADMIN_GOOGLE_ID,
          email: 'admin@example.com',
        })

        const res = await request(app)
          .get(endpoint)
          .query({ code: 'auth-code', state })
          .set('Cookie', `${constants.OAUTH_STATE_COOKIE_NAME}=${state}`)

        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe(new URL(nextUrl, env.CLIENT_ORIGIN).toString())
        expect(createSpy).not.toHaveBeenCalled()

        const cookies = setCookie(res.headers['set-cookie'], { map: true })

        const accessCookie = cookies[constants.ACCESS_TOKEN_COOKIE_NAME]
        const accessExpirySeconds = ms(constants.ADMIN_ACCESS_TOKEN_EXPIRY) / 1000
        expect(accessCookie.maxAge).toBe(accessExpirySeconds)

        const decoded = verifyAccessToken(accessCookie.value) as any
        expect(decoded).toMatchObject({
          email: 'admin@example.com',
          role: 'admin',
          googleId: env.ADMIN_GOOGLE_ID,
        })
        expect(decoded.exp - decoded.iat).toBe(accessExpirySeconds)

        const stateCookie = cookies[constants.OAUTH_STATE_COOKIE_NAME]
        expect(stateCookie.expires?.toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT')
        expect(stateCookie.value).toBe('')
      })

      it('should redirect to auth failed on invalid state', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const res = await request(app)
          .get(endpoint)
          .query({ code: 'access_denied', state: 'invalid-state' })
          .set('Cookie', `${constants.OAUTH_STATE_COOKIE_NAME}=different-state`)

        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe(constants.AUTH_FAILED_REDIRECT_URL)
      })
    })
  })

  describe('Videos', () => {
    describe('POST /videos', () => {
      const endpoint = '/videos'
      const { generateAccessToken } = authUtils

      it('creates a video successfully', async () => {
        const topic = { id: 'topic-123', level_id: 'A1' }
        const body = { topicId: '916ce8b4-b0fe-4ab6-945f-def908317370', ytVideoId: 'An1ZrG0mbf4' }
        const ytVideo = {
          snippet: { title: 'test' },
          contentDetails: { duration: 'PT5M10S' },
        }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        vi.spyOn(videosModel, 'find').mockResolvedValue(undefined)
        vi.spyOn(videosModel, 'getMaxRank').mockResolvedValue('a0')
        vi.spyOn(youtubeService, 'getYoutubeVideo').mockResolvedValue(ytVideo as any)
        vi.spyOn(videoUtils, 'isValidEasyGermanVideo').mockReturnValue(true)
        const createSpy = vi.spyOn(videosModel, 'create').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .post(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(201)
        expect(createSpy).toHaveBeenCalledWith({
          topic_id: body.topicId,
          yt_video_id: body.ytVideoId,
          title: ytVideo.snippet.title,
          duration_seconds: 310,
          rank: generateKeyBetween('a0', null),
        })
        expect(emitSpy).toHaveBeenCalledWith('video.created', {
          levelId: topic.level_id,
          topicId: topic.id,
        })
      })
    })

    describe('POST /videos/:id/change-order', () => {
      const mockTopicId = '916ce8b4-b0fe-4ab6-945f-def908317370'
      const mockVideoId = 'An1ZrG0mbf4'
      const mockBeforeVideoId = 'd5rCB8xXTaw'
      const mockAfterVideoId = 's2_NQUi8gvo'
      const endpoint = `/videos/${mockVideoId}/change-order`
      const { generateAccessToken } = authUtils

      it('moves video to start', async () => {
        const video = { id: 1, topic_id: mockTopicId, rank: 'a1', yt_video_id: mockVideoId }
        const beforeVideo = { id: 2, topic_id: mockTopicId, rank: 'a0' }
        const topic = { id: mockTopicId, level_id: 'A1' }
        const body = { before: mockBeforeVideoId, after: null }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(videosModel, 'find')
          .mockResolvedValueOnce(video as any)
          .mockResolvedValueOnce(beforeVideo as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const updateSpy = vi.spyOn(videosModel, 'updateRank').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(204)
        expect(updateSpy).toHaveBeenCalledWith(mockVideoId, 'Zz')
        expect(emitSpy).toHaveBeenCalledWith('video.rank.updated', { topicId: topic.id })
      })

      it('moves video to end', async () => {
        const video = { id: 1, topic_id: mockTopicId, rank: 'a0', yt_video_id: mockVideoId }
        const afterVideo = { id: 2, topic_id: mockTopicId, rank: 'a1' }
        const topic = { id: mockTopicId, level_id: 'A1' }
        const body = { before: null, after: mockAfterVideoId }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(videosModel, 'find')
          .mockResolvedValueOnce(video as any)
          .mockResolvedValueOnce(afterVideo as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const updateSpy = vi.spyOn(videosModel, 'updateRank').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(204)
        expect(updateSpy).toHaveBeenCalledWith(mockVideoId, 'a2')
        expect(emitSpy).toHaveBeenCalledWith('video.rank.updated', { topicId: topic.id })
      })

      it('moves video between two videos', async () => {
        const video = { id: 1, topic_id: mockTopicId, rank: 'a2', yt_video_id: mockVideoId }
        const afterVideo = { id: 2, topic_id: mockTopicId, rank: 'a0' }
        const beforeVideo = { id: 3, topic_id: mockTopicId, rank: 'a1' }
        const topic = { id: mockTopicId, level_id: 'A1' }
        const body = { before: mockBeforeVideoId, after: mockAfterVideoId }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(videosModel, 'find')
          .mockResolvedValueOnce(video as any)
          .mockResolvedValueOnce(beforeVideo as any)
          .mockResolvedValueOnce(afterVideo as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const updateSpy = vi.spyOn(videosModel, 'updateRank').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(204)
        expect(updateSpy).toHaveBeenCalledWith(mockVideoId, 'a0V')
        expect(emitSpy).toHaveBeenCalledWith('video.rank.updated', { topicId: topic.id })
      })
    })

    describe('DELETE /videos/:id', () => {
      const mockTopicId = '916ce8b4-b0fe-4ab6-945f-def908317370'
      const mockVideoId = 'An1ZrG0mbf4'
      const endpoint = `/videos/${mockVideoId}`
      const { generateAccessToken } = authUtils

      it('removes video', async () => {
        const topic = { id: mockTopicId, level_id: 'A1' }
        const video = { id: 1, yt_video_id: mockVideoId }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(videosModel, 'find').mockResolvedValue(video as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const removeSpy = vi.spyOn(videosModel, 'remove').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .delete(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])

        expect(res.status).toBe(204)
        expect(removeSpy).toHaveBeenCalledWith(video.yt_video_id)
        expect(emitSpy).toHaveBeenCalledWith('video.deleted', {
          levelId: topic.level_id,
          topicId: topic.id,
          ytVideoId: video.yt_video_id,
        })
      })
    })

    describe('PATCH /videos/:id/toggle-complete', () => {
      const mockVideoId = 'An1ZrG0mbf4'
      const endpoint = `/videos/${mockVideoId}/toggle-complete`
      const { generateAccessToken } = authUtils

      it('marks video as completed when not already completed', async () => {
        const user = { id: 1, googleId: 'g-123' }
        const video = { id: 1 }
        const token = generateAccessToken('1h', mockUser)

        vi.spyOn(videosModel, 'find').mockResolvedValue(video as any)
        vi.spyOn(userModel, 'find').mockResolvedValue(user as any)
        vi.spyOn(userCompletedVideosModel, 'createIfNotExists').mockResolvedValue({
          rowCount: 1,
        } as any)

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ completed: true })
      })

      it('removes video completion when already completed', async () => {
        const user = { id: 1, googleId: 'g-123' }
        const video = { id: 1 }
        const token = generateAccessToken('1h', mockUser)

        vi.spyOn(videosModel, 'find').mockResolvedValue(video as any)
        vi.spyOn(userModel, 'find').mockResolvedValue(user as any)
        vi.spyOn(userCompletedVideosModel, 'createIfNotExists').mockResolvedValue({
          rowCount: 0,
        } as any)
        const removeSpy = vi
          .spyOn(userCompletedVideosModel, 'remove')
          .mockResolvedValue(undefined as any)

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])

        expect(res.status).toBe(200)
        expect(res.body).toEqual({ completed: false })
        expect(removeSpy).toHaveBeenCalledWith({
          user_id: user.id,
          video_id: video.id,
        })
      })
    })
  })

  describe('Topics', () => {
    describe('POST /topics', () => {
      const endpoint = '/topics'
      const { generateAccessToken } = authUtils

      it('creates a topic', async () => {
        const body = { levelId: 'A1', title: 'New Topic' }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        const createSpy = vi.spyOn(topicsModel, 'create').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .post(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(201)
        expect(createSpy).toHaveBeenCalledWith({
          level_id: body.levelId,
          title: body.title,
        })
        expect(emitSpy).toHaveBeenCalledWith('topic.created', {
          levelId: body.levelId,
        })
      })
    })

    describe('PATCH /topics/:id', () => {
      const mockTopicId = '916ce8b4-b0fe-4ab6-945f-def908317370'
      const endpoint = `/topics/${mockTopicId}`
      const { generateAccessToken } = authUtils

      it('updates topic title', async () => {
        const topic = { id: mockTopicId, level_id: 'A1' }
        const body = { newTitle: 'Updated Title' }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const updateSpy = vi.spyOn(topicsModel, 'updateTitle').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .patch(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])
          .send(body)

        expect(res.status).toBe(204)
        expect(updateSpy).toHaveBeenCalledWith(topic.id, body.newTitle)
        expect(emitSpy).toHaveBeenCalledWith('topic.updated', {
          levelId: topic.level_id,
          topicId: topic.id,
        })
      })
    })

    describe('DELETE /topics/:id', () => {
      const mockTopicId = '916ce8b4-b0fe-4ab6-945f-def908317370'
      const endpoint = `/topics/${mockTopicId}`
      const { generateAccessToken } = authUtils

      it('removes topic', async () => {
        const topic = { id: mockTopicId, level_id: 'A1' }
        const token = generateAccessToken('1h', { ...mockUser, role: 'admin' })

        vi.spyOn(topicsModel, 'find').mockResolvedValue(topic as any)
        const removeSpy = vi.spyOn(topicsModel, 'remove').mockResolvedValue(undefined as any)
        // @ts-ignore
        const emitSpy = vi.spyOn(events, 'emit').mockImplementation(() => {})

        const res = await request(app)
          .delete(endpoint)
          .set('Cookie', [`${constants.ACCESS_TOKEN_COOKIE_NAME}=${token}`])

        expect(res.status).toBe(204)
        expect(removeSpy).toHaveBeenCalledWith(topic.id)
        expect(emitSpy).toHaveBeenCalledWith('topic.deleted', {
          levelId: topic.level_id,
          topicId: topic.id,
        })
      })
    })
  })
})
