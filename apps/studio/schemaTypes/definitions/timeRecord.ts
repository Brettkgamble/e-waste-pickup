import { ClockIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const timeRecord = defineType({
  name: "timeRecord",
  title: "Time Record",
  type: "object",
  icon: ClockIcon,
  description: "A single time entry for tracking work on a process",
  fields: [
    defineField({
      name: "startTime",
      type: "datetime",
      title: "Start Time",
      description: "When the work session started",
      validation: (Rule) => Rule.required().error("Start time is required"),
    }),
    defineField({
      name: "endTime",
      type: "datetime",
      title: "End Time",
      description: "When the work session ended",
      validation: (Rule) => Rule.required().error("End time is required"),
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      description: "Brief description of what was done during this time period",
      validation: (Rule) => 
        Rule.max(100).warning("Description should be brief"),
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
      description: "Additional notes about this work session",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      startTime: "startTime",
      endTime: "endTime",
      description: "description",
    },
    prepare: ({ startTime, endTime, description }) => {
      const start = startTime ? new Date(startTime).toLocaleString() : "No start time";
      const end = endTime ? new Date(endTime).toLocaleString() : "No end time";
      const duration = startTime && endTime 
        ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)) + " min"
        : "";
      
      return {
        title: description || "Time Record",
        subtitle: `${start} - ${end}${duration ? ` (${duration})` : ""}`,
      };
    },
  },
});
