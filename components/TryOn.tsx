"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  tryOnItems,
  type TryOnItem,
  type ClothingCategory,
} from "@/data/try-on-items";
import { tryOnLooks, type TryOnLook } from "@/data/try-on-looks";
import { trackEvent } from "@/lib/analytics";
import CollapsibleSection from "@/components/CollapsibleSection";

const MAX_IMAGE_DIMENSION = 1024;

const LOADING_MESSAGES = [
  "Analyzing your photo\u2026",
  "Styling your look\u2026",
  "Generating your image\u2026",
  "Almost there\u2026",
];

const SUBCATEGORY_ORDER: ClothingCategory[] = [
  "tops",
  "bottoms",
  "outerwear",
  "dresses",
];

const SUBCATEGORY_LABELS: Record<ClothingCategory, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  dresses: "Dresses",
};

function resizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const { width, height } = img;
      if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
        resolve(dataUrl);
        return;
      }
      const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}

function UploadIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="inline-block"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

const clothingByCategory = SUBCATEGORY_ORDER.map((cat) => ({
  category: cat,
  label: SUBCATEGORY_LABELS[cat],
  items: tryOnItems.filter((i) => i.type === "clothing" && i.category === cat),
})).filter((g) => g.items.length > 0);

const accessoryItems = tryOnItems.filter((i) => i.type === "accessory");

