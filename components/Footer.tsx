"use client";

import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    name: "Facebook",
    image: "/images/social/facebook.jpg",
    href: "https://www.facebook.com/thefashionsessions/",
  },
  {
    name: "Pinterest",
    image: "/images/social/pinterest.jpg",
    href: "https://pin.it/7o6bmQb",
  },
  {
    name: "Instagram",
    image: "/images/social/instagram.jpg",
    href: "https://instagram.com/thefashionsessions",
  },
  {
    name: "TikTok",
    image: "/images/social/tiktok.jpg",
    href: "https://www.tiktok.com/@thefashionsessions",
  },
  {
    name: "YouTube",
    image: "/images/social/youtube.jpg",
    href: "https://youtube.com/@thefashionsessions",
  },
  {
    name: "Amazon",
    image: "/images/social/amazon.jpg",
    href: "https://www.amazon.com/shop/thefashionsessions",
  },
];

const shopLinks = [
  {
    label: "Instagram Shop",
    href: "https://instagram.com/thefashionsessions",
  },
  {
    label: "Tiktok Shop",
    href: "https://www.tiktok.com/@thefashionsessions",
  },
  {
    label: "Amazon Store",
    href: "https://www.amazon.com/shop/thefashionsessions",
  },
];

export default function Footer() {
  return (
    <footer>
      {/* Follow Along Section */}
      <section className="bg-cream py-10 text-center">
        <h2 className="font-moontime text-[64px] leading-none text-[#282828]">
          follow along!
        </h2>
      </section>

      {/* Social Photo Grid */}
      <section className="grid grid-cols-3 md:grid-cols-6">
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden"
          >
            <Image
              src={social.image}
              alt={social.name}
              fill
              sizes="(max-width: 768px) 33vw, 16.67vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="absolute inset-0 flex items-center justify-center font-moontime text-4xl text-white drop-shadow-md md:text-5xl">
              {social.name}
            </span>
          </Link>
        ))}
      </section>

      {/* Dark Footer Section */}
      <section className="bg-[#282828] px-6 pt-5 pb-3 md:px-12">
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 md:grid-cols-2">
          {/* Shops */}
          <div>
            <h3 className="font-butler text-[32px] font-extralight text-[#E6DDD9]">
              Shops
            </h3>
            <div className="mt-2 mb-4 h-px w-12 bg-[#E6DDD9]/30" />
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-poppins text-[15px] text-[#E6DDD9] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram Feed */}
          <div>
            <p className="text-center font-roboto text-[15px] text-[#E6DDD9]">
              Instagram Feed
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm bg-[#3a3a3a]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="font-poppins text-xs text-[#E6DDD9]">
            Copyright &copy; 2023 &middot; The Fashion Sessions
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-[#E6DDD9] transition-colors hover:text-white"
              >
                <SocialIcon name={social.name} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Bar */}
      <section className="bg-black py-4 text-center">
        <p className="font-poppins text-[10px] text-[#E6DDD9]">
          Powered By &ndash; Only Marketing Agency
        </p>
      </section>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const iconSize = "w-4 h-4";

  switch (name) {
    case "Facebook":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case "Pinterest":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.425 1.81-2.425.853 0 1.265.641 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.48 1.806 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.282a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.222-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.15-1.16V6.69h3.15z" />
        </svg>
      );
    case "YouTube":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "Amazon":
      return (
        <svg
          className={iconSize}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M.045 18.02c.072-.116.187-.124.348-.064 2.729 1.353 5.706 2.03 8.926 2.03 2.239 0 4.455-.39 6.649-1.175.292-.104.578-.21.857-.323.131-.054.262-.112.39-.168.226-.1.39-.042.495.17.107.215.014.392-.181.527-.478.33-.988.636-1.528.919a18.32 18.32 0 01-4.108 1.433 18.68 18.68 0 01-4.395.523c-2.023 0-3.942-.337-5.762-1.01a17.47 17.47 0 01-1.673-.752c-.098-.052-.18-.12-.191-.223a.39.39 0 01.173-.337zm5.047-1.94c-.164-.087-.164-.2.013-.338.748-.566 1.574-.96 2.477-1.18.57-.138 1.15-.2 1.742-.186.852.024 1.66.186 2.428.49.092.036.175.087.238.16.063.076.087.16.067.258-.024.137-.137.24-.274.225a3.94 3.94 0 01-.434-.06c-.67-.126-1.344-.15-2.022-.065-.64.08-1.254.252-1.838.517a4.877 4.877 0 00-.532.29c-.114.072-.2.075-.282.013-.087-.064-.173-.13-.258-.196-.12-.095-.24-.193-.363-.29-.069-.054-.133-.108-.196-.162z" />
          <path d="M13.841 14.56c-.066.024-.112.07-.135.136l-.29 1.058c-.038.144-.13.212-.274.204a2.15 2.15 0 01-.476-.08c-.478-.125-.91-.34-1.29-.652a3.87 3.87 0 01-.895-1.09c-.21-.373-.355-.771-.435-1.197a5.54 5.54 0 01-.074-.98c.014-.87.2-1.694.556-2.474a6.948 6.948 0 011.296-1.93 7.68 7.68 0 011.855-1.428 7.26 7.26 0 012.105-.815c.402-.1.808-.157 1.22-.174.753-.034 1.476.076 2.168.324.398.142.772.33 1.118.568.076.052.14.116.192.192.034.055.046.11.034.163a.22.22 0 01-.1.145c-.062.044-.128.06-.2.04a1.46 1.46 0 01-.262-.1 5.27 5.27 0 00-2.172-.495 5.95 5.95 0 00-1.558.135c-.86.2-1.642.56-2.345 1.076a6.2 6.2 0 00-1.612 1.67 5.86 5.86 0 00-.82 2.107c-.068.37-.093.744-.075 1.12.03.59.17 1.148.416 1.673.087.186.204.258.367.196z" />
        </svg>
      );
    default:
      return null;
  }
}
