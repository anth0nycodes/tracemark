import { useEffect, useRef } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import {
  Group,
  IText,
  PencilBrush,
  type TPointerEvent,
  type TPointerEventInfo,
} from "fabric";
import type { ToolbarStates } from "@/App";
import { useColor } from "@/context/color/use-color";
import { useEraserPopover } from "@/context/eraser-popover/use-eraser-popover";
import { usePencilPopover } from "@/context/pencil-popover/use-pencil-popover";
import { useTextPopover } from "@/context/text-popover/use-text-popover";
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
  const { textAlignment } = useTextPopover();
  const colorRef = useRef(color);
  const pencilWidthRef = useRef(pencilWidth);
  const eraserWidthRef = useRef(eraserWidth);
  const textAlignmentRef = useRef(textAlignment);

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

    // Make all created paths erasable
    fc.on("object:added", (e) => {
      if (e.target) {
        e.target.set({ erasable: true });
      }
    });

    const handleDeleteObject = (e: KeyboardEvent) => {
      const activeObjects = fc.getActiveObjects();
      for (const object of activeObjects) {
        // skip deletion if currently editing a textbox
        if (object instanceof IText && object.isEditing) {
          return;
        }
      }
      if (activeObjects.length > 0) {
        if (e.key === "Backspace") {
          fc.remove(...activeObjects);
          fc.discardActiveObject();
          fc.requestRenderAll();
        }
      }
    };

    const handleUndoAndRedo = async (e: KeyboardEvent) => {
      const os = await getOS();
      const isMac = os === "macOS";
      const mod = isMac ? e.metaKey : e.ctrlKey;
      const macRedoShortcut =
        e.metaKey && e.shiftKey && e.key.toLowerCase() === "z";
      const windowsOrLinuxRedoShortcut =
        e.ctrlKey && e.key.toLowerCase() === "y";
      const activeObjects = fc.getActiveObjects();

      for (const object of activeObjects) {
        // skip undo/redo if currently editing a textbox
        if (object instanceof IText && object.isEditing) {
          return;
        }
      }

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
    };

    const handleGroupObjects = (e: KeyboardEvent) => {
      const activeObjects = fc.getActiveObjects();
      if (e.shiftKey && e.key.toLowerCase() === "g") {
        const activeObjectsClone = [...activeObjects];
        const isGroupable = activeObjectsClone.length > 1;

        if (isGroupable) {
          activeObjects.forEach((obj) => fc.remove(obj));
          const group = new Group(activeObjectsClone);
          fc.add(group);
          fc.setActiveObject(group);
        }
      }
    };

    window.addEventListener("resize", initCanvasDimensions);
    window.addEventListener("keydown", handleDeleteObject);
    window.addEventListener("keydown", handleUndoAndRedo);
    window.addEventListener("keydown", handleGroupObjects);

    return () => {
      fc.dispose();
      window.removeEventListener("resize", initCanvasDimensions);
      window.removeEventListener("keydown", handleDeleteObject);
      window.removeEventListener("keydown", handleUndoAndRedo);
      window.removeEventListener("keydown", handleGroupObjects);
    };
  }, []);

  // Handle active tool logic
  useEffect(() => {
    const fc = fcRef.current;
    if (!fc) return;

    colorRef.current = color;
    pencilWidthRef.current = pencilWidth;
    eraserWidthRef.current = eraserWidth;
    textAlignmentRef.current = textAlignment;

    switch (currentTool) {
      case "Pencil": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const pencil = new PencilBrush(fc);
        fc.freeDrawingBrush = pencil;
        fc.isDrawingMode = true;
        pencil.width = pencilWidthRef.current;
        pencil.color = colorRef.current;
        break;
      }
      case "Erase": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const eraser = new EraserBrush(fc);
        eraser.width = eraserWidthRef.current;
        fc.setEraserBrush(eraser);
        fc.isDrawingMode = true;
        break;
      }
      case "Text": {
        fc.isDrawingMode = false;
        const activeObject = fc.getActiveObject();
        const activeObjects = fc.getActiveObjects();
        // TODO: each text object should have its own text alignment state (reference excalidraw)

        if (!(activeObject instanceof IText)) {
          fc.discardActiveObject();
          fc.requestRenderAll();
        }

        for (const object of activeObjects) {
          if (object instanceof IText) {
            object.set({ textAlign: textAlignmentRef.current });
            fc.requestRenderAll();
          }
        }

        const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
          const activeObject = fc.getActiveObject();

          // prevent creating a new text object if the user is currently editing an existing one
          if (activeObject instanceof IText && activeObject.isEditing) return;

          const { x, y } = getCanvasCoordinates(fc, e.e);
          const textObject = new IText("", {
            left: x,
            top: y,
            fontFamily: "Arial",
            fill: colorRef.current,
            hasControls: false,
            textAlign: textAlignmentRef.current,
            excludeFromExport: true,
          });

          textObject.on("editing:exited", () => {
            fc.off({ "mouse:down": handleMouseDown });
            if (textObject.text.trim() === "") {
              fc.remove(textObject);
              fc.requestRenderAll();
              setCurrentTool("Select");
              return;
            }

            textObject.set({ hasControls: true, excludeFromExport: false });

            // we use requestAnimationFrame here because Fabric internally clears the active object AFTER the editing:exited event is fired, so without it, it wouldn't actually set the text to be the active object because it would be cleared immediately
            requestAnimationFrame(() => {
              fc.setActiveObject(textObject);
            });
            setCurrentTool("Select");
          });

          fc.add(textObject);
          fc.setActiveObject(textObject);

          // we use requestAnimationFrame here to defer enterEditing until after the canvas has fully processed the newly added object, otherwise the cursor won't blink
          requestAnimationFrame(() => {
            textObject.enterEditing();
          });
        };

        fc.on({ "mouse:down": handleMouseDown });

        return () => {
          fc.off({ "mouse:down": handleMouseDown });
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
        // defaults to select tool
        fc.isDrawingMode = false;
      }
    }
  }, [
    currentTool,
    color,
    pencilWidth,
    eraserWidth,
    textAlignment,
    setCurrentTool,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    />
  );
}
