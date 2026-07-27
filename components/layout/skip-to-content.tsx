/**
 * Visually hidden until focused. First tab stop on every page — lets keyboard
 * and screen reader users jump past the nav straight to the content.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>
  );
}
