import { useEffect, useRef } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import {
  Group,
  PencilBrush,
  Textbox,
  type TPointerEvent,
  type TPointerEventInfo,
} from "fabric";
import type { ToolbarStates } from "@/App";
import { useColor } from "@/context/color/use-color";
import { useEraserPopover } from "@/context/eraser-popover/use-eraser-popover";
import { usePencilPopover } from "@/context/pencil-popover/use-pencil-popover";
import { getCanvasCoordinates, getOS } from "@/lib/helpers";

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
  setCurrentTool: (currentTool: ToolbarStates) => void;
}

export function Canvas({ currentTool, setCurrentTool }: CanvasProps) {
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

    const initCanvasDimensions = () => setupCanvas(fc);
    initCanvasDimensions();

    window.addEventListener("resize", initCanvasDimensions);

    // Make all created paths erasable
    fc.on("object:added", (e) => {
      if (e.target) {
        e.target.set({ erasable: true });
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
      case "Text": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = false;

        const createTextHandler = (e: TPointerEvent) => {
          const { x, y } = getCanvasCoordinates(fc, e);

          const text = new Textbox("", {
            left: x,
            top: y,
            color: color,
            fontFamily: "Arial",
          });

          fc.add(text);
          fc.setActiveObject(text);
          text.enterEditing();
        };

        const handler = (e: TPointerEventInfo<TPointerEvent>) => {
          if (e.target) return;
          createTextHandler(e.e);
        };

        fc.on({ "mouse:down": handler });

        return () => {
          fc.off({ "mouse:down": handler });
          setCurrentTool("Select"); // switch back to select tool after placing text
        };
      }
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
