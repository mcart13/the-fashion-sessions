import Image from "next/image";
import Link from "next/link";
import { LtkWidget } from "@/components/ThirdPartyEmbeds";
import {
  getPostHref,
  getSidebarLtkConfig,
  getTrendingPosts,
} from "@/lib/siteContent";
import { SOCIAL_LINKS } from "@/lib/siteConfig";
import SocialIcon from "@/components/SocialIcon";

const trendingPosts = getTrendingPosts();
const sidebarLtk = getSidebarLtkConfig();

export default function Sidebar() {
  return (
    <aside className="w-full">
      {/* Bio section */}
      <div className="text-center">
        <div className="relative mx-auto mb-5 aspect-[4/5] w-full max-w-[270px] overflow-hidden">
          <Image
            src="/images/sidebar-tracy.jpg"
            alt="Tracy"
            fill
            className="object-cover"
          />
        </div>
        <h2 className="mb-0 font-moontime text-[clamp(3rem,1.7309rem+1.813vw,4rem)] leading-none text-[#936740]">
          Hi!
        </h2>
        <p className="mt-[9px] px-[13px] font-butler text-[19px] font-thin leading-[24px] tracking-[0.1px] text-[#282828]">
          I&apos;m Tracy. I&apos;m a mom of two (and new empty nester!) who
          loves a good denim jacket, chips and queso, and dinner dates with my
          hubby. I believe fashion should be fun, versatile, and always express
          who you really are. Thanks for being here in my little corner of the
          world!
        </p>
      </div>

      {/* Social icons row */}
      <div className="flex items-center justify-center gap-0">
        {SOCIAL_LINKS.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[44px] w-[44px] items-center justify-center text-[#282828] transition-colors hover:text-[#BA9D95]"
            aria-label={social.name}
          >
            <SocialIcon name={social.name} className="w-5 h-5" />
          </Link>
        ))}
      </div>

      {/* Shop Feed divider */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#282828]" />
        <span className="font-poppins text-[13px] text-[#282828]">
          Shop Feed
        </span>
        <div className="flex-1 h-px bg-[#282828]" />
      </div>

      <div className="-mt-[10px] min-h-[320px]">
        {sidebarLtk ? (
          <LtkWidget
            appId={sidebarLtk.appId}
            cols={sidebarLtk.cols}
            rows={sidebarLtk.rows}
            userId={sidebarLtk.userId}
            widgetInstanceId={sidebarLtk.widgetInstanceId}
          />
        ) : null}
      </div>

      {/* Trending posts */}
      <div className="mt-[30px] border border-[#936740] p-[10px]">
        <h3 className="text-center font-moontime text-[50px] font-medium leading-[52px] text-[#936740]">
          trending posts
        </h3>
        <div className="mx-auto mb-4 mt-1 w-[20%] border-t border-[#936740]" />
        <ul className="space-y-3 px-4 pb-4">
          {trendingPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={getPostHref(post)}
                className="font-poppins text-[14px] leading-[1.65] text-[#282828] transition-colors hover:text-[#BA9D95]"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
