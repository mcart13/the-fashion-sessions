import AnimateOnScroll from "@/components/AnimateOnScroll";
import { ShopThePostWidget } from "@/components/ThirdPartyEmbeds";
import { buildMetadata } from "@/lib/metadata";
import { getShopTiktokSections } from "@/lib/siteContent";

const tiktokSections = getShopTiktokSections(10);

export const metadata = buildMetadata({
  title: "Shop My Tiktok",
  description: "Shop Tracy's latest TikTok looks and product picks.",
  path: "/shop-my-tiktok",
});

export default function ShopMyTiktokPage() {
  return (
    <div className="bg-cream">
      {/* Header */}
      <AnimateOnScroll animation="fadeInUp">
        <div className="pt-[30px] pb-4 text-center">
          <h2 className="font-moontime text-[clamp(3.5rem,2.5rem+3vw,5rem)] font-extralight leading-none text-[#282828]">
            Tracy&apos;s
          </h2>
          <h1 className="-mt-3 font-butler text-[clamp(2.6rem,1.7309rem+1.813vw,3rem)] font-thin text-[#282828]">
            Shop My Tiktok
          </h1>
          <p className="mt-3 font-poppins text-[15px] text-[#282828]">
            Click on any items below to shop my TikTok looks!
          </p>
          <div className="mx-auto mt-[5px] h-px w-[5%] bg-[#282828]" />
        </div>
      </AnimateOnScroll>

      {/* TikTok Sections */}
      <div className="mx-auto max-w-[1140px] px-5 py-10">
        <div className="space-y-12">
          {tiktokSections.map((section, index) => (
            <div key={section.title}>
              <h2 className="mb-4 font-butler text-[clamp(1.5rem,1rem+1.5vw,2rem)] font-extralight text-[#282828]">
                {section.title}
              </h2>
              <div className="min-h-[220px] bg-white/60 p-6">
                {section.widgetId ? (
                  <ShopThePostWidget
                    widgetId={section.widgetId}
                    loading={index === 0 ? "eager" : undefined}
                  />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
