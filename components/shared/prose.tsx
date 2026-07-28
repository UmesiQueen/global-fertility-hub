import { type Block, type InlineNode, parseMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "strong") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: inline runs have no stable id
            <strong key={index} className="font-semibold text-foreground">
              {node.value}
            </strong>
          );
        }
        if (node.type === "em") {
          // biome-ignore lint/suspicious/noArrayIndexKey: inline runs have no stable id
          return <em key={index}>{node.value}</em>;
        }
        // biome-ignore lint/suspicious/noArrayIndexKey: inline runs have no stable id
        return <span key={index}>{node.value}</span>;
      })}
    </>
  );
}

/**
 * Renders an article or story body.
 *
 * Typography is set here rather than with a plugin so the measure, rhythm and
 * heading scale match the rest of the site. Long-form health content is often
 * read on a phone by someone who is tired — line length is capped around 68
 * characters and line height is generous on purpose.
 */
export function Prose({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks: Block[] = parseMarkdown(content);

  return (
    <div className={cn("max-w-[68ch]", className)}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag
              // biome-ignore lint/suspicious/noArrayIndexKey: blocks have no stable id
              key={index}
              className={cn(
                "font-heading font-bold tracking-tight text-foreground",
                block.level === 2
                  ? "mt-10 text-xl md:text-2xl"
                  : "mt-8 text-lg md:text-xl",
                index === 0 && "mt-0",
              )}
            >
              <Inline nodes={block.content} />
            </Tag>
          );
        }

        if (block.type === "list") {
          return (
            <ul
              // biome-ignore lint/suspicious/noArrayIndexKey: blocks have no stable id
              key={index}
              className="mt-4 flex flex-col gap-2 pl-5"
            >
              {block.items.map((item, itemIndex) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: list items have no stable id
                  key={itemIndex}
                  className="list-disc text-base leading-relaxed text-muted-foreground marker:text-primary/50"
                >
                  <Inline nodes={item} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: blocks have no stable id
            key={index}
            className={cn(
              "text-base leading-[1.75] text-muted-foreground",
              index === 0 ? "mt-0" : "mt-4",
            )}
          >
            <Inline nodes={block.content} />
          </p>
        );
      })}
    </div>
  );
}
