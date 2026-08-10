import type { RefObject } from "react";
import type { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { browser } from "#imports";
import type { TPointerEvent } from "fabric";

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

export function clamp(value: number, min: number, max: number) {
  if (min > max) {
    throw new Error(
      `Invalid clamp range: min (${min}) cannot be greater than max (${max})`
    );
  }
  return Math.max(min, Math.min(value, max));
}

export function getCanvasCoordinates(fc: FabricCanvas, e: TPointerEvent) {
  const { x, y } = fc.getViewportPoint(e);
  return { x, y };
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function nextPaint() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

async function captureActiveTab(
  fcRef: RefObject<FabricCanvas | null>,
  toolbarRef: RefObject<HTMLDivElement | null>
) {
  const fc = fcRef.current;
  const toolbar = toolbarRef.current;
  if (!fc || !toolbar) return;

  const elementsToHide: HTMLDivElement[] = [];
  elementsToHide.push(toolbar);
  const root = toolbar.getRootNode();
  if (root instanceof ShadowRoot || root instanceof Document) {
    elementsToHide.push(
      ...root.querySelectorAll<HTMLDivElement>('[data-slot="popover-content"]')
    );
  }
  elementsToHide.forEach((el) => (el.style.display = "none"));
  fc.discardActiveObject();
  fc.requestRenderAll();

  // wait for the next paint to ensure that the toolbar and popover content are hidden before capturing the tab
  await nextPaint();

  try {
    const dataUrl: string = await browser.runtime.sendMessage({
      type: "CAPTURE_VISIBLE_TAB",
    });
    return dataUrl;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error capturing active tab:", errorMessage);
  } finally {
    elementsToHide.forEach((el) => (el.style.display = ""));
  }
}

export async function handleCopyToClipboard(
  fcRef: RefObject<FabricCanvas | null>,
  toolbarRef: RefObject<HTMLDivElement | null>
) {
  try {
    const dataUrl = await captureActiveTab(fcRef, toolbarRef);
    if (!dataUrl) return;
    const blob = await (await fetch(dataUrl)).blob();
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error copying to clipboard:", errorMessage);
  }
}

export async function handleExportAsPNG(
  fcRef: RefObject<FabricCanvas | null>,
  toolbarRef: RefObject<HTMLDivElement | null>
) {
  try {
    const dataUrl = await captureActiveTab(fcRef, toolbarRef);
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "tracemark-canvas.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error exporting as PNG:", errorMessage);
  }
}

export function handleClearCanvas(fcRef: RefObject<FabricCanvas | null>) {
  const fc = fcRef.current;
  if (!fc) return;
  fc.clearCanvas();
}
