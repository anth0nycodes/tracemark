import { useEffect, useRef } from "react";
import { EraserBrush } from "@erase2d/fabric";
import { PencilBrush } from "fabric";
import type { ToolbarStates } from "@/App";
import { CanvasWithHistory as FabricCanvas } from "@/history-canvas/history";
import { getOS } from "@/lib/helpers";

function setupCanvas(fc: FabricCanvas) {
  // Get the full document dimensions
  const contentWidth = Math.max(
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
  const contentHeight = Math.max(
    document.documentElement.clientHeight,
    document.body.clientHeight
  );

  fc.setDimensions({
    width: contentWidth,
    height: contentHeight,
  });
}

interface CanvasProps {
  currentTool: ToolbarStates;
}

export function Canvas({ currentTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fcRef = useRef<FabricCanvas | null>(null);

  // Sets up fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Canvas initialized"); // here to test any rerenders

    const canvas = canvasRef.current;
    const fc = new FabricCanvas(canvas, {
      enableRetinaScaling: true, // Let Fabric handle DPR automatically
    });

    fcRef.current = fc;

    const initCanvasDimensions = () => setupCanvas(fc);
    initCanvasDimensions();

    window.addEventListener("resize", initCanvasDimensions);

    // Make all created paths erasable
    fc.on("path:created", (e) => {
      if (e.path) {
        e.path.set({ erasable: true });
      }
    });

    return () => {
      fc.dispose();
      window.removeEventListener("resize", initCanvasDimensions);
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
        pencil.width = 15; // hardcoded for now, can dynamically set in future popover
        pencil.color = "#00FFFF"; // hardcoded for now, can dynamically set in future color picker
        break;
      }
      case "Erase": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const eraser = new EraserBrush(fc);
        fc.freeDrawingBrush = eraser;
        fc.isDrawingMode = true;
        eraser.width = 30; // hardcoded for now, can dynamically set in future popover
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

      const canUndo = fc.canUndo();
      const canRedo = fc.canRedo();
      const macRedoShortcut =
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "z";
      const windowsOrLinuxRedoShortcut =
        e.ctrlKey && e.key.toLowerCase() === "y";

      // undo
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          fc.undo();
        }
      }

      // redo
      if (macRedoShortcut || windowsOrLinuxRedoShortcut) {
        e.preventDefault();
        if (canRedo) {
          fc.redo();
        }
      }
    }

    window.addEventListener("keydown", handleUndoAndRedo);
    return () => window.removeEventListener("keydown", handleUndoAndRedo);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    />
  );
}
