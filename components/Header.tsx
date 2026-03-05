"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/thefashionsessions/",
    icon: (
      <svg viewBox="0 0 320 512" fill="currentColor" className="w-4 h-4">
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://pin.it/7o6bmQb",
    icon: (
      <svg viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4">
        <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/thefashionsessions",
    icon: (
      <svg viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@thefashionsessions",
    icon: (
      <svg viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
        <path d="M448 209.91a210.06 210.06 0 01-122.77-39.25v178.72A162.55 162.55 0 11185 188.31v89.89a74.62 74.62 0 1052.23 71.18V0h88a121.18 121.18 0 001.86 22.17A122.18 122.18 0 00381 102.39a121.43 121.43 0 0067 20.14z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@thefashionsessions",
    icon: (
      <svg
        viewBox="0 0 576 512"
        fill="currentColor"
        className="w-[18px] h-[18px]"
      >
        <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" />
      </svg>
    ),
  },
];

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  dropdown?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Shop",
    href: "#",
    dropdown: [
      { label: "Shop My Instagram", href: "/shop-my-instagram" },
      { label: "Shop My Tiktok", href: "/shop-my-tiktok" },
    ],
  },
  {
    label: "TFS | The Label",
    href: "https://tfsthelabel.com/",
    external: true,
  },
  {
    label: "Blog",
    href: "#",
    dropdown: [
      { label: "Fashion", href: "/fashion" },
      { label: "Beauty", href: "/beauty" },
      { label: "Food", href: "/food" },
      { label: "Travel", href: "/travel" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileDropdown(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const isActive = (item: NavItem) => {
    if (item.href === "/" && pathname === "/") return true;
    if (
      item.href !== "/" &&
      item.href !== "#" &&
      pathname.startsWith(item.href)
    )
      return true;
    if (item.dropdown) {
      return item.dropdown.some((sub) => pathname.startsWith(sub.href));
    }
    return false;
  };

  const navLinkClass = (item: NavItem) =>
    `block px-5 py-2 font-poppins text-[15px] transition-colors duration-200 ${
      isActive(item) ? "text-[#BA9D95]" : "text-[#282828] hover:text-[#BA9D95]"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Social Bar */}
      <div className="flex justify-center items-center gap-5 py-2 bg-tan">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-[#282828] hover:opacity-60 transition-opacity duration-200"
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Logo + Nav Row */}
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 lg:px-10">
        {/* Logo (left) */}
        <Link href="/" className="shrink-0 py-2">
          <Image
            src="/images/logo.png"
            alt="The Fashion Sessions"
            width={350}
            height={100}
            className="w-[200px] md:w-[300px] h-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation (right) */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown ? handleMouseEnter(item.label) : undefined
                }
                onMouseLeave={item.dropdown ? handleMouseLeave : undefined}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navLinkClass(item)}
                  >
                    {item.label}
                  </a>
                ) : item.dropdown ? (
                  <button
                    className={`flex items-center gap-1 px-5 py-2 font-poppins text-[15px] transition-colors duration-200 ${
                      isActive(item)
                        ? "text-[#BA9D95]"
                        : "text-[#282828] hover:text-[#BA9D95]"
                    }`}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link href={item.href} className={navLinkClass(item)}>
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.dropdown && (
                  <div
                    className={`absolute left-0 top-full min-w-[200px] bg-white border border-gray-100 shadow-lg transition-all duration-200 z-50 ${
                      openDropdown === item.label
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                  >
                    <ul className="py-2">
                      {item.dropdown.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block px-5 py-2 font-poppins text-[15px] text-[#282828] hover:text-[#BA9D95] transition-colors duration-150 whitespace-nowrap"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          className="lg:hidden text-[#282828] p-2 hover:opacity-60 transition-opacity duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-black/30 z-40 transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Slide-out Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="text-[#282828] p-1 hover:opacity-60 transition-opacity"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="px-6 pb-8">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-3 font-poppins text-[15px] text-[#282828] hover:text-[#BA9D95] transition-colors border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : item.dropdown ? (
                  <div>
                    <button
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === item.label ? null : item.label,
                        )
                      }
                      className="flex items-center justify-between w-full py-3 font-poppins text-[15px] text-[#282828] hover:text-[#BA9D95] transition-colors border-b border-gray-100"
                      aria-expanded={mobileDropdown === item.label}
                    >
                      {item.label}
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${
                          mobileDropdown === item.label ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <ul
                      className={`overflow-hidden transition-all duration-200 ${
                        mobileDropdown === item.label
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.dropdown.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block py-2.5 pl-4 font-poppins text-[15px] text-[#282828] hover:text-[#BA9D95] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3 font-poppins text-[15px] text-[#282828] hover:text-[#BA9D95] transition-colors border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex justify-center items-center gap-5 pt-8">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-[#282828] hover:opacity-60 transition-opacity duration-200"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
