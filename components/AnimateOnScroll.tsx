"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIntersectionVisibility } from "@/components/useIntersectionVisibility";

type Animation =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight";

interface AnimateOnScrollProps {
  animation: Animation;
  children: ReactNode;
  className?: string;
  /** Override animation on mobile */
  mobileAnimation?: Animation;
  /** Delay in ms before animation starts */
  delay?: number;
}

const animationStyles: Record<Animation, { from: string; to: string }> = {
  fadeIn: {
    from: "opacity-0",
    to: "opacity-100",
  },
  fadeInUp: {
    from: "opacity-0 translate-y-[50px]",
    to: "opacity-100 translate-y-0",
  },
  fadeInDown: {
    from: "opacity-0 -translate-y-[50px]",
    to: "opacity-100 translate-y-0",
  },
  fadeInLeft: {
    from: "opacity-0 -translate-x-[50px]",
    to: "opacity-100 translate-x-0",
  },
  fadeInRight: {
    from: "opacity-0 translate-x-[50px]",
    to: "opacity-100 translate-x-0",
  },
};

export default function AnimateOnScroll({
  animation,
  children,
  className = "",
  mobileAnimation,
  delay = 0,
}: AnimateOnScrollProps) {
  const timeoutRef = useRef<number | null>(null);
  const { isVisible: isInView, ref } = useIntersectionVisibility<HTMLDivElement>(
    {
      once: true,
      threshold: 0.15,
    },
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!isInView) return;

    if (delay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setIsVisible(true);
        timeoutRef.current = null;
      }, delay);
    } else {
      setIsVisible(true);
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, isInView]);

  const activeAnimation =
    isMobile && mobileAnimation ? mobileAnimation : animation;
  const styles = animationStyles[activeAnimation];

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-1000 ease-out ${
        isVisible ? styles.to : styles.from
      } ${className}`}
    >
      {children}
    </div>
  );
}
