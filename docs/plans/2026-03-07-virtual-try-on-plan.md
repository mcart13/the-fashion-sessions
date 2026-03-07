# Virtual Try-On Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/try-on` page to The Fashion Sessions with AR accessory try-on (camera) and AI clothing try-on (Fashn.ai).

**Architecture:** Client-heavy feature page with two independent experiences under a tabbed UI. Accessories use MediaPipe Face Landmarker running in-browser for real-time AR overlays. Clothing uses a Next.js API route that proxies requests to Fashn.ai's VTON v1.6 endpoint. Both share a curated item data file.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `fashn` SDK (server-side), `@mediapipe/tasks-vision` (client-side browser WASM).

**Note:** This project has no test framework configured. Verification steps use `npm run build` and manual browser checks against `npm run dev`.

---

### Task 1: Install Dependencies

**Files:**

- Modify: `package.json`

**Step 1: Install fashn SDK and MediaPipe tasks-vision**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm install fashn @mediapipe/tasks-vision
```

**Step 2: Verify installation**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && node -e "require('fashn'); console.log('fashn OK')"
```

Expected: `fashn OK`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add fashn and mediapipe dependencies for virtual try-on"
```

---

### Task 2: Create Try-On Items Data File

**Files:**

- Create: `data/try-on-items.ts`

**Step 1: Create the data file with types and placeholder items**

```ts
// data/try-on-items.ts

export interface TryOnAccessoryAnchor {
  landmarks: "eyes" | "forehead";
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface TryOnItem {
  id: string;
  name: string;
  thumbnail: string;
  type: "accessory" | "clothing";
  category: string;
  overlayImage?: string;
  anchor?: TryOnAccessoryAnchor;
  garmentImage?: string;
}

export const tryOnItems: TryOnItem[] = [
  // Accessories - these use transparent PNG overlays anchored to face landmarks
  {
    id: "acc-sunglasses-1",
    name: "Classic Aviators",
    thumbnail: "/images/try-on/sunglasses-1-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-1-overlay.png",
    anchor: { landmarks: "eyes", scale: 1.8, offsetX: 0, offsetY: -0.1 },
  },
  {
    id: "acc-sunglasses-2",
    name: "Oversized Frames",
    thumbnail: "/images/try-on/sunglasses-2-thumb.png",
    type: "accessory",
    category: "sunglasses",
    overlayImage: "/images/try-on/sunglasses-2-overlay.png",
    anchor: { landmarks: "eyes", scale: 2.0, offsetX: 0, offsetY: -0.05 },
  },
  {
    id: "acc-hat-1",
    name: "Wide Brim Hat",
    thumbnail: "/images/try-on/hat-1-thumb.png",
    type: "accessory",
    category: "hats",
    overlayImage: "/images/try-on/hat-1-overlay.png",
    anchor: { landmarks: "forehead", scale: 2.5, offsetX: 0, offsetY: -1.2 },
  },
  // Clothing - these use Fashn.ai VTON with flat-lay garment images
  {
    id: "cloth-top-1",
    name: "Floral Blouse",
    thumbnail: "/images/try-on/top-1-thumb.jpg",
    type: "clothing",
    category: "tops",
    garmentImage: "/images/try-on/top-1-garment.jpg",
  },
  {
    id: "cloth-dress-1",
    name: "Summer Midi Dress",
    thumbnail: "/images/try-on/dress-1-thumb.jpg",
    type: "clothing",
    category: "dresses",
    garmentImage: "/images/try-on/dress-1-garment.jpg",
  },
];

export function getAccessories(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "accessory");
}

export function getClothingItems(): TryOnItem[] {
  return tryOnItems.filter((item) => item.type === "clothing");
}
```

**Step 2: Verify it compiles**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npx tsc --noEmit data/try-on-items.ts 2>&1 || echo "Check errors above"
```

**Step 3: Create the images directory**

Run:

```bash
mkdir -p /Users/mason/tfs/the-fashion-sessions/public/images/try-on
```

**Step 4: Commit**

```bash
git add data/try-on-items.ts
git commit -m "feat: add try-on items data model with placeholder products"
```

---

### Task 3: Create Fashn.ai API Route

