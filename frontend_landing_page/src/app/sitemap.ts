import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bifrost.sh'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Ajouter les autres routes publiques au fur et à mesure
    // { url: `${BASE_URL}/pricing`, ... }
    // { url: `${BASE_URL}/blog`, ... }
  ]
}
