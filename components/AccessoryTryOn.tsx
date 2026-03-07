"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAccessories, type TryOnItem } from "@/data/try-on-items";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const faceLandmarkerRef = useRef<any>(null);
  const animationRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

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

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      streamRef.current = stream;
      setCameraActive(true);

      // Load face detection in the background — camera works even if this fails
      initFaceLandmarker().catch((err) => {
        console.warn("Face detection unavailable:", err);
      });
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Unable to access your camera. Please allow camera access and try again.",
      );
    }
  }, [initFaceLandmarker]);

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

  useEffect(() => {
    return () => {
      stopCamera();
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!cameraActive) return;

    // Attach stream to video element once it mounts
    const video = videoRef.current;
    if (video && streamRef.current && !video.srcObject) {
      video.srcObject = streamRef.current;
      video.play().catch(() => {});
    }

    let lastTime = -1;

    const renderFrame = () => {
      const v = videoRef.current;
      const canvas = canvasRef.current;
      const faceLandmarker = faceLandmarkerRef.current;

      if (!v || !canvas) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      if (v.videoWidth === 0 || v.videoHeight === 0) {
        animationRef.current = requestAnimationFrame(renderFrame);
        return;
      }

      canvas.width = v.videoWidth;
      canvas.height = v.videoHeight;

      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(v, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      if (faceLandmarker && v.currentTime !== lastTime) {
        lastTime = v.currentTime;

        const results = faceLandmarker.detectForVideo(v, performance.now());

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
    <div className="space-y-8">
      {/* Accessory picker */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BA9D95] font-poppins text-[11px] font-medium text-white">
            1
          </span>
          <p className="font-poppins text-[13px] uppercase tracking-[1.3px] text-[#282828]">
            Pick an accessory
          </p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {accessories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="group shrink-0 [touch-action:manipulation]"
              style={{ minHeight: 44 }}
            >
              <div
                className={`relative h-[80px] w-[80px] overflow-hidden bg-[#F5F3ED] transition-shadow duration-200 ease-out sm:h-[100px] sm:w-[100px] ${
                  selectedItem?.id === item.id
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
                {selectedItem?.id === item.id && (
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
                  selectedItem?.id === item.id
                    ? "text-[#282828]"
                    : "text-[#282828]/60"
                }`}
              >
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Camera section */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BA9D95] font-poppins text-[11px] font-medium text-white">
            2
          </span>
          <p className="font-poppins text-[13px] uppercase tracking-[1.3px] text-[#282828]">
            Try it on
          </p>
        </div>

        {!cameraActive ? (
          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 bg-[#282828] px-8 py-4 font-poppins text-[12px] uppercase tracking-[1.2px] text-white transition-[opacity,transform] duration-150 ease-out [touch-action:manipulation] hover:opacity-90 active:scale-[0.97]"
              style={{ minHeight: 48 }}
            >
              Start Camera
            </button>
            {cameraError && (
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
                  {cameraError}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-sm bg-black shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute h-0 w-0 opacity-0"
              />
              <canvas ref={canvasRef} className="block w-full" />
              {!selectedItem && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <p className="rounded-sm bg-black/60 px-4 py-2 font-poppins text-[13px] text-white backdrop-blur-sm">
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
                aria-label="Capture photo"
                className="inline-flex items-center gap-2 bg-[#EADFD2] px-6 py-3 font-poppins text-[12px] uppercase tracking-[0.9px] text-[#282828] transition-[background-color,transform] duration-150 ease-out [touch-action:manipulation] hover:bg-[#E6DDD9] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                style={{ minHeight: 44 }}
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="font-poppins text-[12px] text-[#BA9D95] underline underline-offset-2 [touch-action:manipulation]"
                style={{ minHeight: 44 }}
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
