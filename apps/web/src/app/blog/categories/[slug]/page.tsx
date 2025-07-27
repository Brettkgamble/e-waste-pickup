import { notFound } from "next/navigation";

import { BlogCard } from "@/components/blog-card";
import { sanityFetch } from "@/lib/sanity/live";
import { BLOGS_BY_CATEGORY_QUERY, CATEGORIES_QUERY } from "@/lib/sanity/query";
import type { Blog, BlogCategory } from "@/types/blog";

export default async function CategoryDetailPage(props: any) {
  const params = await props.params;
  const { slug } = params;

  // Fetch all categories and find the one matching the slug
  const { data: categories } = await sanityFetch({ query: CATEGORIES_QUERY });
  const typedCategories = categories as BlogCategory[];
  const category = typedCategories.find(
    (cat) =>
      (typeof cat.slug === "object" ? cat.slug?.current : cat.slug) === slug,
  );

  if (!category) notFound();

  // Fetch blogs for this category
  const { data: blogs } = await sanityFetch({
    query: BLOGS_BY_CATEGORY_QUERY,
    params: { categoryId: category._id },
  });
  const typedBlogs = blogs as Blog[];

  const validBlogs = typedBlogs.filter(
    (blog) =>
      Array.isArray(blog.authors) &&
      (blog.authors as any[]).every(
        (author) =>
          author &&
          typeof author === "object" &&
          typeof (author as any)._id === "string" &&
          typeof (author as any).name === "string",
      ),
  );

  // Sort blogs by publishedAt date (most recent first)
  const sortedBlogs = [...validBlogs].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA; // Most recent first
  });

  return (
    <main className="container my-16 mx-auto px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      {!sortedBlogs || sortedBlogs.length === 0 ? (
        <p>No blog posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          {sortedBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={{
                ...blog,
                description: blog.description ?? null,
                slug:
                  typeof blog.slug === "object"
                    ? (blog.slug?.current ?? "")
                    : (blog.slug ?? ""),
                richText: blog.richText ?? null,
                orderRank: blog.orderRank ?? null,
                publishedAt: blog.publishedAt ?? null,
                authors: blog.authors as any,
                categories: blog.categories as any,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
