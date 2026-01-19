"use client";

import Link from "next/link";
import type { Blog, BlogCategory } from "@/types/blog";

type NormalizedCategory = {
  _id: string;
  name: string;
  slug: string;
  subCategories?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
};

interface BlogCategoryListProps {
  blogs: Blog[];
  categories: BlogCategory[];
  title?: string;
  description?: string;
}

interface CategoryGroup {
  category: NormalizedCategory;
  blogCount: number;
}

interface ParentCategoryGroup {
  parent: NormalizedCategory;
  categories: CategoryGroup[];
}

export function BlogCategoryList({
  blogs,
  categories,
  title,
  description,
}: BlogCategoryListProps) {
  const normalizeSlug = (slug: BlogCategory["slug"]) =>
    typeof slug === "object" ? slug.current : slug;
  const normalizeCategory = (category: BlogCategory): NormalizedCategory => ({
    ...category,
    name: category.name ?? "",
    slug: normalizeSlug(category.slug) ?? "",
    subCategories: (category.subCategories ?? [])
      .filter(Boolean)
      .map((subcategory) => ({
        ...subcategory,
        name: subcategory.name ?? "",
        slug: normalizeSlug(subcategory.slug) ?? "",
      }))
      .filter((subcategory) => subcategory._id && subcategory.name),
  });

  const normalizedCategories = categories
    .filter((category) => category && category._id)
    .map(normalizeCategory);

  const blogCounts = new Map<string, number>();
  let uncategorizedCount = 0;

  blogs.forEach((blog) => {
    if (!blog.categories || blog.categories.length === 0) {
      uncategorizedCount += 1;
      return;
    }

    blog.categories.forEach((category) => {
      if (!category?._id) return;
      blogCounts.set(
        category._id,
        (blogCounts.get(category._id) ?? 0) + 1,
      );
    });
  });

  const subCategoryIds = new Set<string>();
  const parentGroups: ParentCategoryGroup[] = [];

  normalizedCategories.forEach((category) => {
    const orderedSubCategories = category.subCategories ?? [];
    if (orderedSubCategories.length > 0) {
      orderedSubCategories.forEach((subcategory) => {
        subCategoryIds.add(subcategory._id);
      });
      parentGroups.push({
        parent: category,
        categories: orderedSubCategories.map((subcategory) => ({
          category: subcategory,
          blogCount: blogCounts.get(subcategory._id) ?? 0,
        })),
      });
    }
  });

  const standaloneCategories = normalizedCategories.filter(
    (category) =>
      !subCategoryIds.has(category._id) &&
      (category.subCategories?.length ?? 0) === 0,
  );
  standaloneCategories.forEach((category) => {
    parentGroups.push({
      parent: category,
      categories: [
        {
          category,
          blogCount: blogCounts.get(category._id) ?? 0,
        },
      ],
    });
  });

  const parentCategoryGroups = parentGroups.sort((a, b) =>
    a.parent.name.localeCompare(b.parent.name),
  );

  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts available.</p>
      </div>
    );
  }

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="space-y-8">
        {(title || description) && (
          <div className="text-center">
            {title && (
              <h1 className="text-3xl font-bold mb-2 sm:text-4xl">{title}</h1>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {parentCategoryGroups.map(({ parent, categories }) => (
          <section
            key={parent._id}
            className="border rounded-lg bg-muted/30 p-5 space-y-4"
          >
            <Link
              href={`/blog/categories/${parent.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {parent.name}
            </Link>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {categories.map(({ category, blogCount }) => (
                <Link
                  key={category._id}
                  href={`/blog/categories/${category.slug}`}
                  className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span className="text-sm font-semibold hover:underline">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {blogCount} {blogCount === 1 ? "post" : "posts"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {uncategorizedCount > 0 && (
          <section className="border rounded-lg bg-muted/30 p-5 space-y-4">
            <h2 className="text-xl font-semibold">Uncategorized</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href="/blog/categories/uncategorized"
                className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-left transition-colors hover:bg-muted"
              >
                <span className="text-sm font-semibold hover:underline">
                  Uncategorized
                </span>
                <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                  {uncategorizedCount}{" "}
                  {uncategorizedCount === 1 ? "post" : "posts"}
                </span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
