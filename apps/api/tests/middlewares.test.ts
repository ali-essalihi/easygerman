import type { Request, Response, NextFunction } from 'express'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import validateReqSchema from '../src/middlewares/validate-req-schema'
import errorHandler from '../src/middlewares/error-handler'
import * as authUtils from '../src/utils/auth.utils'
import * as authMiddlewares from '../src/middlewares/auth.middlewares'
import * as dbLoaders from '../src/middlewares/db-loaders'
import * as topicsModel from '../src/models/topics.model'
import * as videosModel from '../src/models/videos.model'
import { mockUser } from './testData'
import { levelIdSchema, topicIdSchema, ytVideoIdSchema } from '@easygerman/shared/schemas'
import AppError from '../src/AppError'

afterEach(() => {
  vi.restoreAllMocks()
})

let req: Request
let res: Response
let next: NextFunction

beforeEach(() => {
  req = { body: {}, cookies: {}, params: {}, query: {} } as unknown as Request
  res = {
    json: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
  } as unknown as Response
  next = vi.fn() as NextFunction
})

describe('Middlewares', () => {
  describe('Auth', () => {
    describe('authenticate', () => {
      it('calls next without user when token invalid', () => {
        vi.spyOn(authUtils, 'verifyAccessToken').mockReturnValue(false)
        authMiddlewares.authenticate()(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(req.user).not.toBeDefined()
      })

      it('attaches user and calls next when token valid', () => {
        vi.spyOn(authUtils, 'verifyAccessToken').mockReturnValue(mockUser)
        authMiddlewares.authenticate()(req, res, next)
        expect(next).toHaveBeenCalled()
        expect(req.user).toEqual(mockUser)
      })
    })

    describe('ensureAuthenticated', () => {
      it('throws 401 when no user', async () => {
        await expect(() => authMiddlewares.ensureAuthenticated()(req, res, next)).toThrowAppError(
          401
        )
        expect(next).not.toHaveBeenCalled()
      })

      it('calls next when user exists', () => {
        req.user = mockUser
        authMiddlewares.ensureAuthenticated()(req, res, next)
        expect(next).toHaveBeenCalled()
      })
    })

    describe('ensureAdmin', () => {
      it('throws 403 when user is not admin', async () => {
        req.user = { ...mockUser, role: 'learner' }
        await expect(() => authMiddlewares.ensureAdmin()(req, res, next)).toThrowAppError(403)
        expect(next).not.toHaveBeenCalled()
      })

      it('calls next when user is admin', () => {
        req.user = { ...mockUser, role: 'admin' }
        authMiddlewares.ensureAdmin()(req, res, next)
        expect(next).toHaveBeenCalled()
      })
    })
  })

  describe('DB loaders', () => {
    describe('loadTopic', () => {
      const { loadTopic } = dbLoaders
      it('throws 404 if topic id is invalid', async () => {
        const safeParseMock = vi
          .spyOn(topicIdSchema, 'safeParse')
          .mockReturnValue({ success: false } as any)

        req.params.topicId = 'params-id'
        await expect(() => loadTopic('params')(req, res, next)).toThrowAppError(404)
        expect(safeParseMock).toHaveBeenCalledWith('params-id')
        expect(next).not.toHaveBeenCalled()

        req.query.topicId = 'query-id'
        await expect(() => loadTopic('query')(req, res, next)).toThrowAppError(404)
        expect(safeParseMock).toHaveBeenCalledWith('query-id')
        expect(next).not.toHaveBeenCalled()
      })

      it('throws 404 if topic not found in db', async () => {
        vi.spyOn(topicIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'valid-id',
        } as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(undefined)
        await expect(() => loadTopic('params')(req, res, next)).toThrowAppError(404)
        expect(next).not.toHaveBeenCalled()
      })

      it('attaches topic to req and calls next', async () => {
        const mockTopic = { id: 't1' }
        vi.spyOn(topicIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'valid-id',
        } as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(mockTopic as any)

        await loadTopic('params')(req, res, next)

        expect(req.topic).toBe(mockTopic)
        expect(next).toHaveBeenCalled()
      })
    })

    describe('loadVideoFromParams', () => {
      const { loadVideoFromParams } = dbLoaders
      it('throws 404 if video id is invalid', async () => {
        vi.spyOn(ytVideoIdSchema, 'safeParse').mockReturnValue({ success: false } as any)

        req.params.ytVideoId = 'invalid-id'
        await expect(() => loadVideoFromParams()(req, res, next)).toThrowAppError(404)
        expect(next).not.toHaveBeenCalled()
      })

      it('throws 404 if video not found in db', async () => {
        vi.spyOn(ytVideoIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'valid-id',
        } as any)
        vi.spyOn(videosModel, 'find').mockResolvedValue(undefined)

        await expect(() => loadVideoFromParams()(req, res, next)).toThrowAppError(404)
        expect(next).not.toHaveBeenCalled()
      })

      it('attaches video to req and calls next', async () => {
        const mockVideo = { id: 'v1', topic_id: 't1' }
        vi.spyOn(ytVideoIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'valid-id',
        } as any)
        vi.spyOn(videosModel, 'find').mockResolvedValue(mockVideo as any)

        await loadVideoFromParams()(req, res, next)

        expect(req.video).toBe(mockVideo)
        expect(req.topic).not.toBeDefined()
        expect(next).toHaveBeenCalled()
      })

      it('attaches video and topic if includeTopic = true', async () => {
        const mockVideo = { id: 'v1', topic_id: 't1' }
        const mockTopic = { id: 't1' }
        vi.spyOn(ytVideoIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'valid-id',
        } as any)
        vi.spyOn(videosModel, 'find').mockResolvedValue(mockVideo as any)
        vi.spyOn(topicsModel, 'find').mockResolvedValue(mockTopic as any)

        await loadVideoFromParams(true)(req, res, next)

        expect(req.video).toBe(mockVideo)
        expect(req.topic).toBe(mockTopic)
        expect(next).toHaveBeenCalled()
      })
    })

    describe('loadLevel', () => {
      const { loadLevel } = dbLoaders
      it('throws 404 if level id is invalid', async () => {
        const safeParseMock = vi
          .spyOn(levelIdSchema, 'safeParse')
          .mockReturnValue({ success: false } as any)

        req.params.levelId = 'params-id'
        await expect(() => loadLevel('params')(req, res, next)).toThrowAppError(404)
        expect(safeParseMock).toHaveBeenCalledWith('params-id')
        expect(next).not.toHaveBeenCalled()

        req.query.levelId = 'query-id'
        await expect(() => loadLevel('query')(req, res, next)).toThrowAppError(404)
        expect(safeParseMock).toHaveBeenCalledWith('query-id')
        expect(next).not.toHaveBeenCalled()
      })

      it('attaches level to req and calls next', () => {
        vi.spyOn(levelIdSchema, 'safeParse').mockReturnValue({
          success: true,
          data: 'lvl-1',
        } as any)

        loadLevel('params')(req, res, next)

        expect(req.level).toEqual({ id: 'lvl-1' })
        expect(next).toHaveBeenCalled()
      })
    })
  })

  describe('Global Error handler', () => {
    it('should handle AppError and return correct status + message', () => {
      const err = new AppError(404, 'Not found')
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(err.status)
      expect(res.json).toHaveBeenCalledWith({ message: err.message })
    })

    it('should handle generic errors with 500', () => {
      const err = new Error('Unexpected error')
      vi.spyOn(console, 'error').mockImplementation(() => {})
      errorHandler(err, req, res, next)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'Something went wrong!' })
    })
  })

  describe('Request body schema validator', () => {
    const schemaMock = { safeParse: vi.fn() } as any

    it('throws 400 when validation fails', async () => {
      schemaMock.safeParse.mockReturnValue({ success: false })
      const middleware = validateReqSchema(schemaMock)
      await expect(() => middleware(req, res, next)).toThrowAppError(400)
      expect(next).not.toHaveBeenCalled()
    })

    it('calls next() and set req.body when validation succeeds', () => {
      const parsedData = { username: 'Pain' }
      schemaMock.safeParse.mockReturnValue({
        success: true,
        data: parsedData,
      })
      const middleware = validateReqSchema(schemaMock)
      middleware(req, res, next)
      expect(req.body).toEqual(parsedData)
      expect(next).toHaveBeenCalledTimes(1)
    })
  })
})
