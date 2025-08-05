import { BriefcaseIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "title",
      type: "string",
      title: "Job Title",
      description: "A descriptive name for this job",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A job title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Detailed description of the job and what metals are being processed",
      group: GROUP.MAIN_CONTENT,
      rows: 4,
      validation: (Rule) => Rule.required().error("A job description is required"),
    }),
    defineField({
      name: "metals",
      type: "array",
      title: "Metals",
      description: "The metals being weighed and purchased for this job",
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
      validation: (Rule) => 
        Rule.required().error("At least one metal entry is required")
        .min(1).error("At least one metal entry is required"),
    }),
    defineField({
      name: "totalWeight",
      type: "number",
      title: "Total Weight",
      description: "The total weight of all metals in this job",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      validation: (Rule) => Rule.min(0).error("Total weight must be a positive number"),
    }),
    defineField({
      name: "totalPurchasePrice",
      type: "number",
      title: "Total Purchase Price",
      description: "The total amount paid for all metals in this job",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      validation: (Rule) => Rule.min(0).error("Total purchase price must be a positive number"),
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
      validation: (Rule) => Rule.required().error("Date created is required"),
    }),
    defineField({
      name: "dateCompleted",
      type: "date",
      title: "Date Completed",
      description: "When this job was completed (if applicable)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "customerName",
      type: "string",
      title: "Customer Name",
      description: "The name of the customer for this job",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "customerContact",
      type: "text",
      title: "Customer Contact",
      description: "Contact information for the customer",
      group: GROUP.MAIN_CONTENT,
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      totalWeight: "totalWeight",
      totalPrice: "totalPurchasePrice",
      customerName: "customerName",
      dateCreated: "dateCreated",
    },
    prepare: ({ title, status, totalWeight, totalPrice, customerName, dateCreated }) => {
      const statusIndicator = status === "completed" ? "✅" : 
                             status === "in-progress" ? "🔄" : "❌";
      const weightInfo = totalWeight ? ` • ${totalWeight} lbs` : "";
      const priceInfo = totalPrice ? ` • $${totalPrice}` : "";
      const customerInfo = customerName ? ` • ${customerName}` : "";
      const dateInfo = dateCreated ? ` • ${new Date(dateCreated).toLocaleDateString()}` : "";

      return {
        title: title || "Untitled Job",
        subtitle: `${statusIndicator}${weightInfo}${priceInfo}${customerInfo}${dateInfo}`,
      };
    },
  },
}); 