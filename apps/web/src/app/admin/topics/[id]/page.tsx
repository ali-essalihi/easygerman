'use client'

import type { GetTopicDetailRes } from '@easygerman/shared/types'
import useSWR from 'swr'
import { api } from '@/api'
import VideosManagement from '../../_components/VideosManagement'
import Breadcrumb from '@/components/Breadcrumb'
import LabeledIcon from '@/components/LabeledIcon'
import { VideoLibIcon } from '@/constants'

const fetcher = (url: string) => api.get<GetTopicDetailRes>(url).json()

export default function AdminTopicPage({ params }: { params: { id: string } }) {
  const { data: topic } = useSWR(`topics/${params.id}`, fetcher)

  if (!topic) {
    return null
  }

  return (
    <>
      <Breadcrumb
        items={[
          { href: '/admin', label: 'Admin' },
          { href: `/admin/levels/${topic.levelId}`, label: topic.levelId },
        ]}
      />
      <h1 className="text-3xl text-gray-800 font-bold mb-2">{topic.title}</h1>
      <div className="mb-4">
        <LabeledIcon Icon={VideoLibIcon} label={topic.totalVideos.toString()} />
      </div>
      <VideosManagement levelId={topic.levelId} topicId={topic.id} />
    </>
  )
}
