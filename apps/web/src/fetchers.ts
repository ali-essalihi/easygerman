import 'server-only'
import type {
  LevelId,
  GetLevelSummaryRes,
  GetAllTopicsRes,
  GetTopicDetailRes,
  GetAllVideosRes,
  GetVideoDetailRes,
} from '@easygerman/shared/types'
import { tagGenerators } from '@easygerman/shared/revalidation'

type FetchApiDataOptionsBase = {
  url: string
  tags: string[]
  searchParams?: Record<string, string>
}

type FetchApiDataOptionsWithHandle<N extends boolean> = FetchApiDataOptionsBase & {
  handleNotFound?: N
}

async function fetchApiData<T, N extends boolean = false>(
  options: FetchApiDataOptionsWithHandle<N>
): Promise<N extends true ? T | null : T> {
  const { url, tags, searchParams, handleNotFound = false } = options
  const reqUrl = new URL(url, process.env.NEXT_PUBLIC_API_URL)
  if (searchParams) {
    reqUrl.search = new URLSearchParams(searchParams).toString()
  }
  const res = await fetch(reqUrl, {
    next: { tags },
  })
  if (handleNotFound && res.status === 404) {
    return null as any
  }
  if (res.status !== 200) {
    throw new Error(`Unexpected response (${res.status}) from ${reqUrl.toString()}`)
  }
  return res.json() as any
}

export async function fetchLevelSummary(levelId: LevelId) {
  return fetchApiData<GetLevelSummaryRes>({
    url: `/levels/${levelId}`,
    tags: [tagGenerators.levelSummary(levelId)],
  })
}

export async function fetchTopicsList(levelId: LevelId) {
  return fetchApiData<GetAllTopicsRes>({
    url: '/topics',
    tags: [tagGenerators.topicsList(levelId)],
    searchParams: { levelId },
  })
}

export async function fetchTopicDetail(topicId: string) {
  return fetchApiData<GetTopicDetailRes, true>({
    url: `/topics/${topicId}`,
    tags: [tagGenerators.topicDetail(topicId)],
    handleNotFound: true,
  })
}

export async function fetchVideosList(topicId: string) {
  return fetchApiData<GetAllVideosRes>({
    url: '/videos',
    tags: [tagGenerators.videosList(topicId)],
    searchParams: { topicId },
  })
}

export async function fetchVideoDetail(ytVideoId: string) {
  return fetchApiData<GetVideoDetailRes, true>({
    url: `/videos/${ytVideoId}`,
    tags: [tagGenerators.videoDetail(ytVideoId)],
    handleNotFound: true,
  })
}
