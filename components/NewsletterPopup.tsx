"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("newsletter-popup-shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("newsletter-popup-shown", "true");
    }, 3000);

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
        className="relative bg-white max-w-[700px] w-full flex overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
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
          />
        </div>

        {/* Right content */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="font-moontime text-[42px] leading-tight text-heading-dark mb-3">
            Subscribe to my Newsletter
          </h2>
          <p className="font-poppins text-sm text-text-dark mb-6 leading-relaxed">
            Be the first to know about new posts, exclusive offers, and style
            tips delivered straight to your inbox.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2.5 border border-gray-300 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2.5 border border-gray-300 font-poppins text-sm text-text-dark outline-none focus:border-accent-gold"
            />
            <button
              type="submit"
              className="w-full px-6 py-2.5 bg-tan border border-[#e9cec5] font-poppins text-sm text-text-dark hover:opacity-80 transition-opacity"
            >
              Let&apos;s Go
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
