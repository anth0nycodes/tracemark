import { useEffect, useRef } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import { Group, PencilBrush } from "fabric";
import type { ToolbarStates } from "@/App";
import { useColor } from "@/context/color/use-color";
import { useEraserPopover } from "@/context/eraser-popover/use-eraser-popover";
import { usePencilPopover } from "@/context/pencil-popover/use-pencil-popover";
import { getOS } from "@/lib/helpers";

const EXPANSION_INCREMENT_IN_PIXELS = 500;
const CANVAS_MAX_HEIGHT_IN_PIXELS = 8000; // Set a maximum height to prevent excessive canvas size

function updateCanvasWidth(fc: FabricCanvas) {
  const contentWidth = Math.max(
    document.documentElement.clientWidth,
    document.body.clientWidth
  );

  fc.setDimensions({ width: contentWidth });
}

function updateCanvasHeight(fc: FabricCanvas) {
  const contentHeight = Math.max(
    document.documentElement.clientHeight,
    document.body.clientHeight
  );

  fc.setDimensions({
    height: contentHeight,
  });
}

function updateDynamicCanvasHeight(fc: FabricCanvas) {
  const { scrollY: scrollYAmount, innerHeight: viewportHeight } = window;
  const currentCanvasHeight = fc.getHeight();
  let newCanvasHeight = currentCanvasHeight;
  const visibleBottomY = viewportHeight + scrollYAmount;

  fc.setDimensions({ height: 0 });

  const contentScrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );

  fc.setDimensions({ height: currentCanvasHeight });

  if (
    visibleBottomY >= currentCanvasHeight &&
    (currentCanvasHeight || newCanvasHeight) > CANVAS_MAX_HEIGHT_IN_PIXELS
  ) {
    alert(
      "This page is too tall for Tracemark to support. You can still draw on the visible canvas area, but it won't expand further."
    );
    fc.setDimensions({
      height: CANVAS_MAX_HEIGHT_IN_PIXELS,
    });
    // TODO: remove alert and replace with better user-facing error handling
    return;
  }

  while (
    newCanvasHeight < visibleBottomY &&
    visibleBottomY <= contentScrollHeight &&
    newCanvasHeight < CANVAS_MAX_HEIGHT_IN_PIXELS
  ) {
    newCanvasHeight += EXPANSION_INCREMENT_IN_PIXELS;
  }

  if (newCanvasHeight > currentCanvasHeight) {
    fc.setDimensions({
      height: Math.max(newCanvasHeight, viewportHeight),
    });
  }
}

interface CanvasProps {
  currentTool: ToolbarStates;
}

export function Canvas({ currentTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fcRef = useRef<FabricCanvas | null>(null);
  const { color } = useColor();
  const { pencilWidth } = usePencilPopover();
  const { eraserWidth } = useEraserPopover();

  // Sets up fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Canvas initialized"); // here to test any rerenders

    const canvas = canvasRef.current;
    const fc = new FabricCanvas(canvas, {
      enableRetinaScaling: true, // Let Fabric handle DPR automatically
    });

    fcRef.current = fc;

    const handleResize = () => {
      updateCanvasWidth(fc);
      updateCanvasHeight(fc);
    };
    handleResize(); // Initial sizing

    const handleScroll = () => {
      updateDynamicCanvasHeight(fc);
    };

    let resizeTimeout: number;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 50); // debounce to prevent rapid calls
    });

    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", handleScroll);

    // Make all created paths erasable
    fc.on("object:added", (e) => {
      if (e.target) {
        e.target.set({ erasable: true });
      }
    });

    return () => {
      fc.dispose();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle active tool logic
  useEffect(() => {
    const fc = fcRef.current;

    if (!fc) return;

    switch (currentTool) {
      case "Pencil": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const pencil = new PencilBrush(fc);
        fc.freeDrawingBrush = pencil;
        fc.isDrawingMode = true;
        pencil.width = pencilWidth;
        pencil.color = color;
        break;
      }
      case "Erase": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const eraser = new EraserBrush(fc);
        eraser.width = eraserWidth;
        fc.setEraserBrush(eraser);
        fc.isDrawingMode = true;
        break;
      }
      case "Text":
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = true;
        break;
      case "Frame":
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = true;
        break;
      case "Line":
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = true;
        break;
      default: {
        fc.isDrawingMode = false; // defaults to select tool

        const handleDeleteObject = (e: KeyboardEvent) => {
          const activeObjects = fc.getActiveObjects();

          if (activeObjects.length > 0) {
            if (e.key === "Backspace") {
              fc.remove(...activeObjects);
              fc.discardActiveObject(); // unselects active object
              fc.requestRenderAll(); // rerenders canvas to update display
            }
          }
        };

        window.addEventListener("keydown", handleDeleteObject);
        return () => {
          window.removeEventListener("keydown", handleDeleteObject);
        };
      }
    }
  });

  useEffect(() => {
    async function handleUndoAndRedo(e: KeyboardEvent) {
      const os = await getOS();
      const isMac = os === "macOS";
      const mod = isMac ? e.metaKey : e.ctrlKey;

      const fc = fcRef.current;
      if (!fc) return;

      const macRedoShortcut =
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "z";
      const windowsOrLinuxRedoShortcut =
        e.ctrlKey && e.key.toLowerCase() === "y";

      // undo
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        await fc.undo();
      }

      // redo
      if (macRedoShortcut || windowsOrLinuxRedoShortcut) {
        e.preventDefault();
        await fc.redo();
      }
    }

    async function handleGrouping(e: KeyboardEvent) {
      const fc = fcRef.current;
      if (!fc) return;

      if (e.shiftKey && e.key.toLowerCase() === "g") {
        const activeObjects = fc.getActiveObjects();
        const activeObjectsClone = [...activeObjects];
        const isGroupable = activeObjectsClone.length > 1;

        if (isGroupable) {
          activeObjects.forEach((obj) => fc.remove(obj));
          const group = new Group(activeObjectsClone);
          fc.add(group);
          fc.setActiveObject(group);
        }
      }
    }

    window.addEventListener("keydown", handleUndoAndRedo);
    window.addEventListener("keydown", handleGrouping);
    return () => {
      window.removeEventListener("keydown", handleUndoAndRedo);
      window.removeEventListener("keydown", handleGrouping);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    />
  );
}
