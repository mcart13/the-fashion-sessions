"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { getClothingItems, type TryOnItem } from "@/data/try-on-items";

const SESSION_KEY = "tryon-clothing-count";
const SESSION_LIMIT = 5;
const MAX_IMAGE_DIMENSION = 1024;

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

function getSessionCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(sessionStorage.getItem(SESSION_KEY) || "0");
}

function incrementSessionCount(): void {
  sessionStorage.setItem(SESSION_KEY, String(getSessionCount() + 1));
}

export default function ClothingTryOn() {
  const clothingItems = getClothingItems();
  const [selectedItem, setSelectedItem] = useState<TryOnItem | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image must be under 10MB.");
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
    if (!userPhoto || !selectedItem?.garmentImage) return;

    if (getSessionCount() >= SESSION_LIMIT) {
      setError(
        "You've used all your try-ons for this session. Refresh the page to continue browsing!",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const garmentRes = await fetch(selectedItem.garmentImage);
      const garmentBlob = await garmentRes.blob();
      const garmentBase64 = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(garmentBlob);
      });

      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelImage: userPhoto,
          garmentImage: garmentBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      incrementSessionCount();
      setResultImage(data.output);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userPhoto, selectedItem]);

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `tryon-${selectedItem?.id || "result"}.jpg`;
    link.click();
  }, [resultImage, selectedItem]);

  return (
    <div className="space-y-8">
      {/* Garment picker */}
      <div>
        <p className="mb-3 font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
          Pick a garment
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {clothingItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSelectedItem(item);
                setResultImage(null);
              }}
              className={`overflow-hidden rounded-[2px] border-2 transition-all ${
                selectedItem?.id === item.id
                  ? "border-[#BA9D95] shadow-md"
                  : "border-transparent hover:border-[#E6DDD9]"
              }`}
            >
              <div className="relative aspect-[3/4] w-full bg-[#F5F3ED]">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="px-2 py-2 font-poppins text-[12px] text-[#282828]">
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <p className="mb-3 font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
          Upload your photo
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        {userPhoto ? (
          <div className="flex items-start gap-4">
            <div className="relative h-[200px] w-[150px] shrink-0 overflow-hidden rounded-[2px] bg-[#F5F3ED]">
              <Image
                src={userPhoto}
                alt="Your photo"
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
              className="font-poppins text-[12px] text-[#BA9D95] underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-[200px] w-full items-center justify-center rounded-[2px] border-2 border-dashed border-[#E6DDD9] bg-[#F5F3ED] transition-colors hover:border-[#BA9D95]"
          >
            <span className="font-poppins text-[14px] text-[#282828]/60">
              Tap to upload a full-body photo
            </span>
          </button>
        )}
        <p className="mt-2 font-poppins text-[11px] text-[#282828]/50">
          Your photo is processed securely and not saved.
        </p>
      </div>

      {/* Try it on button */}
      <button
        type="button"
        onClick={handleTryOn}
        disabled={!userPhoto || !selectedItem || loading}
        className="inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] hover:bg-tan active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : "Try It On"}
      </button>

      {/* Error message */}
      {error && (
        <p className="font-poppins text-[13px] text-red-600">{error}</p>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E6DDD9] border-t-[#BA9D95]" />
          <p className="font-poppins text-[13px] text-[#282828]/60">
            Creating your look... this takes about 10-15 seconds
          </p>
        </div>
      )}

      {/* Result */}
      {resultImage && (
        <div className="space-y-4">
          <p className="font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
            Your look
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#F5F3ED] sm:w-1/2">
              <Image
                src={userPhoto!}
                alt="Original photo"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 font-poppins text-[10px] text-white">
                Original
              </span>
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-[#F5F3ED] sm:w-1/2">
              <Image
                src={resultImage}
                alt="Try-on result"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 font-poppins text-[10px] text-white">
                Try-On
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] hover:bg-tan active:scale-[0.97]"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
