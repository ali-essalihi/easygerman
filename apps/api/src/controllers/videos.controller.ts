import type { Request, Response } from 'express'
import type {
  ChangeVideoOrderReq,
  CreateVideoReq,
  GetAllVideosRes,
  GetVideosProgressRes,
  ToggleCompleteRes,
} from '@easygerman/shared/types'
import * as videosModel from '../models/videos.model'
import * as userCompletedVideosModel from '../models/user-completed-videos.model'
import * as userModel from '../models/user.model'
import * as topicsModel from '../models/topics.model'
import iso8601Duration from 'iso8601-duration'
import { getYoutubeVideo } from '../utils/youtube.utils'
import { isValidEasyGermanVideo } from '../utils/videos.utils'
import { generateKeyBetween } from 'fractional-indexing'
import AppError from '../AppError'

export async function createVideo(req: Request, res: Response) {
  const body = req.body as CreateVideoReq
  const topic = await topicsModel.find(body.topicId)

  if (!topic) {
    throw new AppError(404, 'Topic not found')
  }

  if (await videosModel.find(body.ytVideoId)) {
    throw new AppError(409, 'Video already exists')
  }

  const ytVideo = await getYoutubeVideo(body.ytVideoId)

  if (!ytVideo || !isValidEasyGermanVideo(ytVideo)) {
    throw new AppError(422, 'Invalid Easy German video')
  }

  const maxRank = await videosModel.getMaxRank(body.topicId)
  const rank = generateKeyBetween(maxRank, null)
  const durationSeconds = iso8601Duration.toSeconds(
    iso8601Duration.parse(ytVideo.contentDetails.duration)
  )

  await videosModel.create({
    topic_id: body.topicId,
    yt_video_id: body.ytVideoId,
    title: ytVideo.snippet.title,
    duration_seconds: durationSeconds,
    rank,
  })

  res.status(201).end()
}

export async function changeVideoOrder(req: Request, res: Response) {
  const { before, after } = req.body as ChangeVideoOrderReq
  const { videoId: ytVideoId } = req.params

  if (!before && !after) {
    throw new AppError(400, 'Either "before" or "after" must be provided.')
  }

  if (after === before || after === ytVideoId || before === ytVideoId) {
    throw new AppError(400, 'Invalid order: conflicting video IDs.')
  }

  let beforeRank: string | null = null
  let afterRank: string | null = null

  if (before) {
    const beforeVideo = await videosModel.find(before)
    if (!beforeVideo || beforeVideo.topic_id !== req.video.topic_id) {
      throw new AppError(422, '"before" video must exist in the same topic.')
    }
    beforeRank = beforeVideo.rank
  }

  if (after) {
    const afterVideo = await videosModel.find(after)
    if (!afterVideo || afterVideo.topic_id !== req.video.topic_id) {
      throw new AppError(422, '"after" video must exist in the same topic.')
    }
    afterRank = afterVideo.rank
  }

  const rank = generateKeyBetween(afterRank, beforeRank)

  await videosModel.updateRank(ytVideoId, rank)

  res.status(204).end()
}

export async function deleteVideo(req: Request, res: Response) {
  const { videoId: ytVideoId } = req.params
  await videosModel.remove(ytVideoId)
  res.status(204).end()
}

export async function toggleComplete(req: Request, res: Response<ToggleCompleteRes>) {
  const dbUser = (await userModel.find(req.user.googleId))!
  const insertResult = await userCompletedVideosModel.createIfNotExists({
    user_id: dbUser.id,
    video_id: req.video.id,
  })
  if (insertResult.rowCount === 0) {
    await userCompletedVideosModel.remove({
      user_id: dbUser.id,
      video_id: req.video.id,
    })
    return res.json({ completed: false })
  }
  res.json({ completed: true })
}

export async function getVideosProgress(req: Request, res: Response<GetVideosProgressRes>) {
  const dbUser = (await userModel.find(req.user.googleId))!
  const completedVideos = await userCompletedVideosModel.getAll(dbUser.id, req.topic.id)
  res.json({ completedVideos: completedVideos.map(({ yt_video_id }) => yt_video_id) })
}

export async function getAllVideos(req: Request, res: Response<GetAllVideosRes>) {
  const videos = await videosModel.getAll(req.topic.id)
  res.json({
    videos: videos.map((v) => ({
      ytVideoId: v.yt_video_id,
      title: v.title,
      durationSeconds: v.duration_seconds,
    })),
  })
}
