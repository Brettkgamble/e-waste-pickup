import { ClockIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const process = defineType({
  name: "process",
  title: "Process",
  type: "document",
  icon: ClockIcon,
  groups: GROUPS,
  description: "A processing step for e-waste materials with time tracking and weight measurements",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Process Name",
      description: "Name of the processing step or operation",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Process name is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description: "Detailed description of what this process involves",
      group: GROUP.MAIN_CONTENT,
      rows: 4,
      validation: (Rule) => Rule.required().error("Process description is required"),
    }),
    defineField({
      name: "startingWeight",
      type: "number",
      title: "Starting Weight",
      description: "The weight of materials at the start of this process (in pounds)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.required().error("Starting weight is required")
        .min(0).error("Starting weight must be a positive number"),
    }),
    defineField({
      name: "timeRecords",
      type: "array",
      title: "Time Records",
      description: "Individual time entries for tracking work on this process",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "timeRecord",
        }),
      ],
    }),
    defineField({
      name: "metals",
      type: "array",
      title: "Metals",
      description: "The metals being processed in this step",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "metals" }],
        }),
      ],
      validation: (Rule) => 
        Rule.required().error("At least one metal is required")
        .min(1).error("At least one metal is required"),
    }),
    defineField({
      name: "dateCreated",
      type: "date",
      title: "Date Created",
      description: "When this process was created",
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (Rule) => Rule.required().error("Date created is required"),
    }),
    defineField({
      name: "materialUsages",
      type: "array",
      title: "Material Usages",
      description: "Materials used in this processing step with quantities and costs",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "materialUsage" }],
        }),
      ],
    }),
    defineField({
      name: "images",
      type: "array",
      title: "Process Images",
      description: "Images documenting the processing steps, equipment, or results",
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
      startingWeight: "startingWeight",
      timeRecords: "timeRecords",
      dateCreated: "dateCreated",
    },
    prepare: ({ name, startingWeight, timeRecords, dateCreated }) => {
      // Calculate total time from timeRecords
      let totalMinutes = 0;
      if (timeRecords && Array.isArray(timeRecords)) {
        totalMinutes = timeRecords.reduce((total, record) => {
          if (record.startTime && record.endTime) {
            const start = new Date(record.startTime).getTime();
            const end = new Date(record.endTime).getTime();
            const duration = Math.round((end - start) / (1000 * 60)); // Convert to minutes
            return total + duration;
          }
          return total;
        }, 0);
      }
      
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeInfo = totalMinutes > 0 ? ` • ${hours}h ${minutes}m` : "";
      const weightInfo = startingWeight ? ` • ${startingWeight} lbs` : "";
      const dateInfo = dateCreated ? ` • ${new Date(dateCreated).toLocaleDateString()}` : "";

      return {
        title: name || "Unnamed Process",
        subtitle: `${timeInfo}${weightInfo}${dateInfo}`,
      };
    },
  },
});
