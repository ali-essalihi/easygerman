import fetch from 'node-fetch'
import env from '../env'
import { REVALIDATION_SECRET_HEADER, REVALIDATION_TAG_PARAM } from '@easygerman/shared/revalidation'

export function revalidateTags(tags: string[]) {
  const url = new URL('/api/revalidate', env.CLIENT_ORIGIN)
  const params = new URLSearchParams()
  tags.forEach((t) => params.append(REVALIDATION_TAG_PARAM, t))
  url.search = params.toString()
  return fetch(url, {
    method: 'POST',
    headers: {
      [REVALIDATION_SECRET_HEADER]: env.NEXT_REVALIDATION_SECRET,
    },
  })
}