**Files:**

- Create: `app/api/try-on/route.ts`

This API route proxies try-on requests to Fashn.ai, keeping the API key server-side. It includes a simple daily generation cap using an in-memory counter (resets on server restart, which is fine for a preview feature).

**Step 1: Create the API route**

```ts
// app/api/try-on/route.ts
import { NextResponse } from "next/server";
import Fashn from "fashn";

const DAILY_CAP = 200;
let dailyCount = 0;
let lastResetDate = new Date().toDateString();

function checkAndIncrementDailyCount(): boolean {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyCount = 0;
    lastResetDate = today;
  }
  if (dailyCount >= DAILY_CAP) {
    return false;
  }
  dailyCount++;
  return true;
}

export async function POST(request: Request) {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Virtual try-on is not configured yet." },
      { status: 503 },
    );
  }

  if (!checkAndIncrementDailyCount()) {
    return NextResponse.json(
      {
        error: "We've reached today's try-on limit. Please try again tomorrow!",
      },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { modelImage, garmentImage } = body as {
    modelImage?: string;
    garmentImage?: string;
  };

  if (!modelImage || !garmentImage) {
    return NextResponse.json(
      { error: "Both a photo and a garment selection are required." },
      { status: 400 },
    );
  }

  try {
    const client = new Fashn({ apiKey });
    const response = await client.predictions.subscribe({
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImage,
        garment_image: garmentImage,
      },
    });

    if (response.status !== "completed") {
      return NextResponse.json(
        { error: response.error?.message ?? "Try-on generation failed." },
        { status: 500 },
      );
    }

    return NextResponse.json({ output: response.output?.at(0) });
  } catch (error) {
    console.error("Fashn.ai error:", error);
    if (error instanceof Fashn.APIError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
```

**Step 2: Add FASHN_API_KEY to .env.local**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions
# Only create if it doesn't already exist
test -f .env.local || touch .env.local
echo "" >> .env.local
echo "# Fashn.ai Virtual Try-On API" >> .env.local
echo "FASHN_API_KEY=your_api_key_here" >> .env.local
```

Then replace `your_api_key_here` with your actual Fashn.ai API key from https://fashn.ai/products/api.

**Step 3: Verify the route compiles**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

Expected: Build succeeds (the route will 503 without a real API key, that's fine).

**Step 4: Commit**

```bash
git add app/api/try-on/route.ts
git commit -m "feat: add Fashn.ai try-on API route with daily cap"
```

---

### Task 4: Create ClothingTryOn Component

**Files:**

- Create: `components/ClothingTryOn.tsx`

This is the upload-photo + pick-garment + call-API experience.

**Step 1: Create the component**

```tsx
// components/ClothingTryOn.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { getClothingItems, type TryOnItem } from "@/data/try-on-items";

const SESSION_KEY = "tryon-clothing-count";
const SESSION_LIMIT = 5;

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
      reader.onload = () => setUserPhoto(reader.result as string);
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
      const garmentUrl = `${window.location.origin}${selectedItem.garmentImage}`;
      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelImage: userPhoto,
          garmentImage: garmentUrl,
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
```

**Step 2: Verify it compiles**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

**Step 3: Commit**

```bash
git add components/ClothingTryOn.tsx
git commit -m "feat: add ClothingTryOn component with photo upload and Fashn.ai integration"
```

---

### Task 5: Create AccessoryTryOn Component

**Files:**

- Create: `components/AccessoryTryOn.tsx`

This is the camera-based AR overlay experience using MediaPipe Face Landmarker. This is the most complex component.

**Key MediaPipe Face Landmark indices used:**

- Eyes center: left eye outer corner (33), right eye outer corner (263) - for sunglasses
- Forehead: top of head (10), left temple (127), right temple (356) - for hats
- Eye distance is used as the scale reference

**Step 1: Create the component**

```tsx
// components/AccessoryTryOn.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAccessories, type TryOnItem } from "@/data/try-on-items";

// Landmark indices
const LEFT_EYE_OUTER = 33;
const RIGHT_EYE_OUTER = 263;
const FOREHEAD_TOP = 10;

