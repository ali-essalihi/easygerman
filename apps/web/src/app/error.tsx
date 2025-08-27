'use client'

import Button from '@/components/Button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-4">Something Went Wrong</h1>
      <p className="text-lg mb-4">An unexpected error occurred.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
