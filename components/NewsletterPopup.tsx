"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FlodeskForm } from "@/components/ThirdPartyEmbeds";

interface NewsletterPopupProps {
  formId: string | null;
}

export default function NewsletterPopup({ formId }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("newsletter-popup-shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("newsletter-popup-shown", "true");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (reducedMotion) {
      setIsOpen(false);
      setIsAnimating(false);
      return;
    }
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 200);
  };

  if (!isOpen) return null;

  const showState = reducedMotion || isAnimating;

  return (
    <div
      className="fixed inset-0 z-popup flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ease-out ${
          showState ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal */}
      <div
        className={`relative bg-white max-w-[800px] w-full flex flex-col overflow-hidden max-h-[90vh] md:flex-row transition-[opacity,transform] duration-200 ease-out ${
          showState ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 w-11 h-11 flex items-center justify-center rounded-full text-gray-500 transition-colors hover:text-gray-800 hover:bg-gray-100"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left image */}
        <div className="hidden md:block relative w-1/2 min-h-[400px]">
          <Image
            src="/images/newsletter-popup.jpg"
            alt="Subscribe to newsletter"
            fill
            className="object-cover"
            sizes="350px"
          />
        </div>

        {/* Right content */}
        <div className="w-full md:w-1/2 overflow-y-auto p-5 sm:p-8 flex flex-col justify-center">
          <h2 className="font-moontime text-[clamp(2rem,1rem+3.5vw,2.7rem)] leading-tight text-text-dark mb-3">
            Subscribe to my Newsletter
          </h2>
          <div className="mb-6 space-y-3 text-center md:text-left">
            <p className="font-butler text-[18px] font-light leading-relaxed text-divider">
              Be the first to know about new blog posts, sales, gift guides and
              giveaways.
            </p>
            <p className="font-butler text-[18px] font-light leading-relaxed text-divider">
              Enter your name (first line) &amp; email address (second line).
            </p>
          </div>

          <div className="min-h-[180px]">
            {formId ? <FlodeskForm formId={formId} loading="eager" /> : null}
          </div>

          <p className="mt-4 font-poppins text-xs uppercase tracking-[1.2px] text-text-dark">
            Close this window if you are already subscribed.
          </p>
        </div>
      </div>
    </div>
  );
}
