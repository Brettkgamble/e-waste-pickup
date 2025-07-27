import { stegaClean } from "next-sanity";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";

import type { Blog } from "@/types/blog";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type featuredBlogProps = PagebuilderType<"featuredBlog">;

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


export function FeaturedBlog({
  blog,
  orientation,
  title,
  episode,
  liveDate,
}: featuredBlogProps) {
  // Clean the orientation value once to ensure consistency
  const cleanOrientation = stegaClean(orientation) || "imageLeft";
  
  // Ensure blog.slug is a string
  const blogSlug = typeof blog.slug === "object" ? blog.slug.current : blog.slug;

  return (
    <section id="featured-blog" className="px-4 py-4 sm:py-6 md:py-8">
      <div 
        className="container mx-auto flex flex-col md:flex-row gap-8 px-4 md:px-8 py-2 sm:py-4 md:py-6 lg:py-8 bg-gray-50 dark:bg-zinc-900 rounded-3xl overflow-hidden 
          md:data-[orientation='imageLeft']:flex-row-reverse md:data-[orientation='imageRight']:flex-row md:data-[orientation='imageCenter']:flex-col"
          data-orientation={cleanOrientation}
      >
        <div className="w-full order-2 md:order-1">
          <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-start justify-items-start text-left">
            <h1 className={`text-xl lg:text-2xl font-semibold text-balance`}>
              <Link href={blogSlug}>
                {blog.title}
              </Link>
            </h1>
            <RichText
              richText={blog?.richText}
              className="text-base line-clamp-6 md:text-lg font-normal"
          />
          </div>
        </div>
        <div className="w-full order-1 md:order-2">
          {blog?.image && (
            <BlogImage image={blog?.image} title={title} />
          )}  
        </div>
        </div>
    </section>
  );
}
