/* eslint-disable prettier/prettier */
import { notFound } from "next/navigation";

import { BlogCategoryList } from "@/components/blog-category-list";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

export async function generateMetadata() {
  return getSEOMetadata({
    title: "Blog Categories",
    description: "Browse our blog posts organized by category",
    pageType: "website",
  });
}

export default async function BlogCategoriesPage() {
  const [res, err] = await fetchBlogPosts();
  if (err || !res?.data) notFound();

  const { blogs = [] } = res.data;

  // Ensure categories is never null and name/slug are non-null strings
  const normalizedBlogs = blogs.map((blog) => ({
    ...blog,
    categories: (blog.categories ?? [])
      .filter((cat) => cat && cat.name && cat.slug)
      .map((cat) => ({
        ...cat,
        name: cat.name ?? "",
        slug: cat.slug ?? "",
      })),
  }));

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
