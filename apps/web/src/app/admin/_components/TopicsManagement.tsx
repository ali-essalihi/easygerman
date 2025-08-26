'use client'

import { GetAllTopicsRes, LevelId } from '@easygerman/shared/types'
import { useTopicsActions, useTopicsList } from '../_hooks/topics'
import Button from '@/components/Button'
import Link from 'next/link'
import LabeledIcon from '@/components/LabeledIcon'
import { DeleteIcon, EditIcon, VideoLibIcon } from '@/constants'

interface Props {
  levelId: LevelId
}

export default function TopicsManagement({ levelId }: Props) {
  const topicsList = useTopicsList(levelId)
  const topicsActions = useTopicsActions(levelId)

  if (!topicsList) {
    return null
  }

  return (
    <>
      <Button onClick={topicsActions.create} className="mb-4">
        New topic
      </Button>
      <ul className="grid gap-4 md:grid-cols-2">
        {topicsList.map((topic) => (
          <li key={topic.id}>
            <TopicCard topic={topic} actions={topicsActions} />
          </li>
        ))}
      </ul>
    </>
  )
}

interface TopicCardProps {
  topic: GetAllTopicsRes['topics'][number]
  actions: ReturnType<typeof useTopicsActions>
}

function TopicCard({ topic, actions }: TopicCardProps) {
  const handleEdit = () => actions.updateTitle(topic.id)
  const handleDelete = () => actions.remove(topic.id)

  return (
    <div className="border rounded shadow-sm p-4">
      <h3 className="font-medium mb-2">
        <Link href={`/admin/topics/${topic.id}`} prefetch={false} className="hover:text-primary">
          {topic.title}
        </Link>
      </h3>
      <LabeledIcon Icon={VideoLibIcon} label={topic.totalVideos.toString()} />
      <div className="flex items-center space-x-2 mt-2">
        <Button StartIcon={EditIcon} variant="text" onClick={handleEdit}>
          Edit
        </Button>
        <Button StartIcon={DeleteIcon} variant="text" color="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}