export default function TryOn() {
  const [selectedItems, setSelectedItems] = useState<TryOnItem[]>([]);
  const [activeLook, setActiveLook] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(true);
  const [shareToast, setShareToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-collapse upload section when result arrives
  useEffect(() => {
    if (resultImage) setUploadOpen(false);
  }, [resultImage]);

  useEffect(() => {
    if (!loading) {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  // Auto-dismiss share toast
  useEffect(() => {
    if (!shareToast) return;
    const timer = setTimeout(() => setShareToast(false), 2000);
    return () => clearTimeout(timer);
  }, [shareToast]);

  const toggleItem = useCallback((item: TryOnItem) => {
    setActiveLook(null);
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        trackEvent("item_deselect", { item_id: item.id });
        return prev.filter((i) => i.id !== item.id);
      }
      trackEvent("item_select", { item_id: item.id });
      return [...prev, item];
    });
  }, []);

  const handleSelectLook = useCallback((look: TryOnLook) => {
    setActiveLook(look.id);
    const items = look.itemIds
      .map((id) => tryOnItems.find((i) => i.id === id))
      .filter((i): i is TryOnItem => !!i);
    setSelectedItems(items);
    trackEvent("look_select", { look_id: look.id });
  }, []);

  // Pre-select look from URL parameter (e.g. ?look=date-night)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lookParam = params.get("look");
    if (lookParam) {
      const look = tryOnLooks.find((l) => l.id === lookParam);
      if (look) handleSelectLook(look);
    }
  }, [handleSelectLook]);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10 MB.");
        return;
      }

      setError(null);
      setResultImage(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const resized = await resizeImage(reader.result as string);
        setUserPhoto(resized);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleTryOn = useCallback(async () => {
    if (!userPhoto || selectedItems.length === 0) return;

    setLoading(true);
    setError(null);
    setResultImage(null);
    trackEvent("tryon_attempt", { item_count: selectedItems.length });

    try {
      const items = await Promise.all(
        selectedItems.map(async (item) => {
          const res = await fetch(item.image);
          const blob = await res.blob();
          const base64 = await new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result as string);
            r.readAsDataURL(blob);
          });
          return {
            image: base64,
            name: item.name,
            description: item.description,
            type: item.type,
          };
        }),
      );

      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelImage: userPhoto, items }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResultImage(data.output);
      trackEvent("tryon_success", { item_count: selectedItems.length });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userPhoto, selectedItems]);

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "tryon-result.png";
    link.click();
    trackEvent("download");
  }, [resultImage]);

  const handleShare = useCallback(async () => {
    if (!resultImage) return;

    trackEvent("share");

    try {
      // Convert base64 to blob/file
      const res = await fetch(resultImage);
      const blob = await res.blob();
      const file = new File([blob], "tryon-result.png", { type: "image/png" });

      // Try native share
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: "Check out my virtual try-on from The Fashion Sessions!",
          url: window.location.href,
        });
        return;
      }
    } catch {
      // Share cancelled or failed, fall through to clipboard
    }

    // Fallback: copy link + text to clipboard
    try {
      await navigator.clipboard.writeText(
        `Check out my virtual try-on from The Fashion Sessions! ${window.location.href}`,
      );
      setShareToast(true);
    } catch {
      // Clipboard not available
    }
  }, [resultImage]);

  const isSelected = (id: string) => selectedItems.some((i) => i.id === id);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      {/* Left column: Result preview (sticky on desktop) */}
      <div className="order-2 lg:order-1 lg:sticky lg:top-28 lg:w-[55%]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-cream shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
          {resultImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={resultImage}
              alt="Try-on result"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-tan border-t-accent-gold" />
              </div>
              <p
                key={loadingMsgIndex}
                className="animate-[fadeIn_300ms_ease-out] font-poppins text-[13px] text-text-dark/50"
              >
                {LOADING_MESSAGES[loadingMsgIndex]}
              </p>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent-gold/25"
                aria-hidden="true"
              >
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
                <path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z" />
              </svg>
              <p className="text-center font-poppins text-[13px] leading-relaxed text-text-dark/25">
                Your styled look will appear here
              </p>
            </div>
          )}
        </div>

        {resultImage && (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-btn-cta px-6 py-3 font-poppins text-[12px] uppercase tracking-[0.9px] text-text-dark transition-[background-color,transform] duration-150 ease-out [touch-action:manipulation] hover:bg-tan active:scale-[0.97]"
              style={{ minHeight: 44 }}
            >
              <DownloadIcon />
              Save Image
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 border border-tan bg-white px-6 py-3 font-poppins text-[12px] uppercase tracking-[0.9px] text-text-dark transition-[border-color,background-color,transform] duration-150 ease-out [touch-action:manipulation] hover:border-accent-gold hover:bg-[#FAFAF7] active:scale-[0.97]"
                style={{ minHeight: 44 }}
              >
                <ShareIcon />
                Share
              </button>
              {shareToast && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-text-dark px-3 py-1 font-poppins text-[11px] text-white">
                  Copied!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right column: Controls */}
      <div className="order-1 space-y-6 lg:order-2 lg:w-[45%]">
        {/* Instagram Looks */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-gold"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle
                cx="17.5"
                cy="6.5"
                r="1.5"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            <p className="font-poppins text-[11px] uppercase tracking-[1px] text-accent-gold">
              Shop Her Posts
            </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {tryOnLooks.map((look) => (
              <button
                key={look.id}
                type="button"
                onClick={() => handleSelectLook(look)}
                className="group shrink-0 [touch-action:manipulation]"
              >
                <div
                  className={`relative h-[120px] w-[120px] overflow-hidden rounded-sm transition-shadow duration-200 ease-out ${
                    activeLook === look.id
                      ? "shadow-[0_0_0_2px_#BA9D95]"
                      : "shadow-[0_0_0_1px_rgba(0,0,0,0.06)] group-hover:shadow-[0_0_0_2px_#BA9D95]"
                  }`}
                >
                  <Image
                    src={look.image}
                    alt={look.name}
                    fill
                    className="object-cover"
                  />
                  {activeLook === look.id && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-white">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1.5 max-w-[120px] truncate px-0.5 font-poppins text-[11px] leading-tight transition-colors duration-150 ${
                    activeLook === look.id
                      ? "text-text-dark"
                      : "text-text-dark/50 group-hover:text-text-dark/70"
                  }`}
                >
                  {look.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Build your look */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-gold font-poppins text-[11px] font-medium text-white">
              1
            </span>
            <p className="font-poppins text-[13px] uppercase tracking-[1.3px] text-text-dark">
              Build your look
            </p>
            {selectedItems.length > 0 && (
              <span className="font-poppins text-[12px] text-accent-gold">
                {selectedItems.length} item
                {selectedItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {clothingByCategory.map(({ category, label, items }) => {
              const catCount = selectedItems.filter(
                (i) => i.type === "clothing" && i.category === category,
              ).length;
              return (
                <CollapsibleSection
                  key={category}
                  title={label}
                  indicator={catCount > 0 ? `${catCount}` : undefined}
                >
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item)}
                        className="group overflow-hidden rounded-sm [touch-action:manipulation]"
                        style={{ minHeight: 44 }}
                      >
                        <div
                          className={`relative aspect-[3/4] w-full overflow-hidden bg-cream transition-shadow duration-200 ease-out ${
                            isSelected(item.id)
                              ? "shadow-[0_0_0_2px_#BA9D95]"
                              : "shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                          }`}
                        >
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          {isSelected(item.id) && (
                            <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-white">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p
                          className={`px-1 py-2 font-poppins text-[11px] leading-tight transition-color duration-150 ${
                            isSelected(item.id)
                              ? "text-text-dark"
                              : "text-text-dark/60"
                          }`}
                        >
                          {item.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}

            <CollapsibleSection
              title="Accessories"
              indicator={
                selectedItems.filter((i) => i.type === "accessory").length > 0
                  ? `${selectedItems.filter((i) => i.type === "accessory").length}`
                  : undefined
              }
            >
              <div className="flex gap-3 overflow-x-auto pb-2">
                {accessoryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item)}
                    className="group shrink-0 [touch-action:manipulation]"
                    style={{ minHeight: 44 }}
                  >
                    <div
                      className={`relative h-[80px] w-[80px] overflow-hidden bg-cream transition-shadow duration-200 ease-out ${
                        isSelected(item.id)
                          ? "shadow-[0_0_0_2px_#BA9D95]"
                          : "shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
                      }`}
                    >
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {isSelected(item.id) && (
                        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-gold text-white">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p
                      className={`px-1 py-1.5 font-poppins text-[11px] transition-color duration-150 ${
                        isSelected(item.id)
                          ? "text-text-dark"
                          : "text-text-dark/60"
                      }`}
                    >
                      {item.name}
                    </p>
                  </button>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Step 2: Photo upload */}
        <CollapsibleSection
          step={2}
          title="Upload your photo"
          indicator={userPhoto ? "\u2713" : undefined}
          open={uploadOpen}
          onToggle={setUploadOpen}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          {userPhoto ? (
            <div className="flex items-start gap-4">
              <div className="relative h-[100px] w-[75px] shrink-0 overflow-hidden rounded-sm bg-cream shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
                <Image
                  src={userPhoto}
                  alt="Your uploaded photo"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserPhoto(null);
                  setResultImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="mt-1 font-poppins text-[12px] text-accent-gold underline underline-offset-2 [touch-action:manipulation]"
                style={{ minHeight: 44 }}
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[100px] w-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-tan bg-[#FAFAF7] transition-[border-color,background-color] duration-150 ease-out [touch-action:manipulation] hover:border-accent-gold hover:bg-cream"
            >
              <span className="text-accent-gold">
                <UploadIcon />
              </span>
              <span className="font-poppins text-[13px] text-text-dark/50">
                Tap to upload a full-body photo
              </span>
            </button>
          )}
          <p className="mt-2 font-poppins text-[11px] text-text-dark/40">
            Your photo is processed securely and never saved.
          </p>
        </CollapsibleSection>

        {/* Try it on button + error */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleTryOn}
            disabled={!userPhoto || selectedItems.length === 0 || loading}
            className="inline-flex items-center gap-2 bg-text-dark px-8 py-4 font-poppins text-[12px] uppercase tracking-[1.2px] text-white transition-[opacity,transform] duration-150 ease-out [touch-action:manipulation] hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
            style={{ minHeight: 48 }}
          >
            {loading ? "Generating\u2026" : "Try It On"}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 shrink-0 text-red-500"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="font-poppins text-[13px] leading-relaxed text-red-700">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Shop This Look */}
        {resultImage && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-tan" aria-hidden="true" />
              <p className="font-poppins text-[11px] uppercase tracking-[1px] text-accent-gold">
                Shop this look
              </p>
              <span className="h-px flex-1 bg-tan" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              {selectedItems.map((item) => {
                const hasLink = !!item.url;
                const Wrapper = hasLink ? "a" : "div";
                const linkProps = hasLink
                  ? {
                      href: item.url!,
                      target: "_blank" as const,
                      rel: "noopener noreferrer",
                      onClick: () =>
                        trackEvent("ltk_click", { item_id: item.id }),
                    }
                  : {};
                return (
                  <Wrapper
                    key={item.id}
                    {...linkProps}
                    className={`flex items-center gap-3 rounded-sm border border-tan px-3 py-2.5 transition-[border-color,background-color] duration-150 ${
                      hasLink
                        ? "cursor-pointer hover:border-accent-gold hover:bg-[#FAFAF7]"
                        : ""
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-cream">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="flex-1 font-poppins text-[12px] text-text-dark">
                      {item.name}
                    </span>
                    {hasLink ? (
                      <span className="font-poppins text-[11px] uppercase tracking-[0.8px] text-accent-gold">
                        Shop
                      </span>
                    ) : (
                      <span className="font-poppins text-[10px] uppercase tracking-[0.8px] text-text-dark/30">
                        Coming soon
                      </span>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
