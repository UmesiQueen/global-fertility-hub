import type { Element, ElementContent, Root as HastRoot, Text } from "hast";
import type { Nodes as MdastNodes } from "mdast";
import { defaultSchema, type Options as SanitizeSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * Article and story bodies arrive from Hygraph as markdown and are rendered by
 * react-markdown (see components/shared/prose.tsx). This module holds the
 * pieces that are ours rather than the library's:
 *
 * - the sanitize schema — which raw HTML from the editor is allowed through
 * - the embed allow-lists — which iframes and videos may play
 * - the citations plugin — `[3]` links to the reference that starts with `[3]`
 * - plain-text extraction for meta descriptions
 *
 * Nothing is rendered with `dangerouslySetInnerHTML`: react-markdown builds
 * React elements, and raw HTML only survives if the schema below allows it.
 * Story bodies will eventually be community-submitted, so that matters.
 */

/* -------------------------------------------------------------------------- */
/* Raw HTML                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * GitHub's sanitize rules, plus the few tags Hygraph's editor writes as HTML
 * because markdown has no syntax for them: underline, and video / iframe
 * embeds. Scripts, styles, event handlers and `javascript:` URLs stay out.
 */
export const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "u",
    "iframe",
    "video",
    "source",
  ],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ["src", "title", "allow", "allowFullScreen"],
    video: ["src", "poster", "controls"],
    source: ["src", "type"],
  },
};

/** Players an editor may embed. Anything else is dropped, not shown as code. */
const EMBED_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.loom.com",
]);

function hostOf(src: unknown): string | null {
  if (typeof src !== "string") return null;
  try {
    const url = new URL(src);
    return url.protocol === "https:" ? url.hostname : null;
  } catch {
    return null;
  }
}

export function isAllowedEmbed(src: unknown): boolean {
  const host = hostOf(src);
  return host !== null && EMBED_HOSTS.has(host);
}

/** Hygraph's asset CDN — the only source for inline video files. */
export function isHygraphAsset(src: unknown): boolean {
  const host = hostOf(src);
  return host?.endsWith(".graphassets.com") ?? false;
}

/* -------------------------------------------------------------------------- */
/* Citations                                                                   */
/* -------------------------------------------------------------------------- */

/** `[3]` or `[1, 3]` in running text. */
const CITATION = /\[(\d{1,3}(?:\s*,\s*\d{1,3})*)\]/g;

/** A reference entry: a paragraph or list item that starts `[3] …`. */
const ENTRY = /^\s*\[(\d{1,3})\]\s*/;

/** Below the sticky header (h-18) with breathing room, for every jump target. */
const JUMP_OFFSET = "scroll-mt-24";

const element = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[],
): Element => ({ type: "element", tagName, properties, children });

const text = (value: string): Text => ({ type: "text", value });

/** hast wants class lists as arrays. */
const cls = (classes: string) => classes.split(" ");

function firstText(node: Element): Text | null {
  for (const child of node.children) {
    if (child.type === "text") return child.value.trim() ? child : null;
    if (child.type === "element") return firstText(child);
  }
  return null;
}

/**
 * One paragraph holding several references on separate lines (Shift+Enter
 * between them) becomes one paragraph per reference, so each gets its own
 * jump target.
 */
function splitEntryLines(tree: HastRoot) {
  visit(tree, "element", (node, index, parent) => {
    if (node.tagName !== "p" || !parent || index === undefined) return;
    if (!node.children.some((c) => c.type === "element" && c.tagName === "br"))
      return;

    const lines: ElementContent[][] = [[]];
    for (const child of node.children) {
      if (child.type === "element" && child.tagName === "br") lines.push([]);
      else lines[lines.length - 1].push(child);
    }

    const paragraphs = lines.map((children) => element("p", {}, children));
    if (!paragraphs.every((p) => ENTRY.test(firstText(p)?.value ?? ""))) return;

    parent.children.splice(index, 1, ...paragraphs);
    return [SKIP, index + paragraphs.length];
  });
}

/**
 * Turns `[n]` citations into superscript links to the entry that starts with
 * `[n]`, and gives each entry a ↩ link back to where it was first cited.
 *
 * - A citation whose number has no entry stays as plain `[7]` text, so a
 *   typo never becomes a link to nowhere.
 * - Only the first citation and first entry of each number get an id, so
 *   ids stay unique and ↩ has one place to return to.
 * - Runs after sanitizing, so these ids aren't rewritten to `user-content-…`.
 */
