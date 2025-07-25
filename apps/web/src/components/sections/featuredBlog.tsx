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
  console.log("FeaturedBlog", blog );
  return (
    <section
      className="container mx-auto flex flex-col md:flex-row gap-8 py-16 md:data-[orientation='imageLeft']:flex-row-reverse md:data-[orientation='imageRight']:flex-row md:data-[orientation='imageCenter']:flex-col"
      data-orientation={stegaClean(orientation) || "imageLeft"}
    >
      <div className="w-full order-2 md:order-1">
        <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-start justify-items-start text-left">
          <h1 className={`text-xl lg:text-2xl font-semibold text-balance`}>
            <Link href={blog.slug}>
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
    </section>
  );
}
