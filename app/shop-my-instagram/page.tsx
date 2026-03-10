import Sidebar from "@/components/Sidebar";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { LtkWidget } from "@/components/ThirdPartyEmbeds";
import { buildMetadata } from "@/lib/metadata";
import { getShopInstagramConfig } from "@/lib/siteContent";

export const metadata = buildMetadata({
  title: "Shop My Instagram",
  description: "Shop Tracy's latest Instagram finds.",
  path: "/shop-my-instagram",
});

export default function ShopMyInstagramPage() {
  const shopInstagram = getShopInstagramConfig();

  return (
    <div className="bg-cream">
      {/* Header */}
      <AnimateOnScroll animation="fadeInUp">
        <div className="pt-[30px] text-center">
          <h2 className="font-moontime text-[clamp(3.5rem,2.5rem+3vw,5rem)] font-extralight leading-none text-text-dark">
            Tracy&apos;s
          </h2>
          <h1 className="-mt-3 font-butler text-[clamp(2.6rem,1.7309rem+1.813vw,3rem)] font-thin text-text-dark">
            Shop My Instagram
          </h1>
          <div className="mx-auto mt-[5px] h-px w-[5%] bg-text-dark" />
        </div>
      </AnimateOnScroll>

      {/* Two-column Layout */}
      <div className="mx-auto max-w-[1120px] px-5 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[75%_25%]">
          <AnimateOnScroll animation="fadeInLeft">
            <div className="min-h-[400px] p-[10px_20px_0_10px]">
              {shopInstagram ? (
                <LtkWidget
                  appId={shopInstagram.appId}
                  cols={shopInstagram.cols}
                  loading="eager"
                  rows={shopInstagram.rows}
                  userId={shopInstagram.userId}
                />
              ) : null}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fadeInRight">
            <Sidebar />
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  );
}
