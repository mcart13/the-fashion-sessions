import Image from "next/image";
import Link from "next/link";
import HomeHero from "@/components/HomeHero";
import PostTeaser from "@/components/PostTeaser";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import NewsletterSection from "@/components/NewsletterSection";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ShopThePostWidget } from "@/components/ThirdPartyEmbeds";
import { SITE_DESCRIPTION } from "@/lib/siteConfig";
import {
  getHomePageCount,
  getHomePosts,
  getHomeShopWidgetIds,
} from "@/lib/siteContent";

const homeShopWidgetIds = getHomeShopWidgetIds();

export const metadata = {
  title: "Home",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
};

interface HomePageProps {
  searchParams?: {
    page?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const currentPage = Math.max(1, Number(searchParams?.page ?? "1") || 1);
  const pageCount = getHomePageCount();
  const homePosts = getHomePosts(currentPage);

  return (
    <>
      <HomeHero />

      <section className="bg-white px-6 py-20">
        <AnimateOnScroll animation="fadeInUp">
          <div className="mx-auto max-w-[1140px] text-center">
            <h2 className="font-butler text-[clamp(3rem,1.7309rem+1.813vw,4rem)] font-extralight leading-[1.1] text-[#282828] md:px-[70px]">
              FASHION RULES DON&apos;T EXIST IN MY WORLD.
            </h2>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fadeInUp">
          <div className="mx-auto max-w-[1140px] text-center">
            <p className="mx-auto mt-6 max-w-[665px] font-poppins text-[1rem] leading-[1.7] text-[#282828]">
              When I see fashion do&apos;s and don&apos;ts, I throw them out the
              window. While I believe we can all find fashions that flatter
              parts of our bodies that we love, I truly believe that fashion is
              what makes YOU feel like the best version of yourself. If it makes
              you feel good, then it&apos;s GOOD FASHION!
            </p>
          </div>
        </AnimateOnScroll>
      </section>

      <section className="bg-tan px-6 py-14">
        <AnimateOnScroll animation="fadeInDown">
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
              Catch some of my favorite products I&apos;m loving right now
            </p>
            <h2 className="mt-2 font-butler text-[clamp(2.2rem,1.5482rem+1.3598vw,2.5rem)] font-extralight italic leading-none text-[#282828]">
              shop my favorites
            </h2>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fadeInUp">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="font-moontime text-[clamp(3rem,1.7309rem+1.813vw,4rem)] font-light leading-none text-[#936740]">
                  beauty &amp; hair!
                </h3>
                <div className="mx-auto mt-4 max-w-4xl bg-white/50 p-4">
                  {homeShopWidgetIds[0] ? (
                    <ShopThePostWidget widgetId={homeShopWidgetIds[0]} />
                  ) : null}
                </div>
              </div>

              <div>
                <h3 className="font-moontime text-[clamp(3rem,1.7309rem+1.813vw,4rem)] font-light leading-none text-[#936740]">
                  must-haves!
                </h3>
                <div className="mx-auto mt-4 max-w-4xl bg-white/50 p-4">
                  {homeShopWidgetIds[1] ? (
                    <ShopThePostWidget widgetId={homeShopWidgetIds[1]} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-0 lg:grid-cols-[73%_27%]">
          <AnimateOnScroll animation="fadeInLeft" className="space-y-10">
            {homePosts.map((post) => (
              <PostTeaser
                key={post.id}
                post={post}
                imageContainerClassName="sm:w-[218px]"
                imageWidth={218}
                imageHeight={272}
              />
            ))}

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              basePath="/"
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

      <section className="bg-white">
        <div className="mx-auto flex max-w-[1100px] flex-col md:flex-row">
          <AnimateOnScroll
            animation="fadeInLeft"
            className="relative w-full md:w-[37.73%]"
          >
            <div className="relative aspect-[4/5] w-full md:aspect-auto md:min-h-[514px]">
              <Image
                src="/images/meet-founder.jpg"
                alt="Tracy on floor with laptop"
                fill
                className="object-cover"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll
            animation="fadeInRight"
            className="flex w-full items-center md:w-[62.27%]"
          >
            <div className="px-8 py-12 md:px-14 md:py-16">
              <p className="font-poppins text-[16px] tracking-[2.3px] text-[#282828]">
                MEET THE FOUNDER
              </p>
              <h2 className="mt-3 font-butler text-[42px] font-extralight leading-tight text-[#282828]">
                Hey, I&apos;m Tracy!
              </h2>
              <p className="mt-4 font-poppins text-[1rem] leading-[1.9rem] text-[#282828]">
                I get asked a lot how I came to be in the world of fashion.
                Click below, and I&apos;ll tell you a little more about me!
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] tracking-[0.9px] text-[#282828] transition-colors hover:bg-tan"
              >
                READ MY STORY
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
