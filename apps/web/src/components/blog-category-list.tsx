"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { BlogCard } from "./blog-card";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number] & {
  categories?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

interface BlogCategoryListProps {
  blogs: Blog[];
  title?: string;
  description?: string;
}

interface CategoryGroup {
  category: Category;
  blogs: Blog[];
}

export function BlogCategoryList({
  blogs,
  title,
  description,
}: BlogCategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  // Group blogs by category
  const categoryGroups: CategoryGroup[] = blogs.reduce((groups, blog) => {
    if (!blog.categories || blog.categories.length === 0) {
      // Blogs without categories go to "Uncategorized"
      const uncategorizedGroup = groups.find((g) => !g.category);
      if (uncategorizedGroup) {
        uncategorizedGroup.blogs.push(blog);
      } else {
        groups.push({
          category: {
            _id: "uncategorized",
            name: "Uncategorized",
            slug: "uncategorized",
          },
          blogs: [blog],
        });
      }
    } else {
      // Group by first category (blogs can have multiple categories)
      const category = blog.categories[0];
      if (category) {
        const existingGroup = groups.find(
          (g) => g.category._id === category._id,
        );
        if (existingGroup) {
          existingGroup.blogs.push(blog);
        } else {
          groups.push({
            category,
            blogs: [blog],
          });
        }
      }
    }
    return groups;
  }, [] as CategoryGroup[]);

  // Sort categories alphabetically
  categoryGroups.sort((a, b) => {
    if (!a.category) return 1;
    if (!b.category) return -1;
    return a.category.name.localeCompare(b.category.name);
  });

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-8">
        {categoryGroups.map(({ category, blogs: categoryBlogs }) => {
          const isExpanded = expandedCategories.has(category._id);
          const blogCount = categoryBlogs.length;

          return (
            <div
              key={category._id}
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(category._id)}
                className="w-full px-6 py-4 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h3 className="text-lg font-semibold">
                    <Link
                      href={`/blog/categories/${category.slug}`}
                      className="hover:underline"
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {blogCount} {blogCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="p-6 bg-background">
                  <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
                    {categoryBlogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
