"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useId, useState } from "react";
import { useIntersectionVisibility } from "@/components/useIntersectionVisibility";

declare global {
  interface Window {
    __stp?: {
      init?: () => void;
    };
    FlodeskObject?: string;
    fd?: (
      action: string,
      options: {
        formId: string;
        containerEl: string;
      },
    ) => void;
    rsLTKLoadApp?: string;
    rsLTKPassedAppID?: string;
  }
}

type FlodeskQueueFn = ((...args: unknown[]) => void) & {
  q?: unknown[][];
};

type EmbedLoading = "eager" | "visible";

interface LazyEmbedOptions {
  loading?: EmbedLoading;
  rootMargin?: string;
}

function useSafeId(prefix: string) {
  const id = useId();
  return `${prefix}-${id.replace(/[:]/g, "")}`;
}

function useLazyEmbed({
  loading = "visible",
  rootMargin = "250px",
}: LazyEmbedOptions) {
  const { isVisible, ref } = useIntersectionVisibility<HTMLDivElement>({
    disabled: loading === "eager",
    once: true,
    rootMargin,
    threshold: 0,
  });

  return {
    ref,
    shouldRender: loading === "eager" || isVisible,
  };
}

export function ShopThePostWidget({
  widgetId,
  loading,
}: {
  widgetId: string;
  loading?: EmbedLoading;
}) {
  const { ref, shouldRender } = useLazyEmbed({ loading });
  const scriptStrategy =
    loading === "eager" ? "afterInteractive" : "lazyOnload";

  useEffect(() => {
    if (!shouldRender) return;

    window.__stp?.init?.();
  }, [shouldRender, widgetId]);

  return (
    <div ref={ref}>
      {shouldRender ? (
        <>
          <div className="shopthepost-widget" data-widget-id={widgetId}>
            <div className="rs-adblock flex min-h-[180px] items-center justify-center bg-white/50">
              <Image
                src="https://assets.rewardstyle.com/images/search/350.gif"
                alt=""
                width={15}
                height={15}
                unoptimized
              />
            </div>
          </div>
          <Script
            id={`shopthepost-init-${widgetId}`}
            strategy={scriptStrategy}
          >{`!function(d,s,id){var e,p='https';if(!d.getElementById(id)){e=d.createElement(s);e.id=id;e.src=p+'://widgets.rewardstyle.com/js/shopthepost.js';d.body.appendChild(e);}}(document,'script','shopthepost-script');`}</Script>
        </>
      ) : (
        <div className="flex min-h-[180px] items-center justify-center bg-white/50">
          <Image
            src="https://assets.rewardstyle.com/images/search/350.gif"
            alt=""
            width={15}
            height={15}
            unoptimized
          />
        </div>
      )}
    </div>
  );
}

interface LtkWidgetProps {
  appId: string;
  cols: number;
  loading?: EmbedLoading;
  rootMargin?: string;
  rows: number;
  userId: string;
  widgetInstanceId?: string;
}

export function LtkWidget({
  appId,
  cols,
  loading,
  rootMargin,
  rows,
  userId,
  widgetInstanceId,
}: LtkWidgetProps) {
  const instanceId = widgetInstanceId ?? appId;
  const containerId = `ltkwidget-version-two${instanceId}`;
  const { ref, shouldRender } = useLazyEmbed({ loading, rootMargin });

  useEffect(() => {
    if (!shouldRender) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // The LTK script looks for a <script src="...ltkwidget.js"> INSIDE the
    // widget container to derive its base URL. We must inject it there.
    const scriptSrc =
      "https://widgets-static.rewardstyle.com/widgets2_0/client/pub/ltkwidget/ltkwidget.js";

    if (container.querySelector(`script[src="${scriptSrc}"]`)) return;

    window.rsLTKLoadApp = "0";
    window.rsLTKPassedAppID = appId;

    const script = document.createElement("script");
    script.src = scriptSrc;
    container.appendChild(script);
  }, [appId, containerId, shouldRender]);

  return (
    <div ref={ref} className="min-h-[240px]">
      {shouldRender ? (
        <div
          id={containerId}
          data-appid={appId}
          className="ltkwidget-version-two"
        >
          <div
            widget-dashboard-settings=""
            data-appid={appId}
            data-userid={userId}
            data-rows={rows}
            data-cols={cols}
            data-showframe="false"
            data-padding="4"
            data-displayname=""
            data-profileid="a8c390f8-dc82-11e8-9fed-0242ac110002"
          >
            <div className="rs-ltkwidget-container">
              <div ui-view="" />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[240px] bg-white/50" />
      )}
    </div>
  );
}

export function FlodeskForm({
  formId,
  loading,
}: {
  formId: string;
  loading?: EmbedLoading;
}) {
  const containerId = useSafeId(`fd-form-${formId}`);
  const { ref, shouldRender } = useLazyEmbed({ loading });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;

    if (window.fd) {
      setReady(true);
      return;
    }

    if (document.querySelector('script[data-flodesk-loader="true"]')) return;

    window.FlodeskObject = "fd";
    let queueFn = window.fd as unknown as FlodeskQueueFn | undefined;

    if (!queueFn) {
      queueFn = (...args: unknown[]) => {
        queueFn!.q = queueFn!.q || [];
        queueFn!.q.push(args);
      };
      queueFn.q = [];
    }

    window.fd = queueFn as unknown as typeof window.fd;

    const firstScript = document.getElementsByTagName("script")[0];
    const moduleScript = document.createElement("script");
    moduleScript.async = true;
    moduleScript.type = "module";
    moduleScript.src = "https://assets.flodesk.com/universal.mjs";
    moduleScript.dataset.flodeskLoader = "true";

    const noModuleScript = document.createElement("script");
    noModuleScript.async = true;
    noModuleScript.noModule = true;
    noModuleScript.src = "https://assets.flodesk.com/universal.js";
    noModuleScript.dataset.flodeskLoader = "true";

    const handleReady = () => setReady(true);
    moduleScript.addEventListener("load", handleReady, { once: true });
    noModuleScript.addEventListener("load", handleReady, { once: true });

    firstScript?.parentNode?.insertBefore(moduleScript, firstScript);
    firstScript?.parentNode?.insertBefore(noModuleScript, firstScript);
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    if (!ready || !window.fd) return;

    window.fd("form", {
      formId,
      containerEl: `#${containerId}`,
    });
  }, [containerId, formId, ready, shouldRender]);

  return (
    <div ref={ref} className="min-h-[180px]">
      {shouldRender ? <div id={containerId} /> : null}
    </div>
  );
}

export function ElfsightFeed({
  appId,
  loading,
}: {
  appId: string;
  loading?: EmbedLoading;
}) {
  const { ref, shouldRender } = useLazyEmbed({ loading, rootMargin: "350px" });
  const scriptStrategy =
    loading === "eager" ? "afterInteractive" : "lazyOnload";

  return (
    <div ref={ref} className="min-h-[140px]">
      {shouldRender ? (
        <>
          <Script
            id="elfsight-platform"
            src="https://static.elfsight.com/platform/platform.js"
            strategy={scriptStrategy}
          />
          <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
        </>
      ) : null}
    </div>
  );
}
