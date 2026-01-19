import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  description: "Organize blog posts with top-level categories and sub-categories",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      description: "The label shown to readers in category listings",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("A category name is required"),
    }),
    defineField({
      name: "slug",
      description: "The URL-friendly version of the category name",
      type: "slug",
      options: {
        source: "name",
      },
      validation: (Rule) =>
        Rule.required().error("A category slug is required"),
    }),
    defineField({
      name: "subCategories",
      description:
        "Drag to set the order of sub-categories shown on the website",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
      validation: (Rule) =>
        Rule.unique()
          .error("Sub-categories must be unique")
          .custom(async (subCategories, context) => {
            if (!subCategories?.length || !context.document?._id) {
              return true;
            }

            const normalizeId = (value?: string) =>
              value?.replace(/^drafts\./, "");
            const documentId = normalizeId(context.document._id);
            if (!documentId) return true;

            const subCategoryIds = subCategories
              .map((subcategory: { _ref?: string }) => normalizeId(subcategory?._ref))
              .filter(Boolean) as string[];

            if (subCategoryIds.includes(documentId)) {
              return "A category cannot include itself as a sub-category";
            }

            try {
              const client = context.getClient({ apiVersion: "2023-10-01" });
              const categoryGraph = await client.fetch(
                `*[_type == "category"]{
                  _id,
                  "subCategories": subCategories[]._ref
                }`,
              );

              const graph = new Map<string, string[]>();
              categoryGraph.forEach(
                (category: { _id: string; subCategories?: string[] }) => {
                  const id = normalizeId(category._id);
                  if (!id) return;
                  const children =
                    category.subCategories?.map(normalizeId).filter(Boolean) ?? [];
                  graph.set(id, children);
                },
              );

              const hasCycle = (startId: string) => {
                const visited = new Set<string>();
                const stack = [...(graph.get(startId) ?? [])];
                while (stack.length > 0) {
                  const currentId = stack.pop();
                  if (!currentId || visited.has(currentId)) continue;
                  if (currentId === documentId) return true;
                  visited.add(currentId);
                  const children = graph.get(currentId);
                  if (children) {
                    children.forEach((childId) => stack.push(childId));
                  }
                }
                return false;
              };

              const hasCircularReference = subCategoryIds.some((subcategoryId) =>
                hasCycle(subcategoryId),
              );

              return hasCircularReference
                ? "Circular sub-category relationships are not allowed"
                : true;
            } catch (error) {
              return true;
            }
          }),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subCategories: "subCategories",
      slug: "slug.current",
    },
    prepare: ({ title, subCategories, slug }) => {
      const subCategoryCount = subCategories?.length ?? 0;
      const subCategoryLabel =
        subCategoryCount === 0
          ? "No sub-categories"
          : `${subCategoryCount} sub-categories`;
      return {
        title: title || "Untitled category",
        subtitle: `${subCategoryLabel} • ${slug ?? "No slug"}`,
      };
    },
  },
});
