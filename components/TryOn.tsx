"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { tryOnItems, type TryOnItem } from "@/data/try-on-items";

const MAX_IMAGE_DIMENSION = 1024;

const LOADING_MESSAGES = [
  "Analyzing your photo\u2026",
  "Styling your look\u2026",
  "Generating your image\u2026",
  "Almost there\u2026",
];

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

const clothingItems = tryOnItems.filter((i) => i.type === "clothing");
const accessoryItems = tryOnItems.filter((i) => i.type === "accessory");

export default function TryOn() {
  const [selectedItems, setSelectedItems] = useState<TryOnItem[]>([]);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const toggleItem = useCallback((item: TryOnItem) => {
    setResultImage(null);
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

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

    try {
      const items: {
        image: string;
        name: string;
        description: string;
        type: string;
      }[] = [];
      for (const item of selectedItems) {
        const res = await fetch(item.image);
        const blob = await res.blob();
        const base64 = await new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(blob);
        });
        items.push({
          image: base64,
          name: item.name,
          description: item.description,
          type: item.type,
        });
      }

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
  }, [resultImage]);

  const isSelected = (id: string) => selectedItems.some((i) => i.id === id);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      {/* Left column: Result preview (sticky on desktop) */}
      <div className="order-2 lg:order-1 lg:w-[55%] lg:sticky lg:top-28">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F5F3ED] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
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
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#E6DDD9] border-t-[#BA9D95]" />
              </div>
              <p
                key={loadingMsgIndex}
                className="animate-[fadeIn_300ms_ease-out] font-poppins text-[13px] text-[#282828]/50"
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
                className="text-[#BA9D95]/25"
                aria-hidden="true"
              >
                <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
                <path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25L19 14Z" />
              </svg>
              <p className="text-center font-poppins text-[13px] leading-relaxed text-[#282828]/25">
                Your styled look will appear here
              </p>
            </div>
          )}
        </div>

        {resultImage && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-[#EADFD2] px-6 py-3 font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] duration-150 ease-out [touch-action:manipulation] hover:bg-[#E6DDD9] active:scale-[0.97]"
              style={{ minHeight: 44 }}
            >
              <DownloadIcon />
              Save Image
            </button>
          </div>
        )}
      </div>

      {/* Right column: Controls */}
      <div className="order-1 space-y-8 lg:order-2 lg:w-[45%]">
        {/* Step 1: Pick items */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BA9D95] font-poppins text-[11px] font-medium text-white">
              1
            </span>
            <p className="font-poppins text-[13px] uppercase tracking-[1.3px] text-[#282828]">
              Build your look
            </p>
          </div>

          {/* Clothing */}
          <p className="mb-2 font-poppins text-[11px] uppercase tracking-[1px] text-[#282828]/50">
            Clothing
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {clothingItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item)}
                className="group overflow-hidden rounded-sm [touch-action:manipulation]"
                style={{ minHeight: 44 }}
              >
                <div
                  className={`relative aspect-[3/4] w-full overflow-hidden bg-[#F5F3ED] transition-shadow duration-200 ease-out ${
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
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#BA9D95] text-white">
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
                    isSelected(item.id) ? "text-[#282828]" : "text-[#282828]/60"
                  }`}
                >
                  {item.name}
                </p>
              </button>
            ))}
          </div>

          {/* Accessories */}
          <p className="mb-2 font-poppins text-[11px] uppercase tracking-[1px] text-[#282828]/50">
            Accessories
          </p>
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
                  className={`relative h-[80px] w-[80px] overflow-hidden bg-[#F5F3ED] transition-shadow duration-200 ease-out ${
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
                    <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#BA9D95] text-white">
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
                    isSelected(item.id) ? "text-[#282828]" : "text-[#282828]/60"
                  }`}
                >
                  {item.name}
                </p>
              </button>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <p className="mt-3 font-poppins text-[12px] text-[#BA9D95]">
              {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </div>

        {/* Step 2: Photo upload */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BA9D95] font-poppins text-[11px] font-medium text-white">
              2
            </span>
            <p className="font-poppins text-[13px] uppercase tracking-[1.3px] text-[#282828]">
              Upload your photo
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          {userPhoto ? (
            <div className="flex items-start gap-4">
              <div className="relative h-[160px] w-[120px] shrink-0 overflow-hidden rounded-sm bg-[#F5F3ED] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
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
                className="mt-1 font-poppins text-[12px] text-[#BA9D95] underline underline-offset-2 [touch-action:manipulation]"
                style={{ minHeight: 44 }}
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-[160px] w-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-[#E6DDD9] bg-[#FAFAF7] transition-[border-color,background-color] duration-150 ease-out [touch-action:manipulation] hover:border-[#BA9D95] hover:bg-[#F5F3ED]"
            >
              <span className="text-[#BA9D95]">
                <UploadIcon />
              </span>
              <span className="font-poppins text-[13px] text-[#282828]/50">
                Tap to upload a full-body photo
              </span>
            </button>
          )}
          <p className="mt-2 font-poppins text-[11px] text-[#282828]/40">
            Your photo is processed securely and never saved.
          </p>
        </div>

        {/* Try it on button + error */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleTryOn}
            disabled={!userPhoto || selectedItems.length === 0 || loading}
            className="inline-flex items-center gap-2 bg-[#282828] px-8 py-4 font-poppins text-[12px] uppercase tracking-[1.2px] text-white transition-[opacity,transform] duration-150 ease-out [touch-action:manipulation] hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
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
              <span className="h-px flex-1 bg-[#E6DDD9]" aria-hidden="true" />
              <p className="font-poppins text-[11px] uppercase tracking-[1px] text-[#BA9D95]">
                Shop this look
              </p>
              <span className="h-px flex-1 bg-[#E6DDD9]" aria-hidden="true" />
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
                    }
                  : {};
                return (
                  <Wrapper
                    key={item.id}
                    {...linkProps}
                    className={`flex items-center gap-3 rounded-sm border border-[#E6DDD9] px-3 py-2.5 transition-[border-color,background-color] duration-150 ${
                      hasLink
                        ? "cursor-pointer hover:border-[#BA9D95] hover:bg-[#FAFAF7]"
                        : ""
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-[#F5F3ED]">
                      <Image
                        src={item.thumbnail}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="flex-1 font-poppins text-[12px] text-[#282828]">
                      {item.name}
                    </span>
                    {hasLink ? (
                      <span className="font-poppins text-[11px] uppercase tracking-[0.8px] text-[#BA9D95]">
                        Shop
                      </span>
                    ) : (
                      <span className="font-poppins text-[10px] uppercase tracking-[0.8px] text-[#282828]/30">
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
