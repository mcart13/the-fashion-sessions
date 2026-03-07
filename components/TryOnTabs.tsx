"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const AccessoryTryOn = dynamic(() => import("@/components/AccessoryTryOn"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <p className="font-poppins text-[13px] text-[#282828]/50">Loading...</p>
    </div>
  ),
});

const ClothingTryOn = dynamic(() => import("@/components/ClothingTryOn"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center">
      <p className="font-poppins text-[13px] text-[#282828]/50">Loading...</p>
    </div>
  ),
});

type Tab = "accessories" | "clothing";

export default function TryOnTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("accessories");

  return (
    <div>
      <div className="flex border-b border-[#E6DDD9]">
        <button
          type="button"
          onClick={() => setActiveTab("accessories")}
          className={`flex-1 py-4 font-poppins text-[13px] uppercase tracking-[1.3px] transition-colors ${
            activeTab === "accessories"
              ? "border-b-2 border-[#BA9D95] text-[#282828]"
              : "text-[#282828]/50 hover:text-[#282828]"
          }`}
        >
          Accessories
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("clothing")}
          className={`flex-1 py-4 font-poppins text-[13px] uppercase tracking-[1.3px] transition-colors ${
            activeTab === "clothing"
              ? "border-b-2 border-[#BA9D95] text-[#282828]"
              : "text-[#282828]/50 hover:text-[#282828]"
          }`}
        >
          Clothing
        </button>
      </div>

      <div className="pt-8">
        {activeTab === "accessories" ? <AccessoryTryOn /> : <ClothingTryOn />}
      </div>
    </div>
  );
}
