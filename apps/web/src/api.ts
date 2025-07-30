import ky from 'ky'

export const api = ky.create({
  credentials: 'include',
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  retry: {
    limit: 0,
    afterStatusCodes: [],
  },
})
