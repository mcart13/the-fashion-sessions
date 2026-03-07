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
      <section className="bg-cream px-6 py-16 text-center">
        <AnimateOnScroll animation="fadeInUp">
          <p className="font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
            Something fun to try
          </p>
          <h1 className="mt-2 font-butler text-[clamp(2.5rem,1.5rem+2vw,3.5rem)] font-extralight leading-[1.1] text-[#282828]">
            Virtual Try-On
          </h1>
          <p className="mx-auto mt-4 max-w-[550px] font-poppins text-[1rem] leading-[1.7] text-[#282828]">
            Try on accessories using your camera or upload a photo to see how an
            outfit looks on you.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-[900px]">
          <TryOnTabs />
        </div>
      </section>
    </>
  );
}
