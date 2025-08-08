import { ScaleIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const metals = defineType({
  name: "metals",
  title: "Metals",
  type: "document",
  icon: ScaleIcon,
  groups: GROUPS,
  description: "Different types of scrap metals that can be weighed and purchased for jobs",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Metal Name",
      description: "The name of the metal type (e.g., Steel, Aluminum, Copper)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A metal name is required"),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Metal Type",
      description: "The category of metal",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Ferrous", value: "ferrous" },
          { title: "Non-Ferrous", value: "non-ferrous" },
          { title: "Precious", value: "precious" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("A metal type is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Additional details about this metal type",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
    defineField({
      name: "currentPricePerPound",
      type: "number",
      title: "Current Price per Pound",
      description: "The current market price per pound for this metal",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.required().error("Current price per pound is required")
        .min(0).error("Price must be a positive number"),
    }),
    defineField({
      name: "unit",
      type: "string",
      title: "Unit of Measurement",
      description: "The unit used for weighing this metal",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Pounds", value: "lbs" },
          { title: "Kilograms", value: "kg" },
          { title: "Tons", value: "tons" },
        ],
        layout: "radio",
      },
      initialValue: "lbs",
      validation: (Rule) => Rule.required().error("Unit of measurement is required"),
    }),
    defineField({
      name: "isActive",
      type: "string",
      title: "Status",
      description: "Whether this metal type is currently available for purchase",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
        ],
        layout: "radio",
      },
      initialValue: "active",
      validation: (Rule) => Rule.required().error("Status is required"),
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Metal Images",
      description: "Images of this metal type for identification and reference",
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
  ],
  preview: {
    select: {
      title: "name",
      type: "type",
      price: "currentPricePerPound",
      unit: "unit",
      status: "isActive",
    },
    prepare: ({ title, type, price, unit, status }) => {
      const statusIndicator = status === "active" ? "✅" : "❌";
      const typeLabel = type ? ` • ${type.charAt(0).toUpperCase() + type.slice(1)}` : "";
      const priceInfo = price ? ` • $${price}/${unit}` : "";

      return {
        title: title || "Untitled Metal",
        subtitle: `${statusIndicator}${typeLabel}${priceInfo}`,
      };
    },
  },
}); 