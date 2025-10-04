import { afterEach, describe, it, vi, expect } from 'vitest'
import { isValidEasyGermanVideo } from '../src/utils/videos.utils'
import * as authUtils from '../src/utils/auth.utils'
import { ytBaseVideo } from './testData'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Utils', () => {
  describe('Videos', () => {
    describe('isValidEasyGermanVideo', () => {
      it('returns true when all conditions are met', () => {
        expect(isValidEasyGermanVideo(ytBaseVideo)).toBe(true)
      })

      it('returns false if channelId is wrong', () => {
        expect(
          isValidEasyGermanVideo({
            ...ytBaseVideo,
            snippet: { ...ytBaseVideo.snippet, channelId: 'wrong' },
          })
        ).toBe(false)
      })

      it('returns false if privacyStatus is not public', () => {
        ;['private', 'unlisted'].forEach((status) => {
          expect(
            isValidEasyGermanVideo({
              ...ytBaseVideo,
              status: { ...ytBaseVideo.status, privacyStatus: status },
            })
          ).toBe(false)
        })
      })

      it('returns false if liveBroadcastContent is not none', () => {
        ;['live', 'upcoming'].forEach((value) => {
          expect(
            isValidEasyGermanVideo({
              ...ytBaseVideo,
              snippet: { ...ytBaseVideo.snippet, liveBroadcastContent: value },
            })
          ).toBe(false)
        })
      })

      it('returns false if uploadStatus is not processed', () => {
        ;['deleted', 'failed', 'rejected', 'uploaded'].forEach((status) => {
          expect(
            isValidEasyGermanVideo({
              ...ytBaseVideo,
              status: { ...ytBaseVideo.status, uploadStatus: status },
            })
          ).toBe(false)
        })
      })

      it('returns false if embeddable is false', () => {
        expect(
          isValidEasyGermanVideo({
            ...ytBaseVideo,
            status: { ...ytBaseVideo.status, embeddable: false },
          })
        ).toBe(false)
      })
    })
  })

  describe('Auth', () => {
    describe('sanitizeNextURL', () => {
      const { sanitizeNextURL } = authUtils

      it('returns same url when it starts with /', () => {
        expect(sanitizeNextURL('/home')).toBe('/home')
      })

      it('returns / when url starts with //', () => {
        expect(sanitizeNextURL('//another')).toBe('/')
      })

      it('returns / when url is undefined or does not start with /', () => {
        expect(sanitizeNextURL(undefined)).toBe('/')
        expect(sanitizeNextURL('http://example.com')).toBe('/')
        expect(sanitizeNextURL('relative/path')).toBe('/')
      })
    })
  })
})
