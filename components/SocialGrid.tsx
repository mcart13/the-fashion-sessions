import Image from "next/image";
import Link from "next/link";

const socialPlatforms = [
  {
    name: "Facebook",
    image: "/images/social/facebook.jpg",
    url: "https://www.facebook.com/thefashionsessions/",
  },
  {
    name: "Pinterest",
    image: "/images/social/pinterest.jpg",
    url: "https://pin.it/7o6bmQb",
  },
  {
    name: "Instagram",
    image: "/images/social/instagram.jpg",
    url: "https://instagram.com/thefashionsessions",
  },
  {
    name: "TikTok",
    image: "/images/social/tiktok.jpg",
    url: "https://www.tiktok.com/@thefashionsessions",
  },
  {
    name: "YouTube",
    image: "/images/social/youtube.jpg",
    url: "https://youtube.com/@thefashionsessions",
  },
  {
    name: "Amazon",
    image: "/images/social/amazon.jpg",
    url: "https://www.amazon.com/shop/thefashionsessions",
  },
];

export default function SocialGrid() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6">
      {socialPlatforms.map((platform) => (
        <Link
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square group overflow-hidden"
        >
          <Image
            src={platform.image}
            alt={platform.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
          <span className="absolute inset-0 flex items-center justify-center font-moontime text-white text-3xl md:text-4xl drop-shadow-lg">
            {platform.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
