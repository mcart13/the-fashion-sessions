import Image from "next/image";
import NewsletterSection from "@/components/NewsletterSection";

export default function AboutPage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="flex flex-col md:flex-row">
        {/* Left cream panel */}
        <div className="flex w-full items-center justify-center bg-cream px-8 py-16 md:w-1/2 md:px-14 md:py-24">
          <div className="max-w-md text-center md:text-left">
            <h1 className="font-moontime text-[80px] leading-none text-heading-dark">
              About
            </h1>
            <p className="mt-4 font-butler text-[32px] md:text-[48px] font-extralight leading-snug text-[#282828]">
              FASHION SHOULD EXPRESS WHO YOU ARE &amp; MAKE YOU FEEL LIKE THE
              BEST VERSION OF YOURSELF.
            </p>
          </div>
        </div>

        {/* Right image */}
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[3/4] w-full md:aspect-auto md:h-full">
            <Image
              src="/images/hero-about.jpg"
              alt="Tracy - About"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* ===== Bio Section ===== */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-[800px]">
          {/* Subheading label */}
          <p className="text-center font-poppins text-[15px] tracking-[1.2px] text-[#282828]">
            Hi, loves! It&apos;s Tracy!
          </p>
          <hr className="mx-auto mt-4 mb-10 w-24 border-t-2 border-accent-gold" />

          {/* Story title */}
          <h2 className="mb-8 text-center font-butler text-[40px] md:text-[64px] font-extralight leading-tight text-[#282828]">
            HOW MY STORY BEGAN
          </h2>

          {/* Bio paragraphs */}
          <div className="space-y-6 font-roboto text-[15px] leading-relaxed text-text-dark">
            <p>
              From the bottom of my heart, THANK YOU for clicking the
              &quot;About Me&quot; tab. The fact that you landed here means the
              world to me. You see, my whole passion for launching my fashion
              and lifestyle blog was to focus on OTHER women. But since you are
              on this page, you might be looking to know a little bit about me.
              Other than the fact that my favorite foods are steak and lobster,
              and I NEVER turn down queso, this is what I can think to tell you.
            </p>

            <p>
              First and foremost, I am all about my family. I am in my 40&apos;s
              (almost 50!), and my greatest joy in life was being a stay-at-home
              mom to my two babies, Mason and Cameron. I still thank my Father
              in Heaven every day that I had the opportunity to be home with
              them. Truth is, they aren&apos;t so little anymore. Mason is now
              married to an angel on earth, and my sweet (&amp; quite salty)
              daughter is off at college figuring out life! I have been married
              for 30 years and counting to the best guy ever created, Steven.
              This guy makes my heart skip a beat on a regular basis. We both
              work from home, so it is a darn good thing we totally dig each
              other since we are together ALL THE TIME! Seriously, how could I
              be so lucky???
            </p>

            <p>
              Oh, I am a twin, too. Her name is Stacy. Wasn&apos;t that nice of
              our parents to give their twins rhyming names? Moving on....I grew
              up near Branson, Missouri, then attended BYU. After college, I
              landed in Omaha, Nebraska, and spent over 16 years as a CPA. I
              loved living in Nebraska, but I will tell you that it gets super
              duper hot and super duper cold here. So after our youngest
              graduated, we decided (kind of on a whim!) to move back home. We
              LOVE living on the lake in southern Missouri. I always worked
              while my babies slept, late at night, early in the morning,
              whatever it took to get the job done but also be a mom. I am now
              retired from the field of accounting (um, yay!) and pursue my
              passion for blogging full time.
            </p>

            <p>
              How did I go from taxes to blogging, you ask? I have always loved
              clothes and shopping, like a lot of women. I don&apos;t know that
              I have a knack for fashion and styling, but I suuuuuuure do love
              to shop! A while back, I took a job at a boutique to get out of
              the house a few hours a week and to get a good discount since I
              spent so much money there already, LOL! I loved it from the first
              minute I started because I was surrounded by fashion and
              supportive women at the same time. But I discovered something
              about women that really surprised me. While styling some amazing
              women, I heard over and over the brutal internal dialogue women
              have with themselves. &quot;My shoulders are huge&quot;, &quot;my
              butt is too big&quot;, &quot;I could never pull that off&quot;,
              &quot;I hate my arms&quot;, &quot;I have the longest torso&quot;,
              &quot;I wish I had pretty legs&quot;......and it goes on and on
              and on. It was so eye opening to hear the way women view
              themselves. Truth is, the things they were pointing out were not
              at all what I saw in them. And I would tell them that. That is
              where I came up with &quot;The Fashion Sessions&quot;. Suddenly, I
              knew it was time to pursue something I had always wanted to do. I
              became passionate about helping women see themselves in a
              different light, using fashion to show women how to be confident
              and to recognize how beautiful they really are!
            </p>

            <p>
              Fashion doesn&apos;t know your age. It knows your soul. I am more
              fashionable in my 40&apos;s than I ever was in my younger years.
              What you wear is just a fun way to express who you are and what
              you love. I love to show you different ways to style some of my
              favorite staple pieces. Plus, I believe women need to find their
              own style vibe that fits their lifestyle and body type. If you
              hang around me long enough, you will learn that I love jean
              jackets, blazers, a good pair of denim, and I LOVE to cook.
              Livin&apos; the dream, if you ask me! Last but not least, and
              maybe the most important thing you need to know about me....I was
              a professional roller skater as a kid.
            </p>

            <p>
              So welcome to my little space, The Fashion Sessions. Thank you so
              much for giving me just a little part of this world to do what I
              love. Now, let&apos;s get back to you. The Fashion Sessions is now
              &quot;IN SESSION!&quot;
            </p>
          </div>
        </div>
      </section>

      {/* ===== Newsletter Section ===== */}
      <NewsletterSection />
    </>
  );
}
