type EventProperties = Record<string, string | number | boolean>;

export function trackEvent(name: string, properties?: EventProperties): void {
  try {
    const payload = JSON.stringify({
      event: name,
      properties,
      timestamp: Date.now(),
      url: window.location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", payload);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Fire-and-forget: never block the UI
  }
}
