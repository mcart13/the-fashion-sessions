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
  image,
  section,
  title,
  url,
}: {
  author: string;
  dateModified: string;
  datePublished: string;
  image?: string | null;
  section?: string;
  title: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished,
    dateModified,
    image: image ? [image] : undefined,
    mainEntityOfPage: url,
    articleSection: section,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