export function rehypeCitations() {
  return (tree: HastRoot) => {
    splitEntryLines(tree);

    // 1. Find the entries. A loose list item wraps its text in a <p>; SKIP
    //    stops that <p> being counted again.
    const entries = new Map<string, Element>();
    const labelled: [string, Element][] = [];
    visit(tree, "element", (node) => {
      if (node.tagName !== "p" && node.tagName !== "li") return;
      const lead = firstText(node);
      const match = lead?.value.match(ENTRY);
      if (!lead || !match) return;

      // The "[3]" is taken out of the text now and put back as a label in
      // step 3, so step 2 doesn't mistake it for a citation.
      const number = match[1];
      lead.value = lead.value.slice(match[0].length);
      labelled.push([number, node]);
      if (!entries.has(number)) entries.set(number, node);
      return SKIP;
    });

    if (!entries.size) return;

    // 2. Link the citations in running text.
    const cited = new Set<string>();
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined || parent.type !== "element") return;
      if (["a", "code", "pre"].includes(parent.tagName)) return;

      const pieces: ElementContent[] = [];
      let last = 0;
      for (const match of node.value.matchAll(CITATION)) {
        const numbers = match[1].split(",").map((n) => n.trim());
        if (!numbers.some((n) => entries.has(n))) continue;

        if (match.index > last) pieces.push(text(node.value.slice(last, match.index)));
        const links: ElementContent[] = [];
        numbers.forEach((n, i) => {
          if (i > 0) links.push(text(","));
          if (!entries.has(n)) {
            links.push(text(n));
            return;
          }
          const first = !cited.has(n);
          cited.add(n);
          links.push(
            element(
              "a",
              {
                href: `#ref-${n}`,
                id: first ? `cite-${n}` : undefined,
                ariaLabel: `Reference ${n}`,
                className: cls(`${JUMP_OFFSET} rounded-sm text-primary no-underline hover:underline`),
              },
              [text(n)],
            ),
          );
        });
        pieces.push(element("sup", { className: cls("ml-0.5 text-[0.7em] font-semibold") }, links));
        last = match.index + match[0].length;
      }

      if (!pieces.length) return;
      if (last < node.value.length) pieces.push(text(node.value.slice(last)));
      parent.children.splice(index, 1, ...pieces);
      return [SKIP, index + pieces.length];
    });

    // 3. Label every entry, then make the first of each number a jump
    //    target with a way back.
    for (const [number, node] of labelled) {
      node.children.unshift(
        element("span", { className: cls("font-medium text-foreground tabular-nums") }, [
          text(`[${number}]`),
        ]),
        text(" "),
      );
    }

    for (const [number, node] of entries) {
      node.properties = {
        ...node.properties,
        id: `ref-${number}`,
        // Briefly picked out when a citation jumps here.
        className: cls(`${JUMP_OFFSET} -mx-2 rounded-lg px-2 py-1 text-sm transition-colors duration-700 target:bg-accent`),
      };
      if (!cited.has(number)) continue;

      const lastChild = node.children.at(-1);
      const host =
        lastChild?.type === "element" && lastChild.tagName === "p" ? lastChild : node;
      host.children.push(
        text(" "),
        element(
          "a",
          {
            href: `#cite-${number}`,
            ariaLabel: `Back to where reference ${number} is cited`,
            className: cls("text-primary no-underline hover:underline"),
          },
          [text("↩")],
        ),
      );
    }
  };
}

/* -------------------------------------------------------------------------- */
/* Plain text                                                                  */
/* -------------------------------------------------------------------------- */

const BLOCKS = new Set(["paragraph", "heading", "listItem", "tableCell", "blockquote"]);

/**
 * Plain text, for meta descriptions and previews — formatting, raw HTML and
 * citations stripped, cut on a word boundary.
 */
export function markdownToPlainText(source: string, maxLength?: number): string {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source);

  const parts: string[] = [];
  visit(tree, (node: MdastNodes) => {
    if (BLOCKS.has(node.type)) parts.push(" ");
    else if (node.type === "text" || node.type === "inlineCode") parts.push(node.value);
    else if (node.type === "break") parts.push(" ");
  });

  const plain = parts
    .join("")
    .replace(CITATION, "")
    .replace(/\s+/g, " ")
    // A dropped citation leaves "potential ." — close the gap.
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();

  if (!maxLength || plain.length <= maxLength) return plain;
  return `${plain.slice(0, plain.lastIndexOf(" ", maxLength))}…`;
}
