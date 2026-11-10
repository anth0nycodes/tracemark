"use client";

import { useSyncExternalStore } from "react";

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform: string };
};

// The platform never changes during a visit, so there's nothing to subscribe to
function subscribe() {
  return () => {};
}

function getIsMac() {
  const { userAgentData, userAgent } = navigator as NavigatorWithUserAgentData;
  return /mac|iphone|ipad/i.test(userAgentData?.platform ?? userAgent);
}

// The server can't know the OS, so it renders the non-Mac keys. React swaps
// in the client value right after hydration without a mismatch.
export function useIsMac() {
  return useSyncExternalStore(subscribe, getIsMac, () => false);
}
