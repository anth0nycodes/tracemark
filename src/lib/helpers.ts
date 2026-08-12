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

/**
 * Resolves the operating system the browser is running on, used to label
 * OS-specific shortcuts (⌘C vs Ctrl+C).
 *
 * @returns The OS name — typically `"Windows"`, `"macOS"` or `"Linux"`, or
 * `"Unknown"` when the user agent can't be matched.
 */
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

/**
 * Maps a pointer event to its position on the canvas.
 *
 * @param fc - The Fabric canvas the event fired on.
 * @param e - The originating pointer event.
 * @returns The event's `x`/`y` in canvas viewport space.
 */
export function getCanvasCoordinates(fc: FabricCanvas, e: TPointerEvent) {
  const { x, y } = fc.getViewportPoint(e);
  return { x, y };
}

/**
 * Normalizes a caught value into a printable message.
 *
 * @remarks
 * Anything can be thrown in JavaScript, not just `Error`, so `catch` bindings
 * arrive as `unknown` and can't be read directly.
 *
 * @param error - The caught value.
 * @returns `error.message` for `Error`s, otherwise the value stringified.
 */
export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Waits until the browser has painted.
 *
 * @remarks
 * A single `requestAnimationFrame` callback still runs *before* the upcoming
 * paint, so two are chained to guarantee pending style changes are on screen
 * before continuing.
 *
 * @returns A promise that resolves after the next paint.
 */
function nextPaint() {
  return new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

/**
 * Screenshots the visible tab with the extension's own UI kept out of frame.
 *
 * @remarks
 * Hides the toolbar and any open popover, drops the active selection so its
 * handles aren't baked into the image, waits for the paint, then asks the
 * background worker to capture. Hidden elements are always restored, including
 * when the capture fails.
 *
 * @param fcRef - Ref to the Fabric canvas.
 * @param toolbarRef - Ref to the toolbar root, also used to find the popovers
 * to hide.
 * @returns A PNG data URL, or `undefined` if the canvas or toolbar isn't
 * mounted or the capture failed.
 */
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

/**
 * Copies the current canvas to the clipboard as a PNG.
 *
 * @param fcRef - Ref to the Fabric canvas.
 * @param toolbarRef - Ref to the toolbar root, hidden during the capture.
 * @returns Whether the image actually reached the clipboard. The write fails
 * when the document isn't focused, so the toolbar uses this to decide whether
 * to show its confirmation.
 */
export async function handleCopyToClipboard(
  fcRef: RefObject<FabricCanvas | null>,
  toolbarRef: RefObject<HTMLDivElement | null>
) {
  try {
    const dataUrl = await captureActiveTab(fcRef, toolbarRef);
    if (!dataUrl) return false;
    const blob = await (await fetch(dataUrl)).blob();
    const item = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error copying to clipboard:", errorMessage);
    return false;
  }
}

/**
 * Downloads the current canvas as `tracemark-canvas.png`.
 *
 * @param fcRef - Ref to the Fabric canvas.
 * @param toolbarRef - Ref to the toolbar root, hidden during the capture.
 * @returns Whether the download was triggered.
 */
export async function handleExportAsPNG(
  fcRef: RefObject<FabricCanvas | null>,
  toolbarRef: RefObject<HTMLDivElement | null>
) {
  try {
    const dataUrl = await captureActiveTab(fcRef, toolbarRef);
    if (!dataUrl) return false;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "tracemark-canvas.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Error exporting as PNG:", errorMessage);
    return false;
  }
}

/**
 * Removes every object from the canvas.
 *
 * @remarks
 * Uses the history-aware `clearCanvas()` rather than Fabric's `clear()`, so the
 * cleared state is recorded and the wipe stays undoable.
 *
 * @param fcRef - Ref to the Fabric canvas.
 * @returns Whether there was a mounted canvas to clear.
 */
export function handleClearCanvas(fcRef: RefObject<FabricCanvas | null>) {
  const fc = fcRef.current;
  if (!fc) return false;
  fc.clearCanvas();
  return true;
}
