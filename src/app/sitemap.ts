import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://oceanbasketball.vn';
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/hoc-thu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}