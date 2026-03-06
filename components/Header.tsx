"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialIcon from "@/components/SocialIcon";
import { SOCIAL_LINKS } from "@/lib/siteConfig";

const headerSocialLinks = SOCIAL_LINKS.filter(
  (social) => social.name !== "Amazon",
);

type NavLeaf = {
  href: string;
  id: string;
  label: string;
  type: "external" | "link";
};

type NavMenu = {
  id: "blog" | "shop";
  items: NavLeaf[];
  label: string;
  type: "menu";
};

type NavItem = NavLeaf | NavMenu;
type NavMenuId = NavMenu["id"];

const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/", type: "link" },
  { id: "about", label: "About", href: "/about", type: "link" },
  {
    id: "shop",
    label: "Shop",
    type: "menu",
    items: [
      {
        id: "shop-instagram",
        label: "Shop My Instagram",
        href: "/shop-my-instagram",
        type: "link",
      },
      {
        id: "shop-tiktok",
        label: "Shop My Tiktok",
        href: "/shop-my-tiktok",
        type: "link",
      },
      {
        id: "shop-amazon",
        label: "Amazon Store",
        href: "https://www.amazon.com/shop/influencer-1f538e5c?ref=cm_sw_em_r_inf_own_influencer-1f538e5c_dp_augtGkKyrmRUF",
        type: "external",
      },
    ],
  },
  {
    id: "label",
    label: "TFS | The Label",
    href: "https://tfsthelabel.com/",
    type: "external",
  },
  {
    id: "blog",
    label: "Blog",
    type: "menu",
    items: [
      { id: "blog-fashion", label: "Fashion", href: "/fashion", type: "link" },
      { id: "blog-beauty", label: "Beauty", href: "/beauty", type: "link" },
      { id: "blog-food", label: "Food", href: "/food", type: "link" },
      { id: "blog-travel", label: "Travel", href: "/travel", type: "link" },
    ],
  },
  { id: "contact", label: "Contact", href: "/contact", type: "link" },
];

function isMenu(item: NavItem): item is NavMenu {
  return item.type === "menu";
}

