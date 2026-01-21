import { CodeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const inlineMath = defineType({
  name: "inlineMath",
  title: "Inline Math",
  description: "Insert a math equation inline with text.",
  type: "object",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "tex",
      title: "Equation",
      description: "Enter the LaTeX equation to render inline.",
      type: "string",
      validation: (Rule) => Rule.required().error("Equation is required."),
    }),
  ],
  preview: {
    select: {
      tex: "tex",
    },
    prepare({ tex }) {
      return {
        title: "Inline Math",
        subtitle: tex || "No equation",
      };
    },
  },
});
