/**
 * Renders one or more JSON-LD documents into a page.
 *
 * Structured data has no non-HTML API, so this is the one place
 * `dangerouslySetInnerHTML` is warranted. Input is always our own typed
 * content from lib/seo — never user text — and `<` is escaped to close off
 * the only injection route that matters inside a script tag.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const documents = Array.isArray(data) ? data : [data];

  return (
    <>
      {documents.map((document, index) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: static, order-stable list
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(document).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
