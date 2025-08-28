'use client'

import type { LevelId, GetAllVideosRes } from '@easygerman/shared/types'
import type { DragEndEvent } from '@dnd-kit/core'
import { useVideosActions, useVideosList } from '../_hooks/videos'
import { MdDragHandle } from 'react-icons/md'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '@/components/Button'
import { formatVideoDuration } from '@/utils/format'
import { DeleteIcon } from '@/constants'

interface Props {
  levelId: LevelId
  topicId: string
}

export default function VideosManagement({ levelId, topicId }: Props) {
  const videosList = useVideosList(topicId)
  const videosActions = useVideosActions(levelId, topicId)

  if (!videosList) {
    return null
  }

  return (
    <>
      <Button onClick={videosActions.create} className="mb-4">
        New video
      </Button>
      <VideosList videos={videosList} actions={videosActions} />
    </>
  )
}

interface VideosListProps {
  videos: GetAllVideosRes['videos']
  actions: ReturnType<typeof useVideosActions>
}

function VideosList({ videos, actions }: VideosListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const ytVideoIds = videos.map((v) => v.ytVideoId)

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event
    if (over && active.id !== over.id) {
      const activeId = active.id as string
      const overId = over.id as string
      const oldIndex = ytVideoIds.indexOf(activeId)
      const newIndex = ytVideoIds.indexOf(overId)
      const newVideos = arrayMove(videos, oldIndex, newIndex)
      const prevIndex = newIndex - 1
      const nextIndex = newIndex + 1
      let before = null
      let after = null
      if (newVideos[prevIndex]) after = newVideos[prevIndex].ytVideoId
      if (newVideos[nextIndex]) before = newVideos[nextIndex].ytVideoId
      actions.changeOder(activeId, { before, after }, newVideos)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ytVideoIds} strategy={verticalListSortingStrategy}>
        {videos.map((v) => (
          <VideoListItem key={v.ytVideoId} video={v} actions={actions} />
        ))}
      </SortableContext>
    </DndContext>
  )
}

interface VideoListItemProps {
  video: GetAllVideosRes['videos'][number]
  actions: ReturnType<typeof useVideosActions>
}

function VideoListItem({ video, actions }: VideoListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: video.ytVideoId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex py-2 hover:bg-gray-200 my-2 rounded">
        <div className="px-1 self-center cursor-grab" {...listeners} {...attributes}>
          <MdDragHandle size={20} className="text-gray-600" aria-hidden />
        </div>
        <div className="bg-gray-200 relative w-1/3 h-20 sm:w-1/4 sm:h-24">
          <img
            className="absolute size-full object-center object-cover"
            src={`https://img.youtube.com/vi/${video.ytVideoId}/mqdefault.jpg`}
            alt="Thumbnail"
            loading="lazy"
          />
          <span className="bg-black text-white text-xs px-0.5 py-px absolute right-0 bottom-0">
            {formatVideoDuration(video.durationSeconds)}
          </span>
        </div>
        <div className="flex-1 pl-2">
          <h2 className="text-sm font-medium mb-2">{video.title}</h2>
          <Button
            StartIcon={DeleteIcon}
            variant="text"
            color="danger"
            onClick={() => actions.remove(video.ytVideoId)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
