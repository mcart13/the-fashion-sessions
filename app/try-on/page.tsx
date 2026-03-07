import AnimateOnScroll from "@/components/AnimateOnScroll";
import TryOnTabs from "@/components/TryOnTabs";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Virtual Try-On",
  description:
    "Try on Tracy's curated accessories with your camera or see how clothing looks on you with AI-powered virtual try-on.",
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
            Try on accessories using your camera, or upload a photo to see how
            an outfit looks on you.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-[780px]">
          <TryOnTabs />
        </div>
      </section>
    </>
  );
}
