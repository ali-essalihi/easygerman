import Link from 'next/link'
import LevelCard from '@/components/LevelCard'
import { levels } from '@/constants'

export default function AdminHome() {
  return (
    <>
      <h1 className="text-3xl text-gray-800 font-bold mb-6">Administration</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {levels.map((l) => (
          <Link key={l.level} href={`/admin/levels/${l.level}`} prefetch={false}>
            <LevelCard levelInfo={l} />
          </Link>
        ))}
      </div>
    </>
  )
}
