import Image from "next/image";
import PostTeaser from "@/components/PostTeaser";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getPostsForCategory } from "@/lib/siteContent";

const POSTS_PER_PAGE = 4;

interface HeroHeading {
  /** Small text above main heading (e.g. "Tracy's") */
  topSmall?: string;
  /** Large heading text (e.g. "Beauty Blog") */
  topLarge?: string;
  /** Single script-font heading (used by fashion instead of topSmall+topLarge) */
  topScript?: string;
}

interface HeroOverlay {
  heading: string;
  subtitle?: string;
}

interface CategoryArchivePageProps {
  basePath?: string;
  currentPage?: number;
  slug: string;
  title: string;
  heroImage?: string;
  heroHeading?: HeroHeading;
  heroOverlay?: HeroOverlay;
}

export default function CategoryArchivePage({
  basePath,
  currentPage = 1,
  slug,
  title,
  heroImage,
  heroHeading,
  heroOverlay,
}: CategoryArchivePageProps) {
  const posts = getPostsForCategory(slug);
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(currentPage, 1), pageCount);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const archivePath = basePath ?? `/${slug}`;

  const hasHero = heroImage && heroHeading && heroOverlay;

  return (
    <>
      {/* Hero Section */}
      {hasHero && (
        <section className="bg-[#F5F3ED]">
          <div className="mx-auto max-w-[1120px] px-5 py-14">
            {/* Top decorative heading */}
            <AnimateOnScroll animation="fadeInUp">
              <div className="mb-8 text-center">
                {heroHeading.topScript ? (
                  <h1 className="font-moontime text-[clamp(3rem,1.7309rem+1.813vw,4rem)] font-light leading-none text-[#936740]">
                    {heroHeading.topScript}
                  </h1>
                ) : (
                  <div>
                    {heroHeading.topSmall && (
                      <p className="font-poppins text-[14px] uppercase tracking-[2px] text-[#282828]">
                        {heroHeading.topSmall}
                      </p>
                    )}
                    {heroHeading.topLarge && (
                      <h1 className="mt-1 font-butler text-[clamp(2.2rem,1.5482rem+1.3598vw,3rem)] font-extralight leading-tight text-[#282828]">
                        {heroHeading.topLarge}
                      </h1>
                    )}
                  </div>
                )}
              </div>
            </AnimateOnScroll>

            {/* Two-column hero: image + overlay */}
            <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
              <AnimateOnScroll animation="fadeInLeft">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={heroImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 560px"
                    priority
                  />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll
                animation="fadeInRight"
                className="flex items-center justify-center"
              >
                <div className="max-w-[550px] bg-[#FFFFFFDE] px-10 py-12 text-center md:px-14 md:py-16">
                  <h2 className="font-butler text-[clamp(1.6rem,1.1rem+1.1vw,2rem)] font-extralight leading-snug text-[#282828]">
                    {heroOverlay.heading}
                  </h2>
                  {heroOverlay.subtitle && (
                    <p className="mt-4 font-poppins text-[15px] leading-relaxed text-[#282828]">
                      {heroOverlay.subtitle}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>
      )}

      {/* Post Listing + Sidebar */}
      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-0 lg:grid-cols-[73%_27%]">
          <AnimateOnScroll animation="fadeInLeft" className="space-y-10">
            {visiblePosts.map((post) => (
              <PostTeaser
                key={post.id}
                post={post}
                imageContainerClassName="sm:w-[222px]"
                imageWidth={222}
                imageHeight={277}
                showCategories
              />
            ))}

            <Pagination
              currentPage={safePage}
              pageCount={pageCount}
              basePath={archivePath}
            />
          </AnimateOnScroll>

          <AnimateOnScroll
            animation="fadeInRight"
            className="mt-8 rounded-[2px] bg-white p-4 shadow-[0_0_10px_rgba(0,0,0,0.1)] sm:p-[10px_15px_30px_15px] lg:mt-5"
          >
            <Sidebar />
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
