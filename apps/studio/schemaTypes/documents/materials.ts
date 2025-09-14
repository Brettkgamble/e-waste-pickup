import { PackageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const materials = defineType({
  name: "materials",
  title: "Materials",
  type: "document",
  icon: PackageIcon,
  groups: GROUPS,
  description: "Reusable catalog of materials available for e-waste processing operations",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Material Name",
      description: "Name of the material being used",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Material name is required"),
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Material Type",
      description: "The type or category of material",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Chemical", value: "chemical" },
          { title: "Mechanical", value: "mechanical" },
          { title: "Electronic", value: "electronic" },
          { title: "Consumable", value: "consumable" },
          { title: "Tool", value: "tool" },
          { title: "Equipment", value: "equipment" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Material type is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Detailed description of the material and its purpose",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
    defineField({
      name: "baseUnit",
      type: "string",
      title: "Base Unit",
      description: "The standard unit of measurement for this material",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "Pounds (lbs)", value: "lbs" },
          { title: "Kilograms (kg)", value: "kg" },
          { title: "Grams (g)", value: "g" },
          { title: "Ounces (oz)", value: "oz" },
          { title: "Liters (L)", value: "L" },
          { title: "Milliliters (mL)", value: "mL" },
          { title: "Gallons (gal)", value: "gal" },
          { title: "Cubic Feet (ft³)", value: "ft3" },
          { title: "Cubic Meters (m³)", value: "m3" },
          { title: "Pieces", value: "pieces" },
          { title: "Units", value: "units" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Base unit is required"),
    }),
    defineField({
      name: "supplier",
      type: "string",
      title: "Supplier",
      description: "Company or vendor that provided this material",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "dateAcquired",
      type: "date",
      title: "Date Acquired",
      description: "When this material was acquired",
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
    }),
    defineField({
      name: "expirationDate",
      type: "date",
      title: "Expiration Date",
      description: "When this material expires (if applicable)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Material Images",
      description: "Images of the material for reference",
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
      name: "name",
      type: "type",
      baseUnit: "baseUnit",
      supplier: "supplier",
    },
    prepare: ({ name, type, baseUnit, supplier }) => {
      const typeInfo = type ? ` • ${type}` : "";
      const unitInfo = baseUnit ? ` • ${baseUnit}` : "";
      const supplierInfo = supplier ? ` • ${supplier}` : "";

      return {
        title: name || "Unnamed Material",
        subtitle: `${typeInfo}${unitInfo}${supplierInfo}`,
      };
    },
  },
});
