import type { MetadataRoute } from 'next'
import { levels } from '@/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  const urls: MetadataRoute.Sitemap = [{ url: `${baseUrl}/` }]
  levels.forEach((l) => {
    urls.push({ url: `${baseUrl}/levels/${l.level}/` })
  })
  return urls
}
