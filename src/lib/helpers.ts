declare global {
  interface NavigatorUA {
    getHighEntropyValues(platforms: string[]): Promise<{ platform: string }>;
  }

  interface Navigator {
    userAgentData?: NavigatorUA;
  }
}

export async function getOS() {
  // Grab browser OS with userAgentData
  if (navigator.userAgentData) {
    const ua = await navigator.userAgentData.getHighEntropyValues(["platform"]);
    return ua.platform;
  }

  // Fallback for browsers that don't yet support userAgentData
  const ua = window.navigator.userAgent.toLowerCase();

  if (ua.includes("win")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";

  return "Unknown";
}
