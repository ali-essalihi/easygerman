import type { GetAllTopicsRes, LevelId } from '@easygerman/shared/types'
import TopicListItem from './TopicListItem'
import EmptyList from '../EmptyList'

interface Props {
  topics: GetAllTopicsRes['topics']
  levelId: LevelId
}

export default function TopicsList({ topics, levelId }: Props) {
  if (topics.length === 0) {
    return <EmptyList>No topics added to this level yet</EmptyList>
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {topics.map((topic) => (
        <li key={topic.id}>
          <TopicListItem levelId={levelId} topic={topic} />
        </li>
      ))}
    </ul>
  )
}
