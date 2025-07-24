/* eslint-disable prettier/prettier */
import { Images } from "lucide-react";
import { defineField, defineArrayMember, defineType } from "sanity";

export const featuredBlog = defineType({
  name: "featuredBlog",
  type: "object",
  icon: Images,
  fields: [
    defineField({
      name: "episode",
      title: "Episode",
      description: "The episode number of the blog",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "The title of the episode.  Typically 001, etc",
      type: "string",
    }),
    defineField({
      name: "liveDate",
      title: "Live Date",
      description: "The date the blog was published",
      type: "date",
    }),
    defineField({
          name: "blog",
          type: "array",
          title: "Featured Blog",
          description: "The blog to be displayed as the featured blog",
          of: [
            defineArrayMember({
              type: "reference",
              to: [
                {
                  type: "blog",
                  options: {
                    disableNew: true,
                  },
                },
              ],
              options: {
                disableNew: true,
              },
            }),
          ],
          validation: (Rule) => [
            Rule.required(),
            Rule.max(1),
            Rule.min(1),
            Rule.unique(),
          ],
        })
    ],
//   preview: {
//     select: {
//       title: "title",
//     },
//     prepare: ({ title }) => ({
//       title,
//       subtitle: "Text and Image",
// }),
//   },
});
