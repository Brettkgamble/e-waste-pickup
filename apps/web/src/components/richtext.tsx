import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

import { BlockMath, InlineMath, MathJaxProvider } from "./mathjax";
import { SanityImage } from "./sanity-image";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h2
          id={slug}
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h3 id={slug} className="scroll-m-20 text-2xl font-semibold">
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h4 id={slug} className="scroll-m-20 text-xl font-semibold">
          {children}
        </h4>
      );
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h5 id={slug} className="scroll-m-20 text-lg font-semibold">
          {children}
        </h5>
      );
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return (
        <h6 id={slug} className="scroll-m-20 text-base font-semibold">
          {children}
        </h6>
      );
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded-md border border-white/10 bg-opacity-5 p-1 text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    inlineMath: ({ value }) => {
      const tex = typeof value?.tex === "string" ? value.tex.trim() : "";
      if (!tex) return null;
      return <InlineMath tex={tex} />;
    },
    customLink: ({ children, value }) => {
      if (!value.href || value.href === "#") {
        console.warn("🚀 link is not set", value);
        return (
          <span className="underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }
      return (
        <Link
          className="underline decoration-dotted underline-offset-2"
          href={value.href}
          prefetch={false}
          aria-label={`Link to ${value?.href}`}
          target={value.openInNewTab ? "_blank" : "_self"}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <div className="my-4">
        <SanityImage
          asset={value}
          className="w-full h-auto rounded-lg"
          width={1600}
          height={900}
        />
      </div>
    ),
    mathBlock: ({ value }) => {
      const tex = typeof value?.tex === "string" ? value.tex.trim() : "";
      if (!tex) return null;
      return (
        <div className="my-4 overflow-x-auto">
          <BlockMath tex={tex} />
        </div>
      );
    },
    table: ({ value }) => {
      const rows = value?.rows ?? [];
      if (!rows.length) return null;

      const hasHeaderRow = value?.headerRow === "yes";
      const [headerRow, ...bodyRows] = rows;
      const tableBodyRows = hasHeaderRow ? bodyRows : rows;

      const renderCellContent = (cell: any) => (
        <PortableText
          value={cell.content ?? []}
          components={tableCellComponents}
        />
      );

      return (
        <div className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            {hasHeaderRow && headerRow && (
              <thead>
                <tr className="border-b bg-muted/30">
                  {(headerRow.cells ?? []).map((cell: any, cellIndex: number) => (
                    <th
                      key={cell._key ?? `header-${cellIndex}`}
                      scope="col"
                      className="align-top border-b border-r p-3 text-left font-semibold last:border-r-0"
                    >
                      {renderCellContent(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            {tableBodyRows.length > 0 && (
              <tbody>
                {tableBodyRows.map((row: any, rowIndex: number) => (
                  <tr key={row._key ?? rowIndex} className="border-b">
                    {(row.cells ?? []).map((cell: any, cellIndex: number) => (
                      <td
                        key={cell._key ?? `${rowIndex}-${cellIndex}`}
                        className="align-top border-b border-r p-3 last:border-r-0"
                      >
                        {renderCellContent(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      );
    },
  },
  hardBreak: () => <br />,
};

const tableCellComponents: Partial<PortableTextReactComponents> = {
  ...components,
  types: {
    image: components.types?.image,
    mathBlock: components.types?.mathBlock,
  },
};

export function RichText<T>({
  richText,
  className,
}: {
  richText?: T | null;
  className?: string;
}) {
  if (!richText) return null;

  return (
    <div
      className={cn(
        "prose prose-zinc prose-headings:scroll-m-24 prose-headings:text-opacity-90 prose-p:text-opacity-80 prose-a:decoration-dotted prose-ol:text-opacity-80 prose-ul:text-opacity-80 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 max-w-none dark:prose-invert",
        className,
      )}
    >
      <MathJaxProvider>
        <PortableText
          value={richText as unknown as PortableTextBlock[]}
          components={components}
          onMissingComponent={(_, { nodeType, type }) =>
            console.log("missing component", nodeType, type)
          }
        />
      </MathJaxProvider>
    </div>
  );
}
