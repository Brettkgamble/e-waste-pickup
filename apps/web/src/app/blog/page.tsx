/* eslint-disable prettier/prettier */
import { notFound } from "next/navigation";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { BlogCategoryList } from "@/components/blog-category-list";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";
import type { Blog, BlogCategory } from "@/types/blog";

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

export async function generateMetadata() {
  const { data: result } = await sanityFetch({
    query: queryBlogIndexPageData,
    stega: false,
  });
  return getSEOMetadata(
    result
      ? {
          title: result?.title ?? result?.seoTitle ?? "",
          description: result?.description ?? result?.seoDescription ?? "",
          slug: result?.slug ?? undefined,
          contentId: result?._id,
          contentType: result?._type,
        }
      : {},
  );
}

export default async function BlogIndexPage() {
  const [res, err] = await fetchBlogPosts();
  if (err || !res?.data) notFound();

  const {
    blogs = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    displayFeaturedBlogs,
    featuredBlogsCount,
  } = res.data;

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount)
    : 0;

  if (!blogs.length) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blog posts available at the moment.
          </p>
        </div>
        {pageBuilder && pageBuilder.length > 0 && (
          <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
        )}
      </main>
    );
  }

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

  // Sort blogs by publishedAt date (most recent first)
  const sortedBlogs = [...normalizedBlogs].sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return dateB - dateA; // Most recent first
  });

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  const featuredBlogs = shouldDisplayFeaturedBlogs
    ? sortedBlogs.slice(0, validFeaturedBlogsCount)
    : [];
  const remainingBlogs = shouldDisplayFeaturedBlogs
    ? sortedBlogs.slice(validFeaturedBlogsCount)
    : sortedBlogs;

  // Ensure categories is never null and name/slug are non-null strings
  // (already normalized above)

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        {featuredBlogs.length > 0 && (
          <div className="mx-auto mt-8 sm:mt-12 md:mt-16 mb-12 lg:mb-20 grid grid-cols-1 gap-8 md:gap-12">
            {featuredBlogs.map((blog: Blog) => (
              <FeaturedBlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {remainingBlogs.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {remainingBlogs.map((blog: Blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
        <BlogCategoryList
          blogs={normalizedBlogs}
          title="Browse by Category"
          description="Explore our blog posts organized by topic"
        />
      </div>
      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}
