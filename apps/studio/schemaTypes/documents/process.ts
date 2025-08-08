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
      name: "accumulatedTime",
      type: "object",
      title: "Accumulated Time",
      description: "Total time spent on this process",
      group: GROUP.MAIN_CONTENT,
      fields: [
        defineField({
          name: "hours",
          type: "number",
          title: "Hours",
          description: "Number of hours",
          validation: (Rule) => 
            Rule.required().error("Hours are required")
            .min(0).error("Hours must be a positive number"),
        }),
        defineField({
          name: "minutes",
          type: "number",
          title: "Minutes",
          description: "Number of minutes (0-59)",
          validation: (Rule) => 
            Rule.required().error("Minutes are required")
            .min(0).max(59).error("Minutes must be between 0 and 59"),
        }),
      ],
      options: {
        columns: 2,
      },
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
      hours: "accumulatedTime.hours",
      minutes: "accumulatedTime.minutes",
      dateCreated: "dateCreated",
    },
    prepare: ({ name, startingWeight, hours, minutes, dateCreated }) => {
      const timeInfo = hours !== undefined && minutes !== undefined 
        ? ` • ${hours}h ${minutes}m` 
        : "";
      const weightInfo = startingWeight ? ` • ${startingWeight} lbs` : "";
      const dateInfo = dateCreated ? ` • ${new Date(dateCreated).toLocaleDateString()}` : "";

      return {
        title: name || "Unnamed Process",
        subtitle: `${timeInfo}${weightInfo}${dateInfo}`,
      };
    },
  },
});
