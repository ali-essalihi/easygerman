import type { Metadata } from 'next'

const description =
  'Structured German learning paths with Easy German videos, organized by level and topic to keep you focused and make progress easier.'

export const metadata: Metadata = {
  description,
  openGraph: {
    type: 'website',
    description,
  },
  twitter: {
    description,
  },
}

export default function LearnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
