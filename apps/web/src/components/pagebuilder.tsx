"use client";
import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute, type SanityDocument } from "next-sanity";
import type { ComponentType } from "react";

import { dataset, projectId, studioUrl } from "@/lib/sanity/api";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeaturedBlog } from "./sections/featuredBlog";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";
import { ImageLinkCards } from "./sections/image-link-cards";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";

type PageBlock = any;

export type PageBuilderProps = {
  pageBuilder: PageBlock[];
  id: string;
  type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBlock[];
};

const BLOCK_COMPONENTS: Record<string, ComponentType<any>> = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  featuredBlog: FeaturedBlog,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

export function PageBuilder({
  pageBuilder: initialPageBuilder = [],
  id,
  type,
}: PageBuilderProps) {
  const pageBuilder = useOptimistic<PageBlock[], SanityDocument<PageData>>(
    initialPageBuilder,
    (currentPageBuilder, action) => {
      if (action.id === id && action.document.pageBuilder) {
        return action.document.pageBuilder;
      }

      return currentPageBuilder;
    },
  );

  return (
    <main
      // 0032 - removed gap-16 my-16
      className="flex flex-col max-w-7xl mx-auto"
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "pageBuilder",
      }).toString()}
    >
      {pageBuilder.map((block: any) => {
        const Component = BLOCK_COMPONENTS[block._type] as ComponentType<any>;

        if (!Component) {
          return (
            <div
              key={`${block._type}-${block._key}`}
              className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg"
            >
              Component not found for block type: <code>{block._type}</code>
            </div>
          );
        }

        return (
          <div
            key={`${block._type}-${block._key}`}
            data-sanity={createDataAttribute({
              id: id,
              baseUrl: studioUrl,
              projectId: projectId,
              dataset: dataset,
              type: type,
              path: `pageBuilder[_key=="${block._key}"]`,
            }).toString()}
          >
            <Component {...block} />
          </div>
        );
      })}
    </main>
  );
}
