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
    <div className="space-y-6">
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
