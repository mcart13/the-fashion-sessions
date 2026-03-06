import Image from "next/image";
import Link from "next/link";
import type { SitePost } from "@/lib/siteContent";
import {
  formatDisplayDate,
  getPostExcerpt,
  getPostHref,
} from "@/lib/siteContent";

interface PostTeaserProps {
  imageContainerClassName: string;
  imageHeight: number;
  imageWidth: number;
  post: SitePost;
  showCategories?: boolean;
}

export default function PostTeaser({
  imageContainerClassName,
  imageHeight,
  imageWidth,
  post,
  showCategories = false,
}: PostTeaserProps) {
  return (
    <article className="flex flex-col gap-6 sm:flex-row">
      <Link
        href={getPostHref(post)}
        className={`relative w-full shrink-0 overflow-hidden bg-white ${imageContainerClassName}`}
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={imageWidth}
            height={imageHeight}
            className="h-auto w-full object-cover"
            sizes={`${imageWidth}px`}
          />
        ) : null}
      </Link>

      <div className="flex flex-col justify-center">
        <h3 className="font-butler text-[clamp(1.8rem,1.3654rem+0.9065vw,2rem)] font-extralight leading-snug text-[#282828]">
          <Link
            href={getPostHref(post)}
            className="transition-colors hover:text-accent-gold"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-[10px] font-poppins text-[11px] tracking-[0.8px] text-[#282828]">
          {formatDisplayDate(post.date)}
          {showCategories && post.categories.length > 0 ? (
            <span className="ml-3 text-[#BA9D95]">
              {post.categories.map((category) => category.name).join(", ")}
            </span>
          ) : null}
        </p>

        <p className="mt-3 font-poppins text-[15px] leading-relaxed text-[#282828]">
          {getPostExcerpt(post)}
        </p>

        <Link
          href={getPostHref(post)}
          className="mt-[15px] inline-flex w-fit items-center gap-3 bg-tan px-[30px] py-[10px] font-poppins text-[12px] font-light text-[#282828] transition-colors hover:bg-[#d4cbc7]"
        >
          Continue Reading
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
