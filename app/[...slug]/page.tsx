import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HtmlContent from "@/components/HtmlContent";
import NewsletterSection from "@/components/NewsletterSection";
import Sidebar from "@/components/Sidebar";
import SocialIcon from "@/components/SocialIcon";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildMetadata,
  getAbsoluteUrl,
} from "@/lib/metadata";
import { SITE_URL } from "@/lib/siteConfig";
import {
  getAllPosts,
  getCategoryHref,
  formatDisplayDate,
  getPostByPathSegments,
  getPostExcerpt,
  getPostPath,
  getPostPathSegments,
  getPrimaryCategory,
} from "@/lib/siteContent";

interface CatchAllPageProps {
  params: {
    slug: string[];
  };
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: getPostPathSegments(post),
  }));
}

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const post = getPostByPathSegments(params.slug);

  if (!post) {
    return {};
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    path: getPostPath(post),
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.modified,
    author: post.author,
    section: post.categories[0]?.name,
  });
}

export default function CatchAllPage({ params }: CatchAllPageProps) {
  const post = getPostByPathSegments(params.slug);

  if (!post) {
    notFound();
  }

  const primaryCategory = getPrimaryCategory(post);
  const articleUrl = getAbsoluteUrl(getPostPath(post));
  const shareLinks = [
    {
      icon: "Facebook" as const,
      label: "facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    },
    {
      icon: "Twitter" as const,
      label: "twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title)}`,
    },
    {
      icon: "LinkedIn" as const,
      label: "linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
    },
    {
      icon: "Pinterest" as const,
      label: "pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(articleUrl)}&description=${encodeURIComponent(post.title)}`,
    },
  ];
  const articleSchema = buildArticleSchema({
    author: post.author,
    dateModified: post.modified,
    datePublished: post.date,
    description: getPostExcerpt(post),
    image: post.featuredImage,
    section: primaryCategory?.name,
    title: post.title,
    url: articleUrl,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    ...(primaryCategory
      ? [
          {
            name: primaryCategory.name,
            url: getAbsoluteUrl(getCategoryHref(primaryCategory.slug)),
          },
        ]
      : []),
    { name: post.title },
  ]);
  const contentId = `post-content-${post.id}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Centered header section */}
      <div className="mt-[30px] bg-white px-6">
        <div className="mx-auto max-w-[1240px] text-center">
          {primaryCategory ? (
            <p className="font-poppins text-[11px] uppercase tracking-[1.2px] text-[#282828]">
              <Link
                href={getCategoryHref(primaryCategory.slug)}
                className="transition-colors hover:text-[#BA9D95]"
              >
                {primaryCategory.name}
              </Link>
            </p>
          ) : null}
          <h1 className="mt-2 font-butler text-[clamp(1.6rem,1rem+2vw,2.5rem)] font-extralight text-[#282828]">
            {post.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-poppins text-[11px] uppercase text-[#282828]">
            <div className="flex items-center gap-[11px]">
              <svg
                className="h-3 w-3 text-[#BA9D95]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              <span>{formatDisplayDate(post.date)}</span>
            </div>
            {primaryCategory ? (
              <div className="flex items-center gap-[11px]">
                <svg
                  className="h-3 w-3 text-[#BA9D95]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  />
                </svg>
                <Link
                  href={getCategoryHref(primaryCategory.slug)}
                  className="transition-colors hover:text-[#BA9D95]"
                >
                  {primaryCategory.name}
                </Link>
              </div>
            ) : null}
          </div>
          <div className="mt-[10px] flex items-center justify-center gap-[14px]">
            {shareLinks.map((share) => (
              <Link
                key={share.label}
                href={share.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${share.label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#BA9D95] text-white transition-colors hover:bg-[#E6DDD9] hover:text-[#525050]"
              >
                <SocialIcon name={share.icon} className="h-[18px] w-[18px]" />
              </Link>
            ))}
          </div>
          <div className="mx-auto mt-3 max-w-[1240px]">
            <hr className="border-[#B98F67]" />
          </div>
        </div>
      </div>

      {/* Two-column content area */}
      <div className="bg-white px-6 py-4">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-12 lg:grid-cols-[67%_32.33%]">
          <article>
            <HtmlContent
              id={contentId}
              className="wordpress-content pt-6"
              html={post.contentHtml}
            />

            <div className="mt-12 border-t border-[#B98F67] pt-6">
              <Link
                href={
                  primaryCategory ? getCategoryHref(primaryCategory.slug) : "/"
                }
                className="font-poppins text-sm uppercase tracking-[1.2px] text-[#BA9D95] transition-colors hover:text-[#282828]"
              >
                Back to {primaryCategory ? primaryCategory.name : "Home"}
              </Link>
            </div>
          </article>

          <aside className="mt-8 rounded-[2px] bg-white p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:p-5 lg:mt-0 lg:p-[10px_0_35px_40px]">
            <Sidebar />
          </aside>
        </div>
      </div>

      <NewsletterSection />
    </>
  );
}
