import { ArrowLeft, Check, ExternalLink, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard, productPriceLabel } from "@/components/cards/product-card";
import { ResourceCard } from "@/components/cards/resource-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/shared/button-link";
import { EntityImage } from "@/components/shared/entity-image";
import { JsonLd } from "@/components/shared/json-ld";
import { MedicalDisclaimer } from "@/components/shared/medical-disclaimer";
import { Pill } from "@/components/shared/pill";
import { Prose } from "@/components/shared/prose";
import { RelatedGrid } from "@/components/shared/related-grid";
import { titleCase } from "@/lib/format";
import { markdownToPlainText } from "@/lib/markdown";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
  getRelatedResourcesForProduct,
} from "@/lib/repositories/products";
import { breadcrumbJsonLd } from "@/lib/seo";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.excerpt || markdownToPlainText(product.body, 155),
    alternates: { canonical: `/store/${product.slug}` },
    openGraph: { title: product.name, description: product.excerpt },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [related, relatedResources] = await Promise.all([
    getRelatedProducts(product, 3),
    getRelatedResourcesForProduct(product, 3),
  ]);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: product.name },
  ];

  const price = productPriceLabel(product);
  const isAffiliate = product.source === "affiliate";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <Container className="pt-8 pb-4">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <Container className="pb-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <EntityImage
                image={product.coverImage}
                sizes="(max-width: 1024px) 100vw, 700px"
                priority
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Pill>{titleCase(product.format)}</Pill>
              <Pill tone="muted">
                {titleCase(
                  product.category.replace(/-and-/g, " & ").replace(/-/g, " "),
                )}
              </Pill>
            </div>

            <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {isAffiliate ? `By ${product.vendor}` : "By Henry & Precious"}
            </p>

            <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            <p className="mt-4 max-w-[68ch] text-lg leading-relaxed text-muted-foreground">
              {product.excerpt}
            </p>

            <Prose content={product.body} className="mt-8" />

            <MedicalDisclaimer variant="card" className="mt-10 max-w-[68ch]">
              This isn&apos;t a treatment and it won&apos;t change your chances
              of conceiving. Please talk to your healthcare team before starting
              anything new.
            </MedicalDisclaimer>

            <Link
              href="/store"
              className="mt-10 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to the Store
            </Link>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-card p-5">
              {price ? (
                <p
                  className={`font-heading text-2xl font-bold ${
                    product.isFree ? "text-success" : "text-primary"
                  }`}
                >
                  {price}
                </p>
              ) : (
                <p className="font-heading text-base font-semibold text-foreground">
                  Price shown at {product.vendor}
                </p>
              )}

              {product.includes?.length ? (
                <ul className="mt-4 flex flex-col gap-2">
                  {product.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 size-3.5 shrink-0 text-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* `sponsored` on affiliate links, `external` otherwise — the
                  rel value should describe the actual relationship. */}
              <a
                href={product.externalUrl}
                target="_blank"
                rel={
                  isAffiliate
                    ? "noreferrer noopener sponsored"
                    : "noreferrer noopener"
                }
                className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-4xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {product.isFree ? "Download Free" : "Get It"}
                <ExternalLink aria-hidden="true" className="size-3.5" />
                <span className="sr-only">
                  at {product.vendor}, opens in a new tab
                </span>
              </a>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Sold and delivered by {product.vendor}.
              </p>
            </div>

            {isAffiliate ? (
              <div className="mt-4 flex gap-2.5 rounded-2xl bg-surface p-4">
                <Info
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This is an affiliate link. We may earn a small amount if you
                  buy through it, at no extra cost to you. We only list things
                  our community actually recommends.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>

      {/* Free reading on the same subject, offered on every product page —
          nobody should have to buy something to get help from this site. */}
      <div className="bg-surface">
        <RelatedGrid
          headingId="product-related-resources"
          title="Free to Read on This Topic"
          description="You don't have to buy anything to get help here."
          count={relatedResources.length}
          action={{ label: "Browse All Resources", href: "/resources" }}
        >
          {relatedResources.map((item) => (
            <li key={item.id} className="flex">
              <ResourceCard resource={item} className="w-full" />
            </li>
          ))}
        </RelatedGrid>
      </div>

      <RelatedGrid
        headingId="related-products"
        title="You Might Also Like"
        count={related.length}
        action={{ label: "View All Products", href: "/store" }}
      >
        {related.map((item) => (
          <li key={item.id} className="flex">
            <ProductCard product={item} className="w-full" />
          </li>
        ))}
      </RelatedGrid>
    </>
  );
}
