import { CalculatorIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import TotalCostFieldComponent from "../../components/total-cost-field-component";
import { GROUP, GROUPS } from "../../utils/constant";

export const materialUsage = defineType({
  name: "materialUsage",
  title: "Material Usage",
  type: "document",
  icon: CalculatorIcon,
  groups: GROUPS,
  description: "Tracks the usage of a specific material in a process with quantity, cost, and weight details",
  fields: [
    defineField({
      name: "material",
      type: "reference",
      title: "Material",
      description: "The material being used",
      to: [{ type: "materials" }],
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Material reference is required"),
    }),
    defineField({
      name: "process",
      type: "reference",
      title: "Process",
      description: "The process where this material is being used",
      to: [{ type: "process" }],
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Process reference is required"),
    }),
    defineField({
      name: "quantityUsed",
      type: "object",
      title: "Quantity Used",
      description: "Amount of material used in this specific process",
      group: GROUP.MAIN_CONTENT,
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
      group: GROUP.MAIN_CONTENT,
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
          components: {
            input: TotalCostFieldComponent,
          },
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
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (Rule) => Rule.required().error("Date used is required"),
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Usage Notes",
      description: "Additional notes about how this material was used",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
  ],
  preview: {
    select: {
      materialName: "material.name",
      processName: "process.name",
      amount: "quantityUsed.amount",
      unit: "quantityUsed.unit",
      unitCost: "costDetails.unitCost",
      currency: "costDetails.currency",
      dateUsed: "dateUsed",
    },
    prepare: ({ materialName, processName, amount, unit, unitCost, currency, dateUsed }) => {
      const quantityInfo = amount && unit ? `${amount} ${unit}` : "";
      // Calculate total cost from amount and unit cost
      const totalCost = amount && unitCost ? (amount * unitCost).toFixed(2) : "";
      const costInfo = totalCost && currency ? ` • C$${totalCost} ${currency}` : "";
      const dateInfo = dateUsed ? ` • ${new Date(dateUsed).toLocaleDateString()}` : "";

      return {
        title: `${materialName || "Unknown Material"} in ${processName || "Unknown Process"}`,
        subtitle: `${quantityInfo}${costInfo}${dateInfo}`,
      };
    },
  },
});
