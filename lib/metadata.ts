import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

interface BuildMetadataOptions {
  description?: string;
  image?: string | null;
  path?: string;
  title: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export function getAbsoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  image = "/images/logo.png",
  path = "/",
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
}: BuildMetadataOptions): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonical = getAbsoluteUrl(path);
  const imageUrl = image?.startsWith("http")
    ? image
    : getAbsoluteUrl(image ?? "/images/logo.png");

  const ogBase = {
    siteName: SITE_NAME,
    title: fullTitle,
    description,
    url: canonical,
    images: imageUrl ? [{ url: imageUrl }] : undefined,
  };

  const openGraph =
    type === "article"
      ? {
          ...ogBase,
          type: "article" as const,
          publishedTime,
          modifiedTime,
          authors: author ? [author] : undefined,
          section,
        }
      : {
          ...ogBase,
          type: "website" as const,
        };

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export function buildArticleSchema({
  author,
  dateModified,
  datePublished,
  description,
  image,
  section,
  title,
  url,
}: {
  author: string;
  dateModified: string;
  datePublished: string;
  description?: string;
  image?: string | null;
  section?: string;
  title: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    image: image ? [image] : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: section,
    author: {
      "@type": "Person",
      name: author,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
      },
    },
  };
}

export function buildBreadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function buildFAQSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildItemListSchema(
  name: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
