"use client";

import { useEffect, useRef } from "react";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileOptions = {
  sitekey: string;
  language?: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptLoad: Promise<TurnstileApi> | null = null;

/** Loads Cloudflare's script once per page and resolves with its API. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  if (!scriptLoad) {
    scriptLoad = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.turnstile) resolve(window.turnstile);
        else reject(new Error("Turnstile loaded without exposing its API"));
      };
      script.onerror = () => {
        scriptLoad = null;
        reject(new Error("Turnstile script could not be loaded"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptLoad;
}

type Props = {
  siteKey: string;
  /** Increase to throw away the current token and ask for a fresh one. */
  resetCount: number;
  /** Called with a token when the check passes, and with null when it is lost. */
  onToken: (token: string | null) => void;
  /** Called when the check cannot run at all (script blocked, widget error). */
  onError: () => void;
};

export default function Turnstile({ siteKey, resetCount, onToken, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          language: "sv",
          theme: "light",
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => {
            onTokenRef.current(null);
            onErrorRef.current();
          },
          "expired-callback": () => onTokenRef.current(null),
          "timeout-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current();
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetCount > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetCount]);

  return <div ref={containerRef} className="turnstile" />;
}
