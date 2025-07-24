import { stegaClean } from "next-sanity";
import { BlogCard } from "@/components/blog-card";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";

type featuredBlogProps = PagebuilderType<"featuredBlog">;

export function FeaturedBlog({
  blog,
  title,
  episode,
  liveDate,
}: featuredBlogProps) {
  return (
    <section id="featuredblog">
      <div className="relative text-center">
        {/* <div className="w-full absolute top-0 left-0 text-center -mt-10">
          <div className="flex items-center justify-center  ">
            <span className="text-sm font-spaceMono uppercase md:text-lg text-balance text-white mr-[10px]">
              {title}
            </span>
            <h2 className="text-5xl font-semibold md:text-7xl text-balance  text-yellow-400">
              {episode}
            </h2>
            <h2 className="text-sm font-semibold md:text-lg text-balance text-white ml-[10px]">
              {liveDate}
            </h2>
          </div>
        </div> */}
        <div className="container w-3/4 mx-auto flex">
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
          {/* </div> */}
          {/* <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center text-left lg:items-start lg:justify-items-start">
            <div className="grid gap-4">
              <h1 className={`text-4xl lg:text-6xl font-semibold text-balance`}>
                {blog?.title}
              </h1>
              <RichText
                richText={blog?.richText}
                className="text-base line-clamp-6 md:text-lg font-normal"
              />
            </div>
          </div>
          {blog?.image && (
            <div className="md:h-96 w-3/5 mx-auto">
              <SanityImage
                asset={blog?.image}
                loading="eager"
                width={600}
                height={600}
                priority
                quality={80}
                className="max-h-96 w-full rounded-3xl object-cover "
              />
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
