import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    title: "Time for a Fall Bra Refresh with Soma",
    date: "October 14, 2023",
    category: "Travel",
    image: "/images/blog/fall-bra-refresh.png",
    excerpt:
      "This post was sponsored by Soma, but all opinions are my own. With all of the fun fall fashion, it's always a good time to refresh your top drawer too!",
  },
  {
    title: "Five ADORABLE Summer Bags under $40",
    date: "April 25, 2021",
    category: "Travel",
    image: "/images/blog/summer-bags.png",
    excerpt:
      "Can you ever really have too many bags? I am such a sucker for a cute bag, especially in the summertime!",
  },
  {
    title:
      "Meet your new favorite sandal for summer, the Livi Espadrille Wedge!",
    date: "April 13, 2021",
    category: "Travel",
    image: "/images/blog/espadrille-wedge.png",
    excerpt:
      "As the warmer days of summer get closer and closer, my sandal collection keeps growing and growing!",
  },
  {
    title: "These straw hats are under $25 & will have you vacation ready!",
    date: "April 7, 2021",
    category: "Travel",
    image: "/images/blog/straw-hats.jpg",
    excerpt:
      "Straw hat season has arrived! And I'm excited to share with you my favorites that are all under $25!",
  },
];

export default function TravelPage() {
  return (
    <div className="bg-white">
      {/* Archive Header */}
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="py-[45px]">
          <h1 className="font-butler text-[32px] font-semibold text-[#1e293b]">
            Travel
          </h1>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto max-w-[1240px] px-5">
        {posts.map((post) => (
          <article key={post.title} className="pb-[45px]">
            <Link href="#" className="block">
              <div className="relative aspect-[4/5] w-full max-w-[820px] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 820px"
                />
              </div>
            </Link>

            <div className="mt-5">
              <h2 className="font-butler text-[26px] font-extralight text-[#1e293b]">
                <Link
                  href="#"
                  className="hover:text-[#BA9D95] transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              <div className="mt-1 font-poppins text-[15px]">
                <Link
                  href="/travel"
                  className="text-[#046bd2] hover:text-[#BA9D95] transition-colors"
                >
                  {post.category}
                </Link>
                <span className="text-[#334155]"> / Tracy Cartwright</span>
              </div>

              <p className="mt-3 font-poppins text-[15px] leading-[1.65] text-[#334155]">
                {post.excerpt}
              </p>

              <div className="mt-3">
                <Link
                  href="#"
                  className="font-poppins text-[15px] text-[#BA9D95] hover:text-[#1e293b] transition-colors"
                >
                  Read More &raquo;
                </Link>
              </div>
            </div>
          </article>
        ))}

        <nav
          className="flex items-center justify-center gap-1 py-8"
          aria-label="Post pagination"
        >
          <span className="flex h-9 w-9 items-center justify-center bg-[#BA9D95] font-poppins text-sm text-white">
            1
          </span>
          {[2, 3].map((n) => (
            <span
              key={n}
              className="flex h-9 w-9 items-center justify-center font-poppins text-sm text-[#334155] hover:text-[#BA9D95] cursor-pointer"
            >
              {n}
            </span>
          ))}
          <span className="flex h-9 w-9 items-center justify-center font-poppins text-sm text-[#334155]">
            ...
          </span>
          <span className="flex h-9 w-9 items-center justify-center font-poppins text-sm text-[#334155] hover:text-[#BA9D95] cursor-pointer">
            7
          </span>
          <span className="flex items-center justify-center px-2 font-poppins text-sm text-[#334155] hover:text-[#BA9D95] cursor-pointer">
            Next
          </span>
        </nav>
      </div>
    </div>
  );
}
