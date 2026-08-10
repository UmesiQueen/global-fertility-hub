/**
 * A deliberately small markdown parser.
 *
 * Content bodies use a narrow subset — headings, paragraphs, bullet lists and
 * inline emphasis — so this returns a typed block tree rather than an HTML
 * string. Two reasons that matters:
 *
 * 1. No `dangerouslySetInnerHTML`. Story bodies will eventually be
 *    community-submitted, and rendering user text as raw HTML on a health
 *    site is not a risk worth taking for the sake of italics.
 * 2. No dependency. A full markdown pipeline is a lot of bundle for five
 *    syntaxes, and this is replaced by the CMS's rich text anyway.
 *
 * Anything unrecognised falls through as plain paragraph text rather than
 * being dropped — content should never silently disappear.
 */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; value: string; href: string; external: boolean };

/**
 * Schemes we're willing to put in an href.
 *
 * Anything else — `javascript:`, `data:`, `vbscript:` — renders as plain text
 * instead. Story bodies will eventually be community-submitted, and a link is
 * the easiest way to smuggle script into a page.
 */
function safeHref(raw: string): { href: string; external: boolean } | null {
  const href = raw.trim();

  // In-app: relative paths and same-page anchors.
  if (href.startsWith("/") || href.startsWith("#")) {
    return { href, external: false };
  }

  if (/^https?:\/\//i.test(href) || /^mailto:/i.test(href)) {
    return { href, external: true };
  }

  return null;
}

export type Block =
  | { type: "heading"; level: 2 | 3; content: InlineNode[] }
  | { type: "paragraph"; content: InlineNode[] }
  | { type: "list"; items: InlineNode[][] };

/** Splits a line into text / link / bold / italic runs. */
export function parseInline(line: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  // Links first so their label can't be mangled by the emphasis rules, then
  // bold before italic — otherwise the single-asterisk rule eats the **.
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

  let lastIndex = 0;
  let match = pattern.exec(line);

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: line.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      const safe = safeHref(match[2]);
      // An unsafe scheme degrades to its label rather than vanishing — the
      // sentence still reads, it just isn't clickable.
      nodes.push(
        safe
          ? {
              type: "link",
              value: match[1],
              href: safe.href,
              external: safe.external,
            }
          : { type: "text", value: match[1] },
      );
    } else if (match[3] !== undefined) {
      nodes.push({ type: "strong", value: match[3] });
    } else if (match[4] !== undefined) {
      nodes.push({ type: "em", value: match[4] });
    }

    lastIndex = match.index + match[0].length;
    match = pattern.exec(line);
  }

  if (lastIndex < line.length) {
    nodes.push({ type: "text", value: line.slice(lastIndex) });
  }

  return nodes.length ? nodes : [{ type: "text", value: line }];
}

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  // Normalise line endings — content pasted from Word arrives with CRLF and
  // the blank-line split silently fails without this.
  const chunks = source.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);

  for (const chunk of chunks) {
    const lines = chunk
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) continue;

    const heading = lines[0].match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length === 2 ? 2 : 3,
        content: parseInline(heading[2]),
      });

      // A heading chunk may carry trailing prose on the following lines.
      const rest = lines.slice(1);
      if (rest.length) {
        blocks.push({ type: "paragraph", content: parseInline(rest.join(" ")) });
      }
      continue;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push({
        type: "list",
        items: lines.map((line) => parseInline(line.replace(/^[-*]\s+/, ""))),
      });
      continue;
    }

    blocks.push({ type: "paragraph", content: parseInline(lines.join(" ")) });
  }

  return blocks;
}

/**
 * Plain text, for meta descriptions and previews — strips syntax without
 * needing the caller to walk the block tree.
 */
export function markdownToPlainText(source: string, maxLength?: number): string {
  const text = parseMarkdown(source)
    .flatMap((block) =>
      block.type === "list"
        ? block.items.map((item) => item.map((node) => node.value).join(""))
        : [block.content.map((node) => node.value).join("")],
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!maxLength || text.length <= maxLength) return text;
  // Trim on a word boundary so descriptions don't end mid-word.
  return `${text.slice(0, text.lastIndexOf(" ", maxLength))}…`;
}
