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
      description: "The weight of materials at the start of this process (in grams",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.required().error("Starting weight is required")
        .min(0).error("Starting weight must be a positive number"),
    }),
    defineField({
      name: "yieldWeight",
      type: "number",
      title: "Yield Weight",
      description: "The weight of materials produced at the end of this process (in grams)",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.min(0).error("Yield weight must be a positive number"),
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
      name: "dateCompleted",
      type: "date",
      title: "Date Completed",
      description: "When this process was completed (if applicable)",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "materialUsages",
      type: "array",
      title: "Material Usages",
      description: "Materials used in this processing step with quantities and costs",
      group: GROUP.MAIN_CONTENT,
      of: [
        defineArrayMember({
          type: "object",
          name: "materialUsage",
          title: "Material Usage",
          fields: [
            defineField({
              name: "material",
              type: "reference",
              title: "Material",
              description: "The material being used",
              to: [{ type: "materials" }],
              validation: (Rule) => Rule.required().error("Material reference is required"),
            }),
            defineField({
              name: "quantityUsed",
              type: "object",
              title: "Quantity Used",
              description: "Amount of material used in this specific process",
              fields: [
                defineField({
                  name: "amount",
                  type: "number",
                  title: "Amount",
                  description: "Quantity of material used",
                  validation: (Rule) => 
                    Rule.required().error("Amount is required")
                    .min(0).error("Amount must be a positive number"),
                }),
                defineField({
                  name: "unit",
                  type: "string",
                  title: "Unit of Measurement",
                  description: "Unit for the quantity used",
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
                  validation: (Rule) => Rule.required().error("Unit is required"),
                }),
              ],
              options: {
                columns: 2,
              },
            }),
            defineField({
              name: "costDetails",
              type: "object",
              title: "Cost Details",
              description: "Cost information for this specific usage",
              fields: [
                defineField({
                  name: "unitCost",
                  type: "number",
                  title: "Unit Cost",
                  description: "Cost per unit for this usage (in dollars)",
                  validation: (Rule) => 
                    Rule.required().error("Unit cost is required")
                    .min(0).error("Unit cost must be a positive number"),
                }),
                defineField({
                  name: "totalCost",
                  type: "string",
                  title: "Total Cost",
                  description: "Total cost for this usage (calculated automatically as amount × unit cost)",
                  readOnly: true,
                }),
                defineField({
                  name: "currency",
                  type: "string",
                  title: "Currency",
                  description: "Currency for the cost",
                  options: {
                    list: [
                      { title: "Canadian Dollar (C$)", value: "CAD" },
                    ],
                    layout: "radio",
                  },
                  initialValue: "CAD",
                  validation: (Rule) => Rule.required().error("Currency is required"),
                }),
              ],
              options: {
                columns: 2,
              },
            }),
            defineField({
              name: "dateUsed",
              type: "date",
              title: "Date Used",
              description: "When this material was used in the process",
              initialValue: () => new Date().toISOString().split("T")[0],
              validation: (Rule) => Rule.required().error("Date used is required"),
            }),
            defineField({
              name: "notes",
              type: "text",
              title: "Usage Notes",
              description: "Additional notes about how this material was used",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              materialName: "material.name",
              amount: "quantityUsed.amount",
              unit: "quantityUsed.unit",
              unitCost: "costDetails.unitCost",
              currency: "costDetails.currency",
              dateUsed: "dateUsed",
            },
            prepare: ({ materialName, amount, unit, unitCost, currency, dateUsed }) => {
              const quantityInfo = amount && unit ? `${amount} ${unit}` : "";
              // Calculate total cost from amount and unit cost
              const totalCost = amount && unitCost ? (amount * unitCost).toFixed(2) : "";
              const costInfo = totalCost && currency ? ` • C$${totalCost} ${currency}` : "";
              const dateInfo = dateUsed ? ` • ${new Date(dateUsed).toLocaleDateString()}` : "";

              return {
                title: materialName || "Unknown Material",
                subtitle: `${quantityInfo}${costInfo}${dateInfo}`,
              };
            },
          },
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
      yieldWeight: "yieldWeight",
      timeRecords: "timeRecords",
      dateCreated: "dateCreated",
      dateCompleted: "dateCompleted",
    },
    prepare: ({ name, startingWeight, yieldWeight, timeRecords, dateCreated, dateCompleted }) => {
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
      const weightInfo = startingWeight ? ` • ${startingWeight} g` : "";
      const yieldInfo = yieldWeight ? ` • Yield: ${yieldWeight} g` : "";
      const statusInfo = dateCompleted ? " • Completed" : " • In Progress";
      const dateInfo = dateCompleted 
        ? ` • ${new Date(dateCompleted).toLocaleDateString()}` 
        : dateCreated ? ` • Started ${new Date(dateCreated).toLocaleDateString()}` : "";

      return {
        title: name || "Unnamed Process",
        subtitle: `${timeInfo}${weightInfo}${yieldInfo}${statusInfo}${dateInfo}`,
      };
    },
  },
});
