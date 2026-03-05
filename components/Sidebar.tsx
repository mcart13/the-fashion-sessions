"use client";

import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/thefashionsessions/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    url: "https://pin.it/7o6bmQb",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://instagram.com/thefashionsessions",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@thefashionsessions",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@thefashionsessions",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    url: "https://www.amazon.com/shop/thefashionsessions",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.045 18.02c.072-.116.187-.124.348-.022 2.344 1.474 4.864 2.211 7.56 2.211 1.876 0 3.728-.361 5.555-1.084a16.07 16.07 0 001.937-.96c.182-.107.338-.063.467.131.129.195.09.358-.115.491a12.265 12.265 0 01-3.198 1.47 13.472 13.472 0 01-4.646.803c-2.961 0-5.576-.81-7.85-2.431-.093-.071-.1-.143-.058-.609zm22.003-2.062c-.26-.319-.696-.495-1.307-.526a5.08 5.08 0 00-.98.053c-.345.053-.645.128-.9.224-.098.04-.162.04-.194-.019-.032-.06.012-.135.132-.224.351-.262.81-.465 1.375-.61.564-.143 1.074-.178 1.529-.106.455.073.794.283 1.017.631.223.347.282.768.178 1.261-.104.494-.388.95-.853 1.365-.466.416-.961.683-1.486.8-.095.021-.145-.009-.151-.091-.005-.082.042-.132.141-.151.526-.107.953-.384 1.282-.832.328-.447.433-.868.312-1.264a.637.637 0 00-.095-.211zM14.184 17.15c-.235-.175-.53-.264-.885-.264-.354 0-.665.064-.931.191-.267.128-.503.307-.71.537-.206.23-.36.495-.462.796-.102.301-.152.602-.152.902 0 .414.112.768.337 1.063.224.295.521.443.89.443.345 0 .662-.076.953-.228.29-.152.534-.354.73-.607.196-.253.342-.535.44-.847.097-.312.146-.622.146-.929 0-.401-.119-.748-.356-1.057zm-1.2-1.454c.629 0 1.168.167 1.617.502.449.334.765.775.949 1.323.183.548.217 1.103.1 1.664a4.147 4.147 0 01-.727 1.588 4.12 4.12 0 01-1.32 1.15 3.333 3.333 0 01-1.664.445c-.635 0-1.174-.165-1.617-.495-.443-.33-.759-.77-.949-1.32a3.903 3.903 0 01-.1-1.664c.102-.568.338-1.096.708-1.585a4.12 4.12 0 011.32-1.153 3.333 3.333 0 011.683-.455z" />
        <path d="M6.632 13.25c0 .564.173 1.024.52 1.38.346.356.8.534 1.36.534.412 0 .792-.102 1.14-.306.348-.204.637-.474.866-.81.23-.335.396-.71.5-1.121.103-.413.155-.835.155-1.266 0-.564-.173-1.025-.52-1.38-.346-.357-.8-.535-1.36-.535a2.58 2.58 0 00-1.14.306 3.055 3.055 0 00-.866.81 3.595 3.595 0 00-.5 1.121 4.524 4.524 0 00-.155 1.267zm-1.87 0c0-.728.132-1.404.396-2.028a5.274 5.274 0 011.1-1.665 5.238 5.238 0 011.637-1.126A4.65 4.65 0 019.896 8c.784 0 1.452.196 2.003.588.55.392.935.91 1.152 1.554.218.644.257 1.325.12 2.044a5.286 5.286 0 01-.863 2.009 5.238 5.238 0 01-1.637 1.517 4.122 4.122 0 01-2.06.564c-.784 0-1.452-.196-2.003-.588-.55-.392-.935-.91-1.153-1.553a4.586 4.586 0 01-.12-2.044l.027-.341z" />
      </svg>
    ),
  },
];

const trendingPosts = [
  "Time for a Fall Bra Refresh with Soma",
  "Homemade Sweet & Smoky BBQ Sauce",
  "Meet your new favorite sandal for summer, the Livi Espadrille Wedge!",
  "These straw hats are under $25 & will have you vacation ready!",
  "My Top 5 Must-haves for Spring from H&M",
  "Cooking Chili with Cooksy",
  "Victoria Emerson Jewelry Sale!",
  "My Favorite New Releases from Target!",
  "Most Loved Items from 2020",
  "How to Style Neutrals from the Same Color Palette",
];

export default function Sidebar() {
  return (
    <aside className="w-full">
      {/* Bio section */}
      <div className="text-center mb-8">
        <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden relative">
          <Image
            src="/images/hero-about.jpg"
            alt="Tracy"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="font-moontime text-[60px] leading-none text-heading-dark mb-2">
          Hi!
        </h2>
        <p className="font-poppins text-sm text-text-dark leading-relaxed px-2">
          I&apos;m Tracy. I&apos;m a mom of two (and new empty nester!) who
          loves a good denim jacket, chips and queso, and dinner dates with my
          hubby. I believe fashion should be fun, versatile, and always express
          who you really are. Thanks for being here in my little corner of the
          world!
        </p>
      </div>

      {/* Social icons row */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark hover:text-accent-gold transition-colors"
            aria-label={social.name}
          >
            {social.icon}
          </Link>
        ))}
      </div>

      {/* Shop Feed divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="font-poppins text-xs uppercase tracking-widest text-text-dark">
          Shop Feed
        </span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* 3x3 LTK placeholder grid */}
      <div className="grid grid-cols-3 gap-1 mb-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200" />
        ))}
      </div>

      {/* Trending posts divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="font-moontime text-3xl text-heading-dark whitespace-nowrap">
          trending posts
        </span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* Trending post links */}
      <ul className="space-y-3">
        {trendingPosts.map((post) => (
          <li key={post}>
            <Link
              href="#"
              className="font-poppins text-sm text-text-dark hover:text-accent-gold transition-colors leading-relaxed"
            >
              {post}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