function isExternal(item: NavLeaf) {
  return item.type === "external";
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<NavMenuId | null>(
    null,
  );
  const [openMobileMenu, setOpenMobileMenu] = useState<NavMenuId | null>(null);
  const closeDelayRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setOpenMobileMenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (closeDelayRef.current !== null) {
        window.clearTimeout(closeDelayRef.current);
      }
    };
  }, []);

  const clearCloseDelay = () => {
    if (closeDelayRef.current !== null) {
      window.clearTimeout(closeDelayRef.current);
      closeDelayRef.current = null;
    }
  };

  const handleDesktopMenuEnter = (menuId: NavMenuId) => {
    clearCloseDelay();
    setOpenDesktopMenu(menuId);
  };

  const handleDesktopMenuLeave = () => {
    clearCloseDelay();
    closeDelayRef.current = window.setTimeout(() => {
      setOpenDesktopMenu(null);
      closeDelayRef.current = null;
    }, 150);
  };

  const handleDesktopMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, menuId: NavMenuId) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpenDesktopMenu((current) => (current === menuId ? null : menuId));
      } else if (event.key === "Escape") {
        setOpenDesktopMenu(null);
      }
    },
    [],
  );

  const isActive = (item: NavItem) => {
    if (isMenu(item)) {
      return item.items.some(
        (subItem) =>
          subItem.type === "link" && pathname.startsWith(subItem.href),
      );
    }

    if (item.type !== "link") {
      return false;
    }

    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(item.href);
  };

  const desktopLinkClass = (active: boolean) =>
    `block px-[15px] py-2 font-poppins text-[11px] uppercase tracking-[1.2px] transition-colors duration-200 ${
      active ? "text-[#BA9D95]" : "text-[#282828] hover:text-[#BA9D95]"
    }`;

  const desktopMenuButtonClass = (active: boolean) =>
    `flex items-center gap-1 px-[15px] py-2 font-poppins text-[11px] uppercase tracking-[1.2px] transition-colors duration-200 ${
      active ? "text-[#BA9D95]" : "text-[#282828] hover:text-[#BA9D95]"
    }`;

  return (
    <header className="bg-white">
      <div className="flex items-center justify-center gap-1 bg-tan py-[5px] md:gap-4 md:py-[9px]">
        {headerSocialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="flex h-[44px] w-[44px] items-center justify-center text-[#282828] transition-colors duration-200 hover:text-[#BA9D95] md:h-auto md:w-auto"
          >
            <SocialIcon name={social.name} className="h-[15px] w-[15px]" />
          </a>
        ))}
      </div>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="shrink-0 py-[14px]">
          <Image
            src="/images/logo.png"
            alt="The Fashion Sessions"
            width={350}
            height={100}
            className="h-auto w-[205px] md:w-[285px] lg:w-[370px] xl:w-[504px]"
            priority
          />
        </Link>

        <nav className="hidden items-center lg:flex">
          <ul className="flex items-center">
            {navItems.map((item) => {
              const active = isActive(item);

              return (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={
                    isMenu(item)
                      ? () => handleDesktopMenuEnter(item.id)
                      : undefined
                  }
                  onMouseLeave={
                    isMenu(item) ? handleDesktopMenuLeave : undefined
                  }
                >
                  {isMenu(item) ? (
                    <>
                      <button
                        type="button"
                        className={desktopMenuButtonClass(active)}
                        aria-expanded={openDesktopMenu === item.id}
                        aria-haspopup="true"
                        onKeyDown={(event) =>
                          handleDesktopMenuKeyDown(event, item.id)
                        }
                      >
                        {item.label}
                        <svg
                          className={`ml-0.5 h-3 w-3 transition-transform duration-200 ${
                            openDesktopMenu === item.id ? "rotate-180" : ""
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

                      <div
                        className={`absolute left-0 top-full z-50 min-w-[200px] bg-cream shadow-[0_0_10px_rgba(0,0,0,0.18)] transition-all duration-200 ${
                          openDesktopMenu === item.id
                            ? "visible translate-y-0 opacity-100"
                            : "invisible -translate-y-1 opacity-0"
                        }`}
                      >
                        <ul className="py-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.id}>
                              {isExternal(subItem) ? (
                                <a
                                  href={subItem.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block whitespace-nowrap px-4 py-2 font-poppins text-[11px] uppercase tracking-[1.2px] text-[#282828] transition-colors duration-150 hover:text-[#BA9D95]"
                                >
                                  {subItem.label}
                                </a>
                              ) : (
                                <Link
                                  href={subItem.href}
                                  className="block whitespace-nowrap px-4 py-2 font-poppins text-[11px] uppercase tracking-[1.2px] text-[#282828] transition-colors duration-150 hover:text-[#BA9D95]"
                                >
                                  {subItem.label}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : isExternal(item) ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={desktopLinkClass(active)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className={desktopLinkClass(active)}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          className="p-2 text-[#282828] transition-opacity duration-200 hover:opacity-60 lg:hidden"
        >
          <svg
            className="h-6 w-6"
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

      <div
        className={`fixed inset-0 top-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-50 h-full w-[280px] overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-1 text-[#282828] transition-opacity hover:opacity-60"
          >
            <svg
              className="h-6 w-6"
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
              <li key={item.id}>
                {isMenu(item) ? (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMobileMenu((current) =>
                          current === item.id ? null : item.id,
                        )
                      }
                      className="flex w-full items-center justify-between border-b border-gray-100 py-3 font-poppins text-[15px] text-[#282828] transition-colors hover:text-[#BA9D95]"
                      aria-expanded={openMobileMenu === item.id}
                    >
                      {item.label}
                      <svg
                        className={`h-3 w-3 transition-transform duration-200 ${
                          openMobileMenu === item.id ? "rotate-180" : ""
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
                        openMobileMenu === item.id
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.items.map((subItem) => (
                        <li key={subItem.id}>
                          {isExternal(subItem) ? (
                            <a
                              href={subItem.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block py-2.5 pl-4 font-poppins text-[15px] text-[#282828] transition-colors hover:text-[#BA9D95]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          ) : (
                            <Link
                              href={subItem.href}
                              className="block py-2.5 pl-4 font-poppins text-[15px] text-[#282828] transition-colors hover:text-[#BA9D95]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : isExternal(item) ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-gray-100 py-3 font-poppins text-[15px] text-[#282828] transition-colors hover:text-[#BA9D95]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block border-b border-gray-100 py-3 font-poppins text-[15px] text-[#282828] transition-colors hover:text-[#BA9D95]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-1 pt-8">
            {headerSocialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-[44px] w-[44px] items-center justify-center text-[#282828] transition-colors duration-200 hover:text-[#BA9D95]"
              >
                <SocialIcon name={social.name} className="h-[15px] w-[15px]" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
