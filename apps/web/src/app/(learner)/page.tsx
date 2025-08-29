import { Metadata } from 'next'
import LevelCard from '@/components/LevelCard'
import { levels } from '@/constants'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Easy German - Home',
}

export default function Home() {
  return (
    <>
      <h1 className="text-3xl text-gray-800 font-bold tracking-tight">
        Structured German Learning from Easy German Videos
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        This platform organizes Easy German YouTube videos into clear learning paths by language
        level and topic. Built and maintained by a fellow language learner, it helps you stay
        focused and track your progress more effectively.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {levels.map((l) => (
          <Link key={l.level} href={`/levels/${l.level}`} prefetch={false}>
            <LevelCard levelInfo={l} />
          </Link>
        ))}
      </div>
    </>
  )
}
