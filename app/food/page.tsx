import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const posts = [
  {
    title: "Time for a Fall Bra Refresh with Soma",
    date: "October 14, 2023",
    image: "/images/blog/fall-bra-refresh.png",
    excerpt: "Refresh your top drawer for fall with Soma!",
  },
  {
    title: "Five ADORABLE Summer Bags under $40",
    date: "April 25, 2021",
    image: "/images/blog/summer-bags.png",
    excerpt:
      "Can you ever really have too many bags? I am such a sucker for a cute bag...",
  },
  {
    title:
      "Meet your new favorite sandal for summer, the Livi Espadrille Wedge!",
    date: "April 13, 2021",
    image: "/images/blog/espadrille-wedge.png",
    excerpt:
      "As the warmer days of summer get closer and closer, my sandal collection...",
  },
  {
    title: "These straw hats are under $25 & will have you vacation ready!",
    date: "April 7, 2021",
    image: "/images/blog/straw-hats.jpg",
    excerpt:
      "Straw hat season has arrived! And I'm excited to share with you my favorites...",
  },
];

const paginationItems = ["1", "2", "3", "...", "7", "Next"];

export default function FoodPage() {
  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex min-h-[250px] items-center justify-center bg-tan">
          <h1 className="font-butler text-4xl uppercase tracking-wide text-heading-dark md:text-5xl">
            Food
          </h1>
        </div>
        <div className="flex items-center justify-center bg-white p-10">
          <p className="max-w-sm text-center font-poppins text-sm leading-relaxed text-text-dark">
            See what&apos;s trending and what I&apos;m loving on the blog!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12">
        <h2 className="mb-10 text-center font-butler text-3xl text-heading-dark">
          What&apos;s New on the Blog
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Posts */}
          <div className="space-y-10 lg:col-span-2">
            {posts.map((post) => (
              <article
                key={post.title}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-roboto-slab text-lg font-medium leading-snug text-heading-dark">
                    {post.title}
                  </h3>
                  <p className="mt-1 font-poppins text-xs text-gray-400">
                    {post.date}
                  </p>
                  <p className="mt-3 font-poppins text-sm leading-relaxed text-text-dark">
                    {post.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="mt-3 inline-block font-poppins text-sm font-medium text-accent-gold hover:underline"
                  >
                    read the post
                  </Link>
                </div>
              </article>
            ))}

            {/* Pagination */}
            <nav className="flex items-center justify-center gap-2 pt-6">
              {paginationItems.map((item, i) => (
                <span
                  key={i}
                  className={`inline-flex h-9 min-w-[36px] items-center justify-center px-2 font-poppins text-sm ${
                    item === "1"
                      ? "bg-accent-gold text-white"
                      : "text-text-dark hover:text-accent-gold"
                  } ${item === "..." ? "cursor-default" : "cursor-pointer"}`}
                >
                  {item}
                </span>
              ))}
            </nav>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
