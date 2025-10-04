import { afterEach, describe, it, vi, expect } from 'vitest'
import { getYoutubeVideo } from '../src/services/youtube'
import { revalidateTags } from '../src/services/next-revalidation'
import { REVALIDATION_SECRET_HEADER, REVALIDATION_TAG_PARAM } from '@easygerman/shared/revalidation'
import fetch, { Response } from 'node-fetch'
import { ytBaseVideo } from './testData'
import env from '../src/env'

vi.mock('node-fetch', async (importActual) => {
  const mod = await importActual<typeof import('node-fetch')>()
  return {
    __esModule: true,
    ...mod,
    default: vi.fn(),
  }
})

const mockFetch = vi.mocked(fetch)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Services', () => {
  describe('Youtube', () => {
    describe('getYoutubeVideo', () => {
      it('returns video data when API responds successfully', async () => {
        mockFetch.mockResolvedValue(
          new Response(JSON.stringify({ items: [ytBaseVideo] }), { status: 200 })
        )
        const video = await getYoutubeVideo('abc123')
        expect(video).toEqual(ytBaseVideo)
      })

      it('returns null if video not found', async () => {
        mockFetch.mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 }))
        const video = await getYoutubeVideo('nonexistent')
        expect(video).toBeNull()
      })

      it('throws error on failed fetch', async () => {
        mockFetch.mockResolvedValue(
          new Response('Forbidden', { status: 403, statusText: 'Forbidden' })
        )
        await expect(getYoutubeVideo('abc123')).rejects.toThrow()
      })
    })
  })

  describe('Next revalidation', () => {
    describe('revalidateTags', () => {
      it('calls fetch with correct URL and headers', async () => {
        const tags = ['tag1', 'tag2']
        await revalidateTags(tags)

        const calledUrl = mockFetch.mock.calls[0][0] as URL
        const options = mockFetch.mock.calls[0][1] as fetch.RequestInit

        expect(calledUrl.origin + calledUrl.pathname).toBe(env.CLIENT_ORIGIN + '/api/revalidate')
        expect(calledUrl.searchParams.getAll(REVALIDATION_TAG_PARAM)).toEqual(tags)
        expect(options.method).toBe('POST')
        expect((options.headers as any)[REVALIDATION_SECRET_HEADER]).toBe(
          env.NEXT_REVALIDATION_SECRET
        )
      })
    })
  })
})
