import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/config";
import { client } from "@/lib/sanity/client";
import { querySitemapData } from "@/lib/sanity/query";

type SitemapPage = { slug: string; lastModified?: string };

const baseUrl = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugPages, blogPages } = await client.fetch(querySitemapData);
  const normalizedSlugPages: SitemapPage[] = (slugPages ?? [])
    .filter((page) => page?.slug)
    .map((page) => ({
      ...page,
      slug: page.slug ?? "",
    }));
  const normalizedBlogPages: SitemapPage[] = (blogPages ?? [])
    .filter((page) => page?.slug)
    .map((page) => ({
      ...page,
      slug: page.slug ?? "",
    }));
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...normalizedSlugPages.map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...normalizedBlogPages.map((page) => ({
      url: `${baseUrl}${page.slug}`,
      lastModified: new Date(page.lastModified ?? new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
