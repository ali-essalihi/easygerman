import type { CEFRLevel } from '@/types/CEFRLevel'

interface Props {
  levelInfo: CEFRLevel
}

export default function LevelCard({ levelInfo }: Props) {
  return (
    <div
      className="select-none p-4 text-white text-center text-lg font-medium rounded-lg shadow-md hover:shadow-xl"
      style={{ backgroundColor: levelInfo.color }}
    >
      {levelInfo.level} - {levelInfo.label}
    </div>
  )
}
