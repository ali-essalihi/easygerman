import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication Failed',
}

export default function AuthFailed() {
  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Authentication Failed</h1>
      <p className="text-lg">We couldn’t sign you in. Please try again.</p>
    </div>
  )
}
