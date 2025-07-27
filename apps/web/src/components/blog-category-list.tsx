"use client";

import Link from "next/link";
import type { Blog } from "@/types/blog";

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
            category: {
              ...category,
              slug: typeof category.slug === "object" ? category.slug.current : category.slug,
            },
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
          const blogCount = categoryBlogs.length;

          return (
            <div
              key={category._id}
              className="border rounded-lg overflow-hidden"
            >
              <Link
                href={`/blog/categories/${category.slug}`}
                className="w-full px-6 py-4 bg-muted/50 hover:bg-muted transition-colors flex items-center justify-between text-left block"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold hover:underline">
                    {category.name}
                  </h3>
                  <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded-full">
                    {blogCount} {blogCount === 1 ? "post" : "posts"}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
