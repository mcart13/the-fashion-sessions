"use client";

import { useEffect, useRef, useState } from "react";

type ObserverCallback = (entry: IntersectionObserverEntry) => void;

interface ObserverState {
  callbacks: Map<Element, ObserverCallback>;
  observer: IntersectionObserver;
}

interface UseIntersectionVisibilityOptions {
  disabled?: boolean;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
}

const observerStates = new Map<string, ObserverState>();

function getObserverKey({
  rootMargin = "0px",
  threshold = 0,
}: Pick<UseIntersectionVisibilityOptions, "rootMargin" | "threshold">) {
  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(",")
    : threshold.toString();

  return `${rootMargin}|${thresholdKey}`;
}

function getObserverState({
  rootMargin = "0px",
  threshold = 0,
}: Pick<UseIntersectionVisibilityOptions, "rootMargin" | "threshold">) {
  const key = getObserverKey({ rootMargin, threshold });
  const existing = observerStates.get(key);

  if (existing) {
    return { key, state: existing };
  }

  const callbacks = new Map<Element, ObserverCallback>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        callbacks.get(entry.target)?.(entry);
      });
    },
    { rootMargin, threshold },
  );

  const state = { callbacks, observer };
  observerStates.set(key, state);

  return { key, state };
}

function observeElement(
  element: Element,
  options: Pick<UseIntersectionVisibilityOptions, "rootMargin" | "threshold">,
  callback: ObserverCallback,
) {
  const { key, state } = getObserverState(options);

  state.callbacks.set(element, callback);
  state.observer.observe(element);

  return () => {
    state.callbacks.delete(element);
    state.observer.unobserve(element);

    if (state.callbacks.size === 0) {
      state.observer.disconnect();
      observerStates.delete(key);
    }
  };
}

export function useIntersectionVisibility<T extends Element>({
  disabled = false,
  once = true,
  rootMargin = "0px",
  threshold = 0,
}: UseIntersectionVisibilityOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const element = ref.current;
    if (!element) return;
    if (once && isVisible) return;

    let stopObserving = () => {};

    stopObserving = observeElement(
      element,
      { rootMargin, threshold },
      (entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            stopObserving();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
    );

    return stopObserving;
  }, [disabled, isVisible, once, rootMargin, threshold]);

  return { isVisible, ref };
}
