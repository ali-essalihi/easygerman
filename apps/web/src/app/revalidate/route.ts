import type { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { REVALIDATION_TAG_PARAM, REVALIDATION_SECRET_HEADER } from '@easygerman/shared/revalidation'

export async function POST(req: NextRequest) {
  const secret = req.headers.get(REVALIDATION_SECRET_HEADER)
  if (secret !== process.env.REVALIDATION_SECRET) {
    return new Response(null, {
      status: 401,
    })
  }
  const tags = req.nextUrl.searchParams.getAll(REVALIDATION_TAG_PARAM)
  tags.forEach((tag) => revalidateTag(tag))
  return new Response(null, {
    status: 200,
  })
}
