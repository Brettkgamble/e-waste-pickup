import { Table as TableIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { TableCellContentInput } from "./table-content-input";

const tableCellText = defineArrayMember({
  name: "block",
  type: "block",
  styles: [{ title: "Normal", value: "normal" }],
  lists: [],
  marks: {
    annotations: [
      {
        name: "customLink",
        type: "object",
        title: "Internal/External Link",
        fields: [
          defineField({
            name: "customLink",
            type: "customUrl",
          }),
        ],
      },
      defineField({
        name: "inlineMath",
        title: "Inline Math",
        description: "Insert a math equation inline with the text.",
        type: "inlineMath",
      }),
    ],
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
    ],
  },
});

export const table = defineType({
  name: "table",
  title: "Table",
  type: "object",
  icon: TableIcon,
  fields: [
    defineField({
      name: "headerRow",
      description: "Mark the first row as table headers",
      type: "string",
      initialValue: "no",
      options: {
        list: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "rows",
      description: "Add rows and cells to build the table content",
      type: "array",
      of: [
        defineArrayMember({
          name: "row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              description: "Add the cells for this row in order",
              type: "array",
              of: [
                defineArrayMember({
                  name: "cell",
                  type: "object",
                  fields: [
                    defineField({
                      name: "content",
                      description: "Text content shown inside the table cell",
                      type: "array",
                      of: [
                        tableCellText,
                        defineArrayMember({
                          name: "mathBlock",
                          title: "Math",
                          type: "mathBlock",
                        }),
                      ],
                      components: {
                        input: TableCellContentInput,
                      },
                    }),
                  ],
                  preview: {
                    select: {
                      content: "content",
                    },
                    prepare: ({ content }) => ({
                      title: "Table cell",
                      subtitle: content?.length
                        ? "Cell content configured"
                        : "Empty cell",
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              cells: "cells",
            },
            prepare: ({ cells }) => ({
              title: "Table row",
              subtitle: `${cells?.length ?? 0} cells`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      rows: "rows",
      headerRow: "headerRow",
    },
    prepare: ({ rows, headerRow }) => {
      const rowCount = rows?.length ?? 0;
      const columnCount = rows?.[0]?.cells?.length ?? 0;
      const headerLabel = headerRow === "yes" ? "Header row" : "No headers";
      return {
        title: "Table",
        subtitle: `${rowCount} rows • ${columnCount} columns • ${headerLabel}`,
      };
    },
  },
});
