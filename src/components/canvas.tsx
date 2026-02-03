import { useEffect, useRef } from "react";
import { EraserBrush } from "@erase2d/fabric";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import type { ToolbarStates } from "@/App";

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
        const pencil = new PencilBrush(fc);
        fc.freeDrawingBrush = pencil;
        fc.isDrawingMode = true;
        pencil.width = 15; // hardcoded for now, can dynamically set in future popover
        pencil.color = "#00FFFF"; // hardcoded for now, can dynamically set in future color picker
        break;
      }
      case "Erase": {
        const eraser = new EraserBrush(fc);
        fc.freeDrawingBrush = eraser;
        fc.isDrawingMode = true;
        eraser.width = 30; // hardcoded for now, can dynamically set in future popover
        break;
      }
      default:
        fc.isDrawingMode = false;
        break;
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    />
  );
}
