import Link from "next/link";

import type { Blog } from "@/types/blog";

import { SanityImage } from "./sanity-image";

// Define BlogAuthor type for convenience
export type BlogAuthor = Blog["authors"] extends Array<infer T>
  ? T
  : { _id: string; name: string; position?: string; image?: any };

interface BlogImageProps {
  image: Blog["image"];
  title?: string | null;
}

function BlogImage({ image, title }: BlogImageProps) {
  if (!image?.asset) return null;

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl bg-gray-100 overflow-hidden">
      <SanityImage
        asset={image}
        alt={title ?? "Blog post image"}
        fill
        priority={false}
        loading="lazy"
        quality={80}
        objectFit="cover"
        className="rounded-2xl"
      />
    </div>
  );
}

interface AuthorImageProps {
  author?: BlogAuthor;
}

function AuthorImage({ author }: AuthorImageProps) {
  if (!author?.image) return null;
  return (
    <SanityImage
      asset={author.image}
      width={40}
      height={40}
      alt={author.name ?? "Author image"}
      className="size-8 flex-none rounded-full bg-gray-50"
    />
  );
}

interface BlogAuthorProps {
  author?: BlogAuthor;
}

export function BlogAuthor({ author }: BlogAuthorProps) {
  if (!author) return null;
  return (
    <div className="flex items-center gap-x-2.5 text-sm/6 font-semibold text-gray-900">
      <AuthorImage author={author} />
      {author.name}
    </div>
  );
}

interface BlogCardProps {
  blog: Blog;
}

function BlogMeta({ publishedAt }: { publishedAt: string | null }) {
  return (
    <div className="flex items-center gap-x-4 text-xs my-4">
      <time dateTime={publishedAt ?? ""} className="text-muted-foreground">
        {publishedAt
          ? new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : ""}
      </time>
    </div>
  );
}

function BlogContent({
  title,
  slug,
  description,
  isFeatured,
}: {
  title: string | null;
  slug: string | null;
  description: string | null;
  isFeatured?: boolean;
}) {
  const HeadingTag = isFeatured ? "h2" : "h3";
  const headingClasses = isFeatured
    ? "mt-3 text-3xl font-semibold leading-tight"
    : "mt-3 text-lg font-semibold leading-6";

  return (
    <div className="group relative">
      <HeadingTag className={headingClasses}>
        <Link href={slug ?? "#"}>
          <span className="absolute inset-0" />
          {title}
        </Link>
      </HeadingTag>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AuthorSection({ authors }: { authors?: Blog["authors"] }) {
  if (!Array.isArray(authors) || authors.length === 0) return null;
  const author = authors[0];
  if (!author) return null;
  return (
    <div className="mt-6 flex border-t border-gray-900/5 pt-6">
      <div className="relative flex items-center gap-x-4">
        <AuthorImage author={author} />
        <div className="text-sm leading-6">
          <p className="font-semibold">
            <span className="absolute inset-0" />
            {author.name}
          </p>
        </div>
      </div>
    </div>
  );
}
export function FeaturedBlogCard({ blog }: BlogCardProps) {
  const { title, publishedAt, slug, authors, description, image } = blog ?? {};
  const normalizedPublishedAt = publishedAt ?? null;
  const normalizedSlug = typeof slug === "object" ? slug.current ?? null : slug ?? null;
  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <BlogImage image={image} title={title} />
      <div className="space-y-6">
        <BlogMeta publishedAt={normalizedPublishedAt} />
        <BlogContent
          title={title}
          slug={normalizedSlug}
          description={description}
          isFeatured
        />
        <AuthorSection authors={authors} />
      </div>
    </article>
  );
}

export function BlogCard({ blog }: BlogCardProps) {
  if (!blog) {
    return (
      <article className="grid grid-cols-1 gap-4 w-full">
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-6 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </article>
    );
  }

  const { title, publishedAt, slug, authors, description, image } = blog;
  const normalizedPublishedAt = publishedAt ?? null;
  const normalizedSlug = typeof slug === "object" ? slug.current ?? null : slug ?? null;
  return (
    <article className="grid grid-cols-1 gap-4 w-full">
      <div className="relative w-full h-auto aspect-[16/9] overflow-hidden rounded-2xl">
        <BlogImage image={image} title={title} />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="w-full space-y-4">
        <BlogMeta publishedAt={normalizedPublishedAt} />
        <BlogContent title={title} slug={normalizedSlug} description={description} />
        <AuthorSection authors={authors} />
      </div>
    </article>
  );
}

export function BlogHeader({
  title,
  description,
}: {
  title: string | null;
  description: string | null;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