export default function AccessoryTryOn() {
  const accessories = getAccessories();
  const [selectedItem, setSelectedItem] = useState<TryOnItem | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayImgRef = useRef<HTMLImageElement | null>(null);
  const faceLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  // Load overlay image when item changes
  useEffect(() => {
    if (!selectedItem?.overlayImage) {
      overlayImgRef.current = null;
      return;
    }
    const img = new window.Image();
    img.src = selectedItem.overlayImage;
    img.onload = () => {
      overlayImgRef.current = img;
    };
  }, [selectedItem]);

  // Initialize MediaPipe Face Landmarker
  const initFaceLandmarker = useCallback(async () => {
    const vision = await import("@mediapipe/tasks-vision");
    const { FaceLandmarker, FilesetResolver } = vision;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
      },
    );
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      await initFaceLandmarker();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Unable to access your camera. Please allow camera access and try again.",
      );
    }
  }, [initFaceLandmarker]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, [stopCamera]);

  // Render loop
  useEffect(() => {
    if (!cameraActive) return;

    let lastTime = -1;

    const renderFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const faceLandmarker = faceLandmarkerRef.current;

      if (!video || !canvas || !faceLandmarker) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Mirror the video (selfie mode)
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;

        const results = faceLandmarker.detectForVideo(video, performance.now());

        if (
          results.faceLandmarks &&
          results.faceLandmarks.length > 0 &&
          overlayImgRef.current &&
          selectedItem?.anchor
        ) {
          const landmarks = results.faceLandmarks[0];
          const overlay = overlayImgRef.current;
          const anchor = selectedItem.anchor;
          const w = canvas.width;
          const h = canvas.height;

          const leftEye = landmarks[LEFT_EYE_OUTER];
          const rightEye = landmarks[RIGHT_EYE_OUTER];

          // Mirror the x coordinates to match the flipped canvas
          const leftEyeX = (1 - leftEye.x) * w;
          const rightEyeX = (1 - rightEye.x) * w;
          const leftEyeY = leftEye.y * h;
          const rightEyeY = rightEye.y * h;

          const eyeDistance = Math.sqrt(
            (rightEyeX - leftEyeX) ** 2 + (rightEyeY - leftEyeY) ** 2,
          );
          const eyeCenterX = (leftEyeX + rightEyeX) / 2;
          const eyeCenterY = (leftEyeY + rightEyeY) / 2;
          const angle = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX);

          const overlayWidth = eyeDistance * anchor.scale;
          const aspectRatio = overlay.naturalHeight / overlay.naturalWidth;
          const overlayHeight = overlayWidth * aspectRatio;

          let cx: number;
          let cy: number;

          if (anchor.landmarks === "eyes") {
            cx = eyeCenterX + anchor.offsetX * eyeDistance;
            cy = eyeCenterY + anchor.offsetY * eyeDistance;
          } else {
            // forehead
            const forehead = landmarks[FOREHEAD_TOP];
            cx = (1 - forehead.x) * w + anchor.offsetX * eyeDistance;
            cy = forehead.y * h + anchor.offsetY * eyeDistance;
          }

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.drawImage(
            overlay,
            -overlayWidth / 2,
            -overlayHeight / 2,
            overlayWidth,
            overlayHeight,
          );
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cameraActive, selectedItem]);

  // Capture screenshot
  const handleCapture = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `tryon-${selectedItem?.id || "accessory"}.png`;
    link.click();
  }, [selectedItem]);

  return (
    <div className="space-y-6">
      {/* Accessory picker */}
      <div>
        <p className="mb-3 font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
          Pick an accessory
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {accessories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className={`shrink-0 overflow-hidden rounded-[2px] border-2 transition-all ${
                selectedItem?.id === item.id
                  ? "border-[#BA9D95] shadow-md"
                  : "border-transparent hover:border-[#E6DDD9]"
              }`}
            >
              <div className="relative h-[80px] w-[80px] bg-[#F5F3ED] sm:h-[100px] sm:w-[100px]">
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="px-1 py-1 font-poppins text-[11px] text-[#282828]">
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Camera viewfinder */}
      <div>
        {!cameraActive ? (
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={startCamera}
              className="inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] hover:bg-tan active:scale-[0.97]"
            >
              Start Camera
            </button>
            {cameraError && (
              <p className="font-poppins text-[13px] text-red-600">
                {cameraError}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[2px] bg-black">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute h-0 w-0 opacity-0"
              />
              <canvas ref={canvasRef} className="block w-full" />
              {!selectedItem && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <p className="rounded bg-black/50 px-4 py-2 font-poppins text-[13px] text-white">
                    Select an accessory above
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleCapture}
                disabled={!selectedItem}
                className="inline-block bg-[#EADFD2] px-[30px] py-[15px] font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] hover:bg-tan active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="font-poppins text-[12px] text-[#BA9D95] underline"
              >
                Stop Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

Note: The build will succeed but the component will only work in the browser (MediaPipe requires WASM + GPU). Manual testing with `npm run dev` and opening `/try-on` in Chrome is required.

**Step 3: Commit**

```bash
git add components/AccessoryTryOn.tsx
git commit -m "feat: add AccessoryTryOn component with MediaPipe face landmark AR"
```

---

### Task 6: Create TryOnTabs Component

**Files:**

- Create: `components/TryOnTabs.tsx`

**Step 1: Create the tabbed container**

```tsx
// components/TryOnTabs.tsx
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic imports to avoid SSR issues with camera/WASM
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
      {/* Tab buttons */}
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

      {/* Tab content */}
      <div className="pt-8">
        {activeTab === "accessories" ? <AccessoryTryOn /> : <ClothingTryOn />}
      </div>
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

**Step 3: Commit**

```bash
git add components/TryOnTabs.tsx
git commit -m "feat: add TryOnTabs component with dynamic imports"
```

---

### Task 7: Create /try-on Page

**Files:**

- Create: `app/try-on/page.tsx`

**Step 1: Create the page**

```tsx
// app/try-on/page.tsx
import AnimateOnScroll from "@/components/AnimateOnScroll";
import TryOnTabs from "@/components/TryOnTabs";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Virtual Try-On",
  description:
    "Try on Tracy's curated accessories with your camera or see how clothing looks on you with AI-powered virtual try-on.",
  path: "/try-on",
});

export default function TryOnPage() {
  return (
    <>
      <section className="bg-cream px-6 py-16 text-center">
        <AnimateOnScroll animation="fadeInUp">
          <p className="font-poppins text-[14px] uppercase tracking-[1.3px] text-[#282828]">
            Something fun to try
          </p>
          <h1 className="mt-2 font-butler text-[clamp(2.5rem,1.5rem+2vw,3.5rem)] font-extralight leading-[1.1] text-[#282828]">
            Virtual Try-On
          </h1>
          <p className="mx-auto mt-4 max-w-[550px] font-poppins text-[1rem] leading-[1.7] text-[#282828]">
            Try on accessories using your camera or upload a photo to see how an
            outfit looks on you.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-[900px]">
          <TryOnTabs />
        </div>
      </section>
    </>
  );
}
```

**Step 2: Check `lib/metadata.ts` to make sure `buildMetadata` supports the args we're passing**

Read `lib/metadata.ts` and confirm `buildMetadata({ title, description, path })` is the correct signature. Adjust if needed.

**Step 3: Verify it compiles and the page loads**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

Then manually verify: `npm run dev` and visit `http://localhost:3000/try-on`.

**Step 4: Commit**

```bash
git add app/try-on/page.tsx
git commit -m "feat: add /try-on page with hero and tabbed try-on experience"
```

---

### Task 8: Add "Try On" Nav Link to Header

**Files:**

- Modify: `components/Header.tsx` (lines 31-77, the `navItems` array)

**Step 1: Add a new nav item**

In `components/Header.tsx`, add the following entry to the `navItems` array, after the "Blog" menu item (line 75) and before the "Contact" item (line 76):

```ts
  { id: "try-on", label: "Try On", href: "/try-on", type: "link" },
```

So the end of the `navItems` array becomes:

```ts
  },
  { id: "try-on", label: "Try On", href: "/try-on", type: "link" },
  { id: "contact", label: "Contact", href: "/contact", type: "link" },
];
```

**Step 2: Verify the build and check both desktop and mobile nav**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -20
```

Then manually verify: `npm run dev`, check desktop nav shows "Try On" link, check mobile hamburger menu shows it too.

**Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: add Try On link to site navigation"
```

---

### Task 9: Add Placeholder Product Images

**Files:**

- Create: multiple files in `public/images/try-on/`

The try-on feature needs product images to function. For initial development and preview testing, we need placeholder images. There are two paths:

**Option A (for development/testing):** Generate simple colored placeholder PNGs so the UI renders and is testable. Use a script or download placeholders.

**Option B (for production):** Source real product photos from Tracy. Sunglasses/hat overlay PNGs need transparent backgrounds. Clothing items need clean flat-lay or mannequin shots.

**Step 1: Create minimal placeholder images for development**

Run this to generate simple colored SVG placeholders that the browser can render:

```bash
cd /Users/mason/tfs/the-fashion-sessions/public/images/try-on

# Sunglasses overlay placeholder (transparent PNG substitute - use SVG for now)
cat > sunglasses-1-overlay.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" fill="none">
  <ellipse cx="120" cy="75" rx="70" ry="55" stroke="#333" stroke-width="6" fill="#33333380"/>
  <ellipse cx="280" cy="75" rx="70" ry="55" stroke="#333" stroke-width="6" fill="#33333380"/>
  <line x1="190" y1="75" x2="210" y2="75" stroke="#333" stroke-width="6"/>
  <line x1="50" y1="65" x2="10" y2="55" stroke="#333" stroke-width="4"/>
  <line x1="350" y1="65" x2="390" y2="55" stroke="#333" stroke-width="4"/>
</svg>
SVG
```

For a real preview deployment, you will want to replace these with actual product photos. See the design doc for image requirements.

**Step 2: Update data file to reference SVGs during development if needed**

The data file references `.png` and `.jpg` files. For initial development, either:

- Create real placeholder PNGs (even 1x1 colored pixels work to unblock the UI)
- Or update the paths temporarily

**Step 3: Commit placeholders**

```bash
git add public/images/try-on/
git commit -m "feat: add placeholder images for try-on development"
```

---

### Task 10: Integration Test and Push

**Step 1: Full build check**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && npm run build 2>&1 | tail -30
```

Expected: Build succeeds with no errors.

**Step 2: Manual verification checklist**

Run `npm run dev` and check in browser:

- [ ] `/try-on` page loads with hero section
- [ ] "Try On" link appears in desktop nav and mobile menu
- [ ] Accessories tab shows item picker and "Start Camera" button
- [ ] Clothing tab shows garment picker and photo upload area
- [ ] Tab switching works
- [ ] Camera starts when clicking "Start Camera" (requires HTTPS or localhost)
- [ ] Photo upload accepts images and shows preview
- [ ] "Try It On" button is disabled until both photo and garment are selected
- [ ] Privacy notice is visible on clothing tab

**Step 3: Push to preview branch**

Run:

```bash
cd /Users/mason/tfs/the-fashion-sessions && git push origin preview
```

This triggers a Vercel preview deployment at the-fashion-sessions.vercel.app.

---

## Environment Variables Required

Add to Vercel project settings for the preview branch:

| Variable        | Value                  | Notes                        |
| --------------- | ---------------------- | ---------------------------- |
| `FASHN_API_KEY` | Your key from fashn.ai | Required for clothing try-on |

The accessories AR feature works without any env vars (browser-only).

## Image Assets Needed (from Tracy)

Before this feature is production-ready, you'll need:

1. **Accessory overlay PNGs** - transparent background, front-facing view. Sunglasses, hats, etc.
2. **Accessory thumbnails** - small preview images for the picker grid
3. **Clothing garment images** - clean flat-lay or ghost mannequin shots (Fashn.ai works best with these)
4. **Clothing thumbnails** - small preview images for the picker grid

Sources:

- [Fashn.ai Next.js Quickstart](https://docs.fashn.ai/guides/nextjs-quickstart)
- [Fashn.ai TypeScript SDK](https://docs.fashn.ai/sdk/typescript)
- [MediaPipe Face Landmarker Web JS](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js)
