"use client";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import { CTABlock } from "./sections/cta";
import { useOptimistic } from "@sanity/visual-editing/react";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";
import type { PagebuilderType } from "@/types";
import {
  createDataAttribute,
  type SanityDocument,
} from "next-sanity";
import { dataset, projectId, studioUrl } from "@/lib/sanity/api";
import type { ComponentType } from "react";

type PageBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

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

const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  featureCardsIcon: FeatureCardsWithIcon,
  hero: HeroBlock,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

export function PageBuilder({
  pageBuilder: initialPageBuilder = [],
  id,
  type,
}: PageBuilderProps) {
  const pageBuilder = useOptimistic<
    PageBlock[],
    SanityDocument<PageData>
  >(initialPageBuilder, (currentPageBuilder, action) => {
    if (action.id === id && action.document.pageBuilder) {
      return action.document.pageBuilder;
    }

    return currentPageBuilder;
  });

  return (
    <main
      className="flex flex-col gap-16 my-16"
      data-sanity={createDataAttribute({
        id: id,
        baseUrl: studioUrl,
        projectId: projectId,
        dataset: dataset,
        type: type,
        path: "pageBuilder",
      }).toString()}
    >
      {pageBuilder.map((block) => {
        const Component = BLOCK_COMPONENTS[
          block._type
        ] as ComponentType<PagebuilderType<BlockType>>;

        if (!Component) {
          return (
            <div key={`${block._type}-${block._key}`}>
              Component not found for block type: {block._type}
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
