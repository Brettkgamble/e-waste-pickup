import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { BlogCategoryList } from "@/components/blog-category-list";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";
import type { Blog } from "@/types/blog";

async function fetchBlogPosts(includeProcesses: boolean) {
  return await handleErrors(
    sanityFetch({
      query: queryBlogIndexPageData,
      params: { includeProcesses },
    }),
  );
}

export async function generateMetadata() {
  return getSEOMetadata({
    title: "Blog Categories",
    description: "Browse our blog posts organized by category",
    pageType: "website",
  });
}

export default async function BlogCategoriesPage() {
  const session = await auth();
  const includeProcesses = Boolean(session);
  const [res, err] = await fetchBlogPosts(includeProcesses);
  if (err || !res?.data) notFound();

  const blogs = res.data.blogs ?? [];

  // Normalize nullable query results into Blog-shaped data
  const normalizedBlogs: Blog[] = blogs.map((blog: any) => {
    const authors = Array.isArray(blog.authors)
      ? blog.authors
      : blog.authors
        ? [blog.authors]
        : undefined;

    const categories = (blog.categories ?? [])
      .filter((cat: any) => cat && cat.name)
      .map((cat: any) => {
        const slugValue =
          cat.slug && typeof cat.slug === "object"
            ? cat.slug.current
            : cat.slug;
        return {
          ...cat,
          name: cat.name ?? "",
          slug: slugValue ?? "",
        };
      });

    return {
      ...blog,
      title: blog.title ?? "",
      slug: blog.slug ?? "",
      description: blog.description ?? null,
      image: blog.image ?? undefined,
      authors,
      categories,
    };
  });

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogCategoryList
          blogs={normalizedBlogs}
          title="Browse by Category"
          description="Click on a category to expand and view all posts"
        />
      </div>
    </main>
  );
}
