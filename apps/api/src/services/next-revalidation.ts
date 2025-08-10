import fetch from 'node-fetch'
import env from '../env'

export function revalidateTags(tags: string[]) {
  const url = new URL('/revalidate', env.CLIENT_ORIGIN)
  const params = new URLSearchParams()
  tags.forEach((t) => params.append('tag', t))
  url.search = params.toString()
  return fetch(url, {
    method: 'POST',
    headers: {
      'X-Revalidation-Secret': env.NEXT_REVALIDATION_SECRET,
    },
  })
}
