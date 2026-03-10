"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AnimateOnScroll from "@/components/AnimateOnScroll";

/** Hand-drawn squiggly arrow that draws itself in. */
function SquigglyArrow({ show }: { show: boolean }) {
  return (
    <svg
      width="70"
      height="14"
      viewBox="0 0 70 14"
      fill="none"
      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
      aria-hidden="true"
    >
      <path
        d="M 3 7 Q 9 2, 15 7 Q 21 12, 27 7 Q 33 2, 39 7 Q 45 12, 51 7 Q 57 2, 60 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: 80,
          strokeDashoffset: show ? 0 : 80,
          transition: "stroke-dashoffset 0.8s ease-out 0.2s",
        }}
      />
      <path
        d="M 56 3 L 64 7 L 56 11"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: show ? 1 : 0,
          transition: "opacity 0.3s ease-out 0.9s",
        }}
      />
    </svg>
  );
}

const heroSlides = [
  {
    src: "/images/hero-home-slide-1.jpg",
    alt: "Tracy standing beside a clothing rack",
    position: "center" as const,
  },
  {
    src: "/images/hero-home-slide-2.jpg",
    alt: "Tracy in a white dress",
    position: "top" as const,
  },
];

const AUTOPLAY_MS = 5000;

export default function HomeHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAnnotation, setShowAnnotation] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setShowAnnotation(true);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, AUTOPLAY_MS);

    // Show annotation after hero entrance animation (500ms) + a beat
    const annotationTimer = window.setTimeout(
      () => setShowAnnotation(true),
      1200,
    );

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(annotationTimer);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-cream py-[40px] md:py-[50px]">
      <div className="mx-auto max-w-[1140px] px-0 md:px-0">
        <div className="relative isolate md:min-h-[700px]">
          <div className="absolute left-[2%] top-11 hidden h-[78%] w-[56%] bg-white/22 md:block" />
          <div className="absolute right-[3%] top-[132px] hidden h-[360px] w-[44%] bg-white/28 md:block" />

          <div className="relative flex flex-col gap-0 md:flex-row md:items-center md:gap-8">
            <AnimateOnScroll
              animation="fadeInLeft"
              mobileAnimation="fadeIn"
              className="relative z-[1] w-full md:w-[56%]"
            >
              <div className="relative aspect-[4/5] overflow-hidden md:h-[700px] md:aspect-auto">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === activeIndex ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={index !== activeIndex}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 56vw"
                      className={`object-cover ${slide.position === "top" ? "object-top" : "object-center"}`}
                    />
                  </div>
                ))}

                {/* "Try this look" annotation */}
                <Link
                  href="/try-on?look=date-night"
                  className={`absolute right-4 top-4 z-10 flex flex-col items-end gap-0.5 transition-all duration-700 ease-out md:right-6 md:top-5 ${
                    showAnnotation
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                  aria-label="Try on this outfit virtually"
                >
                  <span className="font-moontime text-[1.3rem] leading-none text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)] md:text-[1.5rem]">
                    Try this look
                  </span>
                  <SquigglyArrow show={showAnnotation} />
                </Link>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll
              animation="fadeInRight"
              mobileAnimation="fadeInUp"
              className="relative z-[2] ml-auto mt-[-54px] w-[92%] max-w-[560px] px-5 py-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.02)] sm:w-[88%] sm:px-9 sm:py-10 md:absolute md:right-[3.8%] md:top-1/2 md:mt-0 md:w-[49%] md:-translate-y-1/2 md:px-12 md:py-[46px]"
            >
              <div className="absolute inset-0 bg-white/70" />
              <div className="relative">
                <h1 className="font-butler text-[clamp(2.2rem,1.5482rem+1.3598vw,2.5rem)] font-extralight leading-[1.3] text-text-dark md:leading-[1.3]">
                  WELCOME TO
                  <br />
                  THE FASHION SESSIONS.
                </h1>
                <p className="mx-auto mt-8 max-w-[470px] font-poppins text-[1rem] font-light leading-[1.7] text-text-dark">
                  I believe fashion is whatever makes you feel and look like the
                  best version of yourself. If you love it, wear it!
                </p>
                <Link
                  href="/about"
                  className="mt-10 inline-flex min-w-[136px] items-center justify-center bg-btn-cta px-[30px] py-[15px] font-poppins text-[14px] font-extralight leading-[1] text-text-dark transition-[background-color,transform] hover:bg-tan active:scale-[0.97]"
                >
                  Learn More
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
