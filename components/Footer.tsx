import Image from "next/image";
import Link from "next/link";
import { ElfsightFeed } from "@/components/ThirdPartyEmbeds";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { getElfsightAppId } from "@/lib/siteContent";
import { SOCIAL_LINKS } from "@/lib/siteConfig";
import SocialIcon from "@/components/SocialIcon";

const socialGridLinks = SOCIAL_LINKS.map((s) => ({
  ...s,
  image: `/images/social/${s.name.toLowerCase()}.jpg`,
}));

const shopLinks = [
  {
    label: "Instagram Shop",
    href: "/shop-my-instagram",
  },
  {
    label: "Tiktok Shop",
    href: "/shop-my-tiktok",
  },
  {
    label: "Amazon Store",
    href: "https://www.amazon.com/shop/influencer-1f538e5c?ref=cm_sw_em_r_inf_own_influencer-1f538e5c_dp_augtGkKyrmRUF",
  },
];

const elfsightAppId = getElfsightAppId();

export default function Footer() {
  return (
    <footer>
      {/* Follow Along Section */}
      <section className="bg-cream py-10 text-center">
        <AnimateOnScroll animation="fadeIn">
          <h2 className="font-moontime text-[clamp(3rem,1.7309rem+1.813vw,4rem)] leading-none text-[#282828]">
            follow along!
          </h2>
        </AnimateOnScroll>
      </section>

      {/* Social Photo Grid */}
      <section className="grid grid-cols-3 md:grid-cols-6">
        {socialGridLinks.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-float group relative block aspect-[3/4] overflow-hidden"
          >
            <Image
              src={social.image}
              alt={social.name}
              fill
              sizes="(max-width: 768px) 33vw, 16.67vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="sr-only">{social.name}</span>
          </Link>
        ))}
      </section>

      {/* Dark Footer Section */}
      <section className="bg-[#282828] px-6 pt-5 pb-3 md:px-12">
        <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 md:grid-cols-2">
          {/* Shops */}
          <div>
            <h3 className="font-butler text-[clamp(1.8rem,1.3654rem+0.9065vw,2rem)] font-extralight text-[#E6DDD9]">
              Shops
            </h3>
            <div className="mt-2 mb-4 h-px w-12 bg-[#E6DDD9]/30" />
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="font-poppins text-[15px] text-[#E6DDD9] transition-colors hover:text-[#BA9D95]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Instagram Feed */}
          <div>
            <p className="text-center font-roboto text-[14px] text-[#E6DDD9]">
              Instagram Feed
            </p>
            <div className="mt-4">
              {elfsightAppId ? <ElfsightFeed appId={elfsightAppId} /> : null}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-poppins text-[9px] uppercase tracking-[2px] text-white">
            Copyright &copy; 2026 &middot; The Fashion Sessions
          </p>
          <div className="flex items-center gap-0 md:gap-[10px]">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-[44px] w-[44px] items-center justify-center text-[#E6DDD9] transition-colors hover:text-[#BA9D95] md:h-auto md:w-auto"
              >
                <SocialIcon name={social.name} className="w-[14px] h-[14px]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </footer>
  );
}
