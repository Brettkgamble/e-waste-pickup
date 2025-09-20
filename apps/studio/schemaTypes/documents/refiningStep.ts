import { FactoryIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const refiningStep = defineType({
  name: "refiningStep",
  title: "Refining Step",
  type: "document",
  icon: FactoryIcon,
  groups: GROUPS,
  description: "A step in the metal refining process that tracks recovered amounts",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "A descriptive title for this refining step",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Title is required"),
    }),
    defineField({
      name: "weightInGrams",
      type: "number",
      title: "Weight (Grams)",
      description: "The weight of metal recovered in this refining step",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.required().error("Weight is required")
        .min(0).error("Weight must be a positive number"),
    }),
    defineField({
      name: "date",
      type: "date",
      title: "Date",
      description: "The date when this refining step was completed",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Date is required"),
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Refining Step Images",
      description: "Images documenting this refining step",
      group: GROUP.MAIN_CONTENT,
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
      description: "Additional notes about this refining step",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      weight: "weightInGrams",
      date: "date",
      notes: "notes",
    },
    prepare: ({ title, weight, date, notes }) => {
      const weightText = weight ? `${weight}g` : "No weight";
      const dateText = date ? new Date(date).toLocaleDateString() : "No date";
      const notesText = notes ? ` • ${notes.substring(0, 50)}${notes.length > 50 ? "..." : ""}` : "";

      return {
        title: title || "Untitled Refining Step",
        subtitle: `${weightText} • ${dateText}${notesText}`,
      };
    },
  },
});
