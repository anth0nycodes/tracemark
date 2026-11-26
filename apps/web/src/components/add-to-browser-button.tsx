"use client";

import { useSyncExternalStore } from "react";
import { CHROME_STORE_URL, FIREFOX_ADDONS_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AddToBrowserButtonProps = {
  className?: string;
};

// The user agent never changes during a visit, so there's nothing to subscribe to.
function subscribeToNothing() {
  return () => {};
}

function getIsFirefox() {
  return navigator.userAgent.includes("Firefox/");
}

// The server can't see the browser, so it renders Chrome; Firefox visitors
// switch over right after hydration.
function getServerIsFirefox() {
  return false;
}

// A link styled as a button: it navigates to the store for the visitor's browser.
export function AddToBrowserButton({ className }: AddToBrowserButtonProps) {
  const isFirefox = useSyncExternalStore(
    subscribeToNothing,
    getIsFirefox,
    getServerIsFirefox
  );

  return (
    <a
      href={isFirefox ? FIREFOX_ADDONS_URL : CHROME_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-secondary bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-base whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
    >
      {isFirefox ? "Add to Firefox" : "Add to Chrome"}
    </a>
  );
}
