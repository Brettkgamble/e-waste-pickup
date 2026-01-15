import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "./api";

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

const fetchWithNextCache: typeof fetch = (input, init) => {
  if (!isProduction) {
    return fetch(input, init);
  }

  const next = (init as RequestInit & { next?: { revalidate?: number } })?.next;

  return fetch(input, {
    ...init,
    next: next ?? { revalidate: 60 },
  });
};

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    studioUrl,
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
  },
  fetch: fetchWithNextCache,
});

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");
