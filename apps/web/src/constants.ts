import { MdOutlineVideoLibrary, MdOutlineBook } from 'react-icons/md'
import { LuPen, LuTrash } from 'react-icons/lu'
import { RxClock } from 'react-icons/rx'
import type { CEFRLevel } from '@/types/CEFRLevel'

export const levels: CEFRLevel[] = [
  { level: 'A1', label: 'Beginner', color: '#1c6fce' },
  { level: 'A2', label: 'Elementary', color: '#197e94' },
  { level: 'B1', label: 'Intermediate', color: '#1e8910' },
  { level: 'B2', label: 'Upper-Intermediate', color: '#53810e' },
  { level: 'C1', label: 'Advanced', color: '#b38200' },
  { level: 'C2', label: 'Proficient', color: '#800061' },
]

// Icons
export const VideoLibIcon = MdOutlineVideoLibrary
export const ClockIcon = RxClock
export const TopicIcon = MdOutlineBook
export const EditIcon = LuPen
export const DeleteIcon = LuTrash
