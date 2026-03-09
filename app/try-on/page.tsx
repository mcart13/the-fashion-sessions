import dynamic from "next/dynamic";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { buildMetadata } from "@/lib/metadata";

const TryOn = dynamic(() => import("@/components/TryOn"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <p className="font-poppins text-[13px] text-[#282828]/50">Loading…</p>
    </div>
  ),
});

export const metadata = buildMetadata({
  title: "Virtual Try-On",
  description:
    "Try on Tracy's curated clothing and accessories with AI-powered virtual try-on. Upload your photo and see how a full look works on you.",
  path: "/try-on",
});

export default function TryOnPage() {
  return (
    <>
      <section className="bg-cream px-6 py-20 text-center">
        <AnimateOnScroll animation="fadeInUp">
          <p
            className="font-moontime text-[clamp(2rem,1.5rem+1.5vw,2.8rem)] leading-none text-[#936740]"
            aria-hidden="true"
          >
            something fun
          </p>
          <h1 className="mt-1 font-butler text-[clamp(2.5rem,1.5rem+2vw,3.5rem)] font-extralight leading-[1.1] text-[#282828] [text-wrap:balance]">
            Virtual Try-On
          </h1>
          <p className="mx-auto mt-5 max-w-[480px] font-poppins text-[15px] leading-[1.8] text-[#282828]/70">
            Pick clothing and accessories, upload your photo, and see how the
            look works on you.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <TryOn />
        </div>
      </section>
    </>
  );
}
