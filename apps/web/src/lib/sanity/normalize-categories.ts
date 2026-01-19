import type { BlogCategory } from "@/types/blog";

export type RawCategory = {
  _id?: string | null;
  name?: string | null;
  slug?: BlogCategory["slug"] | null;
  subCategories?: Array<RawCategory | null> | null;
};

const normalizeSlug = (slug?: BlogCategory["slug"] | null) =>
  typeof slug === "object" ? slug?.current : slug;

const normalizeCategory = (category: RawCategory): BlogCategory => ({
  _id: category._id ?? "",
  name: category.name ?? "",
  slug: normalizeSlug(category.slug) ?? "",
  subCategories: normalizeBlogCategories(category.subCategories ?? []),
});

export const normalizeBlogCategories = (
  categories: Array<RawCategory | null | undefined> = [],
) =>
  categories
    .filter((category): category is RawCategory => Boolean(category?.name))
    .map((category) => normalizeCategory(category));
