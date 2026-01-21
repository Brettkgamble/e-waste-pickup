import { CodeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const mathBlock = defineType({
  name: "mathBlock",
  title: "Math Block",
  description: "Display an equation as a standalone block.",
  type: "object",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "tex",
      title: "Equation",
      description: "Enter the LaTeX equation to render.",
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
        title: "Math Block",
        subtitle: tex || "No equation",
      };
    },
  },
});
