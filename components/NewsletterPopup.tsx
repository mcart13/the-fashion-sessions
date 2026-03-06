"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FlodeskForm } from "@/components/ThirdPartyEmbeds";

interface NewsletterPopupProps {
  formId: string | null;
}

export default function NewsletterPopup({ formId }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("newsletter-popup-shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("newsletter-popup-shown", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative bg-white max-w-[800px] w-full flex flex-col overflow-hidden max-h-[90vh] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 z-10 w-11 h-11 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
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
          <h2 className="font-moontime text-[clamp(2rem,1rem+3.5vw,2.7rem)] leading-tight text-[#282828] mb-3">
            Subscribe to my Newsletter
          </h2>
          <div className="mb-6 space-y-3 text-center md:text-left">
            <p className="font-butler text-[18px] font-light leading-relaxed text-[#B98F67]">
              Be the first to know about new blog posts, sales, gift guides and
              giveaways.
            </p>
            <p className="font-butler text-[18px] font-light leading-relaxed text-[#B98F67]">
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
