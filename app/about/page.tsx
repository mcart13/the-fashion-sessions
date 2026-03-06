import Image from "next/image";
import NewsletterSection from "@/components/NewsletterSection";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { buildBreadcrumbSchema, buildMetadata } from "@/lib/metadata";
import { SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/siteConfig";

export const metadata = buildMetadata({
  title: "About",
  description: "Meet Tracy and learn the story behind The Fashion Sessions.",
  path: "/about",
});

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tracy Cartwright",
    url: `${SITE_URL}/about`,
    jobTitle: "Fashion & Lifestyle Blogger",
    description:
      "Fashion and lifestyle blogger helping women feel confident through personal style. Former CPA turned full-time content creator at The Fashion Sessions.",
    image: `${SITE_URL}/images/wp-uploads/2023/06/Facetune_21-05-2023-20-10-03-scaled.jpg`,
    sameAs: SOCIAL_LINKS.map((s) => s.href.split("?")[0]),
    worksFor: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
  };
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "About" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* ===== Hero Section ===== */}
      <section className="hidden md:flex md:flex-row">
        {/* Left cream panel - bottom-aligned content */}
        <AnimateOnScroll
          animation="fadeInLeft"
          className="flex w-1/2 items-end bg-cream pb-[30px] pl-[50px] pr-[70px]"
        >
          <div>
            <h1 className="font-moontime text-[clamp(4rem,3rem+2vw,5rem)] font-extralight leading-none text-[#282828]">
              About
            </h1>
            <p className="-mt-3 font-butler text-[clamp(2.6rem,1.7309rem+1.813vw,3rem)] font-thin leading-snug text-[#282828]">
              FASHION SHOULD EXPRESS WHO YOU ARE &amp; MAKE YOU FEEL LIKE THE
              BEST VERSION OF YOURSELF.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Right image */}
        <AnimateOnScroll animation="fadeInRight" className="relative w-1/2">
          <div className="relative h-[600px] w-full">
            <Image
              src="/images/wp-uploads/2023/06/Facetune_21-05-2023-20-10-03-scaled.jpg"
              alt="Tracy holding glasses"
              fill
              className="object-cover object-left-top"
              priority
            />
          </div>
        </AnimateOnScroll>
      </section>

      {/* Mobile hero - just the image */}
      <section className="px-[35px] md:hidden">
        <div className="relative -mt-[85px] aspect-[3/4] w-full">
          <Image
            src="/images/hero-about-mobile.jpg"
            alt="Tracy - About"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* ===== Bio Section ===== */}
      <section className="bg-white px-6 pt-[50px] pb-0">
        <AnimateOnScroll animation="fadeInUp">
          <div className="mx-auto max-w-[800px]">
            {/* Subheading label */}
            <p className="mb-[10px] text-center font-poppins uppercase tracking-[1.2px] text-[#282828]">
              Hi, loves! It&apos;s Tracy!
            </p>

            {/* Story title */}
            <h2 className="text-center font-butler text-[clamp(3rem,1.7309rem+1.813vw,4rem)] font-thin text-[#282828]">
              HOW MY STORY BEGAN
            </h2>

            {/* Divider below heading */}
            <hr className="mx-auto mt-2 mb-10 w-[8%] border-t border-[#282828]" />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll animation="fadeInUp">
          <div className="mx-auto max-w-[800px]">
            {/* Bio paragraphs */}
            <div className="space-y-6 text-justify font-poppins text-[14px] leading-relaxed text-[#282828]">
              <p>
                From the bottom of my heart, THANK YOU for clicking the
                &quot;About Me&quot; tab. The fact that you landed here means
                the world to me. You see, my whole passion for launching my
                fashion and lifestyle blog was to focus on OTHER women. But
                since you are on this page, you might be looking to know a
                little bit about me. Other than the fact that my favorite foods
                are steak and lobster, and I NEVER turn down queso, this is what
                I can think to tell you.
              </p>

              <p>
                First and foremost, I am all about my family. I am in my
                40&apos;s (almost 50!), and my greatest joy in life was being a
                stay-at-home mom to my two babies, Mason and Cameron. I still
                thank my Father in Heaven every day that I had the opportunity
                to be home with them. Truth is, they aren&apos;t so little
                anymore. Mason is now married to an angel on earth, and my sweet
                (&amp; quite salty) daughter is off at college figuring out
                life! I have been married for 30 years and counting to the best
                guy ever created, Steven. This guy makes my heart skip a beat on
                a regular basis. We both work from home, so it is a darn good
                thing we totally dig each other since we are together ALL THE
                TIME! Seriously, how could I be so lucky???
              </p>

              <p>
                Oh, I am a twin, too. Her name is Stacy. Wasn&apos;t that nice
                of our parents to give their twins rhyming names? Moving on....I
                grew up near Branson, Missouri, then attended BYU. After
                college, I landed in Omaha, Nebraska, and spent over 16 years as
                a CPA. I loved living in Nebraska, but I will tell you that it
                gets super duper hot and super duper cold here. So after our
                youngest graduated, we decided (kind of on a whim!) to move back
                home. We LOVE living on the lake in southern Missouri. I always
                worked while my babies slept, late at night, early in the
                morning, whatever it took to get the job done but also be a mom.
                I am now retired from the field of accounting (um, yay!) and
                pursue my passion for blogging full time.
              </p>

              <p>
                How did I go from taxes to blogging, you ask? I have always
                loved clothes and shopping, like a lot of women. I don&apos;t
                know that I have a knack for fashion and styling, but I
                suuuuuuure do love to shop! A while back, I took a job at a
                boutique to get out of the house a few hours a week and to get a
                good discount since I spent so much money there already, LOL! I
                loved it from the first minute I started because I was
                surrounded by fashion and supportive women at the same time. But
                I discovered something about women that really surprised me.
                While styling some amazing women, I heard over and over the
                brutal internal dialogue women have with themselves. &quot;My
                shoulders are huge&quot;, &quot;my butt is too big&quot;,
                &quot;I could never pull that off&quot;, &quot;I hate my
                arms&quot;, &quot;I have the longest torso&quot;, &quot;I wish I
                had pretty legs&quot;......and it goes on and on and on. It was
                so eye opening to hear the way women view themselves. Truth is,
                the things they were pointing out were not at all what I saw in
                them. And I would tell them that. That is where I came up with
                &quot;The Fashion Sessions&quot;. Suddenly, I knew it was time
                to pursue something I had always wanted to do. I became
                passionate about helping women see themselves in a different
                light, using fashion to show women how to be confident and to
                recognize how beautiful they really are!
              </p>

              <p>
                Fashion doesn&apos;t know your age. It knows your soul. I am
                more fashionable in my 40&apos;s than I ever was in my younger
                years. What you wear is just a fun way to express who you are
                and what you love. I love to show you different ways to style
                some of my favorite staple pieces. Plus, I believe women need to
                find their own style vibe that fits their lifestyle and body
                type. If you hang around me long enough, you will learn that I
                love jean jackets, blazers, a good pair of denim, and I LOVE to
                cook. Livin&apos; the dream, if you ask me! Last but not least,
                and maybe the most important thing you need to know about
                me....I was a professional roller skater as a kid.
              </p>

              <p>
                So welcome to my little space, The Fashion Sessions. Thank you
                so much for giving me just a little part of this world to do
                what I love. Now, let&apos;s get back to you. The Fashion
                Sessions is now &quot;IN SESSION!&quot;
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ===== Newsletter Section ===== */}
      <NewsletterSection />
    </>
  );
}
