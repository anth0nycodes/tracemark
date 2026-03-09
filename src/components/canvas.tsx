import { useEffect, useRef } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import { Group, PencilBrush } from "fabric";
import type { ToolbarStates } from "@/App";
import { useColor } from "@/context/color/use-color";
import { useEraserPopover } from "@/context/eraser-popover/use-eraser-popover";
import { usePencilPopover } from "@/context/pencil-popover/use-pencil-popover";
import { getOS } from "@/lib/helpers";

const EXPANSION_INCREMENT = 500;

function updateCanvasWidth(fc: FabricCanvas) {
  const contentWidth = Math.max(
    document.documentElement.clientWidth,
    document.body.clientWidth
  );

  fc.setDimensions({ width: contentWidth });
}

// TODO: fix vertical overflow caused by canvas increment logic
function updateCanvasHeight(fc: FabricCanvas) {
  const contentHeight = Math.max(
    document.documentElement.clientHeight,
    document.body.clientHeight
  );
  const viewportHeight = window.innerHeight;
  const scrollReachY = window.scrollY + viewportHeight;
  const currentHeight = fc.getHeight();
  console.log("Current canvas height:", currentHeight);

  let newHeight = currentHeight || viewportHeight;

  while (newHeight < scrollReachY) {
    newHeight += EXPANSION_INCREMENT;
  }

  if (newHeight > currentHeight) {
    fc.setDimensions({
      height: Math.max(contentHeight, newHeight),
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

    const handleScroll = () => updateCanvasHeight(fc);
    handleResize(); // Initial sizing

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
      const os = await getOS();
      const isMac = os === "macOS";
      const mod = isMac ? e.metaKey : e.ctrlKey;

      const fc = fcRef.current;
      if (!fc) return;

      if (mod && e.key.toLowerCase() === "g") {
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
    <div className="absolute top-0 left-0 z-2147483646 overflow-hidden">
      <canvas ref={canvasRef} className="pointer-events-auto" />
    </div>
  );
}
