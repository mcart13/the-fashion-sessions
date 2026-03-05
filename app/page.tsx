import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import NewsletterSection from "@/components/NewsletterSection";

const blogPosts = [
  {
    title: "Time for a Fall Bra Refresh with Soma",
    date: "October 14, 2023",
    image: "/images/blog/fall-bra-refresh.png",
    excerpt: "Refresh your top drawer for fall with Soma!",
    href: "#",
  },
  {
    title: "Homemade Sweet & Smoky BBQ Sauce",
    date: "June 27, 2021",
    image: "/images/blog/bbq-sauce.png",
    excerpt:
      "Cue the BBQ recipes this holiday week! For me, it\u2019s all about the sauce. THIS sauce! I love any and all BBQ sauces, so it\u2019s hard for me to pick a favorite.",
    href: "#",
  },
  {
    title: "Five ADORABLE Summer Bags under $40",
    date: "April 25, 2021",
    image: "/images/blog/summer-bags.png",
    excerpt:
      "Can you ever really have too many bags? I am such a sucker for a cute bag ...",
    href: "#",
  },
  {
    title:
      "Meet your new favorite sandal for summer, the Livi Espadrille Wedge!",
    date: "April 13, 2021",
    image: "/images/blog/espadrille-wedge.png",
    excerpt:
      "As the warmer days of summer get closer and closer, my sandal collection ...",
    href: "#",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="bg-cream py-[50px]">
        <div className="mx-auto max-w-[1140px] px-6 relative">
          {/* Image + overlapping white card */}
          <div className="flex flex-col md:block">
            <div className="relative mx-auto w-full md:w-[58%] md:mx-0">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="/images/hero-home-full.jpg"
                  alt="Tracy by clothing rack"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Overlapping white card */}
            <div className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 md:w-[48%] z-10">
              <div className="bg-white px-10 py-14 text-center">
                <h1 className="font-butler text-[40px] font-light leading-tight text-[#282828]">
                  WELCOME TO THE FASHION SESSIONS.
                </h1>
                <p className="mt-5 font-poppins text-[16px] leading-[1.7] text-[#282828]">
                  I believe fashion is whatever makes you feel and look like the
                  best version of yourself. If you love it, wear it!
                </p>
                <Link
                  href="/about"
                  className="mt-8 inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[14px] text-[#282828] transition-opacity hover:opacity-80"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Dark Tan Divider ===== */}
      <div className="h-2 w-full bg-tan" />

      {/* ===== Fashion Quote Section ===== */}
      <section className="bg-cream px-6 py-20">
        <div className="mx-auto max-w-[1140px] text-center">
          <h2 className="font-butler text-[40px] md:text-[64px] font-thin leading-tight text-[#282828]">
            FASHION RULES DON&apos;T EXIST IN MY WORLD.
          </h2>
          <p className="mt-6 font-poppins text-[16px] leading-[1.7] text-[#282828]">
            When I see fashion do&apos;s and don&apos;ts, I throw them out the
            window. While I believe we can all find fashions that flatter parts
            of our bodies that we love, I truly believe that fashion is what
            makes YOU feel like the best version of yourself. If it makes you
            feel good, then it&apos;s GOOD FASHION!
          </p>
        </div>
      </section>

      {/* ===== Shop My Favorites Section ===== */}
      <section className="bg-tan px-6 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-poppins text-xs uppercase tracking-widest text-text-dark">
            Catch some of my favorite products I&apos;m loving right now
          </p>
          <h2 className="mt-2 font-moontime text-[50px] leading-none text-[#282828]">
            shop my favorites
          </h2>

          {/* Beauty & Hair subsection */}
          <div className="mt-10">
            <h3 className="font-moontime text-[36px] leading-none text-heading-dark">
              beauty &amp; hair!
            </h3>
            <div className="mx-auto mt-4 flex h-48 max-w-4xl items-center justify-center rounded bg-white/60">
              <p className="font-poppins text-sm text-text-dark/60">
                Shop widget loading...
              </p>
            </div>
          </div>

          {/* Must-Haves subsection */}
          <div className="mt-10">
            <h3 className="font-moontime text-[36px] leading-none text-heading-dark">
              must-haves!
            </h3>
            <div className="mx-auto mt-4 flex h-48 max-w-4xl items-center justify-center rounded bg-white/60">
              <p className="font-poppins text-sm text-text-dark/60">
                Shop widget loading...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Blog Posts + Sidebar Section ===== */}
      <section className="bg-cream px-6 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Blog posts column (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            {blogPosts.map((post) => (
              <article
                key={post.title}
                className="flex flex-col gap-6 sm:flex-row"
              >
                {/* Post image */}
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:w-[260px]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Post text */}
                <div className="flex flex-col justify-center">
                  <h3 className="font-butler text-[32px] font-extralight leading-snug text-[#282828]">
                    {post.title}
                  </h3>
                  <p className="mt-1 font-poppins text-[11px] text-[#54595F]">
                    {post.date}
                  </p>
                  <p className="mt-3 font-poppins text-[15px] leading-relaxed text-[#334155]">
                    {post.excerpt}
                  </p>
                  <Link
                    href={post.href}
                    className="mt-3 inline-block font-poppins text-[12px] text-[#282828] hover:text-[#BA9D95] transition-colors"
                  >
                    Continue Reading
                  </Link>
                </div>
              </article>
            ))}

            {/* Pagination */}
            <nav
              className="flex items-center justify-center gap-2 pt-4"
              aria-label="Pagination"
            >
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`flex h-9 w-9 items-center justify-center font-poppins text-sm ${
                    n === 1
                      ? "bg-accent-gold text-white"
                      : "text-text-dark hover:text-accent-gold"
                  }`}
                >
                  {n}
                </span>
              ))}
              <span className="px-1 font-poppins text-sm text-text-dark">
                ...
              </span>
              <span className="flex h-9 w-9 items-center justify-center font-poppins text-sm text-text-dark hover:text-accent-gold">
                10
              </span>
              <span className="ml-1 font-poppins text-sm text-text-dark hover:text-accent-gold">
                Next
              </span>
            </nav>
          </div>

          {/* Sidebar column (1/3) */}
          <div>
            <Sidebar />
          </div>
        </div>
      </section>

      {/* ===== Meet the Founder Section ===== */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
          {/* Left image */}
          <div className="relative w-full md:w-1/2">
            <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full">
              <Image
                src="/images/meet-founder.jpg"
                alt="Tracy on floor with laptop"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right text */}
          <div className="flex w-full items-center md:w-1/2">
            <div className="px-8 py-12 md:px-14 md:py-16">
              <p className="font-poppins text-[16px] tracking-[2.3px] text-[#282828]">
                MEET THE FOUNDER
              </p>
              <h2 className="mt-3 font-butler text-[42px] font-thin leading-tight text-[#282828]">
                Hey, I&apos;m Tracy!
              </h2>
              <p className="mt-4 font-poppins text-[16px] leading-[1.7] text-[#282828]">
                I get asked a lot how I came to be in the world of fashion.
                Click below, and I&apos;ll tell you a little more about me!
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] tracking-[0.9px] text-black transition-opacity hover:opacity-80"
              >
                READ MY STORY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Newsletter Section ===== */}
      <NewsletterSection />
    </>
  );
}
