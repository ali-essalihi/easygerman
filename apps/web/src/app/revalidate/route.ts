import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Revalidation-Secret')
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response(null, {
      status: 401,
    })
  }
  const tags = req.nextUrl.searchParams.getAll('tag')
  tags.forEach((tag) => revalidateTag(tag))
  return new Response(null, {
    status: 200,
  })
}
