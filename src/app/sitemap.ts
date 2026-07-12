import type { MetadataRoute } from "next";

import { artworksByYearDescending } from "@/content/artworks";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/gallery`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/cv`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const artworkRoutes: MetadataRoute.Sitemap = artworksByYearDescending.flatMap((collection) =>
    collection.works.map((work) => ({
      url: `${siteUrl}/gallery/${work.year}/${work.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    }))
  );

  return [...staticRoutes, ...artworkRoutes];
}
