"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const AccessoryTryOn = dynamic(() => import("@/components/AccessoryTryOn"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <p className="font-poppins text-[13px] text-[#282828]/50">Loading…</p>
    </div>
  ),
});

const ClothingTryOn = dynamic(() => import("@/components/ClothingTryOn"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <p className="font-poppins text-[13px] text-[#282828]/50">Loading…</p>
    </div>
  ),
});

const tabs = [
  { id: "accessories" as const, label: "Accessories" },
  { id: "clothing" as const, label: "Clothing" },
];

type Tab = (typeof tabs)[number]["id"];

export default function TryOnTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("accessories");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    let nextIndex = currentIndex;

    if (e.key === "ArrowLeft") {
      nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    } else if (e.key === "ArrowRight") {
      nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Try-on type"
        className="relative flex border-b border-[#E6DDD9]"
        onKeyDown={handleKeyDown}
      >
        {/* Animated sliding indicator */}
        <span
          className="absolute bottom-0 h-[2px] bg-[#BA9D95] transition-transform duration-200"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          aria-hidden="true"
        />

        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 py-4 font-poppins text-[13px] uppercase tracking-[1.3px] transition-color duration-150 ease-out [touch-action:manipulation] ${
              activeTab === tab.id ? "text-[#282828]" : "text-[#282828]/40"
            }`}
            style={{ minHeight: 48 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={activeTab}
        className="pt-8"
      >
        {activeTab === "accessories" ? <AccessoryTryOn /> : <ClothingTryOn />}
      </div>
    </div>
  );
}
