import { BriefcaseIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import UuidFieldComponent from "../../components/uuid-field-component";
import { GROUP, GROUPS } from "../../utils/constant";

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  icon: BriefcaseIcon,
  groups: GROUPS,
  description: "A job that involves purchasing and weighing scrap metals",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Job Name",
      description: "A descriptive name for this job",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A job title is required"),
    }),
    defineField({
      name: "jobId",
      type: "string",
      title: "Job ID",
      description: "Unique identifier that can be generated using the button below",
      group: GROUP.MAIN_CONTENT,
      components: {
        input: UuidFieldComponent,
      },
      validation: (Rule) => Rule.required().error("Job ID is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Detailed description of the job and what metals are being processed",
      group: GROUP.MAIN_CONTENT,
      rows: 4,
    }),
      defineField({
      name: "images",
      title: "Job Images",
      description: "Images related to this job (e.g., photos of the metals, job site, or equipment)",
      type: "array",
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
      name: "metals",
      type: "array",
      title: "Metals",
      description: "The metals being weighed and recyled for this job",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "object",
          name: "metalEntry",
          title: "Metal Entry",
          fields: [
            defineField({
              name: "metal",
              type: "reference",
              title: "Metal Type",
              description: "Select the type of metal",
              to: [{ type: "metals" }],
              validation: (Rule) => Rule.required().error("Metal type is required"),
            }),
            defineField({
              name: "weight",
              type: "number",
              title: "Weight",
              description: "The weight of this metal in the specified unit",
              validation: (Rule) => 
                Rule.required().error("Weight is required")
                .min(0).error("Weight must be a positive number"),
            }),
            defineField({
              name: "purchasePrice",
              type: "number",
              title: "Purchase Price",
              description: "The total price paid for this metal",
              validation: (Rule) => 
                Rule.required().error("Purchase price is required")
                .min(0).error("Purchase price must be a positive number"),
            }),
            defineField({
              name: "notes",
              type: "text",
              title: "Notes",
              description: "Additional notes about this metal entry",
              rows: 2,
            }),
            defineField({
              name: "images",
              type: "array",
              title: "Metal Entry Images",
              description: "Images documenting this specific metal entry (e.g., photos of the metal, weighing process, or condition)",
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
              metalName: "metal.name",
              weight: "weight",
              price: "purchasePrice",
            },
            prepare: ({ metalName, weight, price }) => ({
              title: metalName || "Unknown Metal",
              subtitle: `${weight} lbs • $${price}`,
            }),
          },
        }),
      ],
    }),
      defineField({
      name: "totalWeight",
      type: "number",
      title: "Total Recyclable Metal Weight",
      description: "The total weight of all recyclable metals collected in this job (in pounds)",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      validation: (Rule) => Rule.min(0).error("Total weight must be a positive number"),
    }),
      defineField({
      name: "totalPurchasePrice",
      type: "number",
      title: "Total Income from Recyclable Metals",
      description: "The total income generated from all recyclable metals in this job (in dollars)",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      validation: (Rule) => Rule.min(0).error("Total income must be a positive number"),
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Job Status",
      description: "The current status of this job",
      group: GROUP.MAIN_CONTENT,
      options: {
        list: [
          { title: "In Progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "in-progress",
      validation: (Rule) => Rule.required().error("Job status is required"),
    }),
      defineField({
      name: "dateCreated",
      type: "date",
      title: "Date Created",
      description: "When this job was created",
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
    }),
    defineField({
      name: "dateCompleted",
      type: "date",
      title: "Date Completed",
      description: "When this job was completed (if applicable)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "customer",
      type: "array",
      title: "Customer",
      description: "The customer(s) for this job",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "customer" }],
        }),
      ],
    }),
      defineField({
      name: "relatedBlogPosts",
      type: "array",
      title: "Related Blog Posts",
      description: "Blog posts that are related to this job",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "blog" }],
        }),
      ],
    }),
    defineField({
      name: "processes",
      type: "array",
      title: "Processes",
      description: "Processing steps associated with this job",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "process" }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      name: "name",
      jobId: "jobId",
      media: "images.0.asset",
    },
    prepare: ({
      name,
      jobId,
      media,
    }) => {
      return {
        title: name || "Untitled Blog",
        subtitle: jobId,
        media,
      };
    },
  },
}); 