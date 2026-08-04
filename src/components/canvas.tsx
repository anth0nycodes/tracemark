import { useEffect, useRef } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import {
  Circle,
  Group,
  IText,
  PencilBrush,
  Polyline,
  Rect,
  Triangle,
  type TPointerEvent,
  type TPointerEventInfo,
} from "fabric";
import type { ToolbarStates } from "@/App";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import { useColor } from "@/context/toolbar/color/use-color";
import { useEraserPopover } from "@/context/toolbar/eraser-popover/use-eraser-popover";
import { useFramePopover } from "@/context/toolbar/frame/use-frame-popover";
import { usePencilPopover } from "@/context/toolbar/pencil-popover/use-pencil-popover";
import { useTextPopover } from "@/context/toolbar/text-popover/use-text-popover";
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

// Flags canvas interaction on pointer down/up so undo/redo stays disabled
// mid-stroke. Returns a cleanup fn that detaches the listeners.
function trackCanvasInteraction(
  fc: FabricCanvas,
  isInteractingRef: { current: boolean }
) {
  const handleMouseDown = () => {
    isInteractingRef.current = true;
  };
  const handleMouseUp = () => {
    isInteractingRef.current = false;
  };

  fc.on({ "mouse:down": handleMouseDown, "mouse:up": handleMouseUp });

  return () => {
    fc.off({ "mouse:down": handleMouseDown, "mouse:up": handleMouseUp });
  };
}

interface CanvasProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
}

export function Canvas({ currentTool, setCurrentTool }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isInteractingWithCanvasRef = useRef(false);
  const { fcRef, setFc } = useFabricCanvas();
  const { color } = useColor();
  const { pencilWidth } = usePencilPopover();
  const { eraserWidth } = useEraserPopover();
  const { textAlignment } = useTextPopover();
  const { frame } = useFramePopover();

  // Sets up fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Canvas initialized"); // here to test any rerenders

    const canvas = canvasRef.current;
    const fc = new FabricCanvas(canvas, {
      enableRetinaScaling: true, // Let Fabric handle DPR automatically
    });
    setFc(fc);

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
      if (isInteractingWithCanvasRef.current) return;
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
  }, [setFc]);

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

        return trackCanvasInteraction(fc, isInteractingWithCanvasRef);
      }
      case "Erase": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const eraser = new EraserBrush(fc);
        eraser.width = eraserWidth;
        fc.setEraserBrush(eraser);
        fc.isDrawingMode = true;

        return trackCanvasInteraction(fc, isInteractingWithCanvasRef);
      }
      case "Text": {
        fc.isDrawingMode = false;
        const activeObjects = fc.getActiveObjects();
        for (const object of activeObjects) {
          if (!(object instanceof IText)) {
            fc.discardActiveObject();
            fc.requestRenderAll();
          }
        }

        // Fabric internally clears the active selection during mouse:down BEFORE firing the
        // user "mouse:down" event, so by the time handleMouseDown runs
        // getActiveObjects() is already empty. Capture the selection state on
        // mouse:down:before (fires first)
        let hadMultipleActiveSelection = false;
        const handleMouseDownBefore = () => {
          hadMultipleActiveSelection = fc.getActiveObjects().length > 1;
        };

        const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
          const activeObject = fc.getActiveObject();

          if (hadMultipleActiveSelection) {
            setCurrentTool("Select");
            return;
          }

          // prevent creating a new text object if the user is currently editing an existing one
          if (activeObject instanceof IText && activeObject.isEditing) return;

          const { x, y } = getCanvasCoordinates(fc, e.e);
          const textObject = new IText("", {
            left: x,
            top: y,
            fontFamily: "Arial",
            fill: color,
            hasControls: false,
            textAlign: textAlignment,
            excludeFromExport: true,
          });

          textObject.on("editing:exited", () => {
            fc.off({
              "mouse:down": handleMouseDown,
              "mouse:down:before": handleMouseDownBefore,
            });
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

        fc.on({
          "mouse:down": handleMouseDown,
          "mouse:down:before": handleMouseDownBefore,
        });

        return () => {
          fc.off({
            "mouse:down": handleMouseDown,
            "mouse:down:before": handleMouseDownBefore,
          });
        };
      }
      case "Frame": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = false;
        let startX: number;
        let startY: number;
        let frameObject: Rect | Triangle | Circle | null = null;

        const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
          fc.selection = false;
          const { x, y } = getCanvasCoordinates(fc, e.e);
          startX = x;
          startY = y;

          const frameBase = {
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            stroke: color,
            strokeWidth: 4,
            ...(frame === "Rect" ? { rx: 12, ry: 12 } : {}),
            fill: "transparent",
            excludeFromExport: true,
          };

          if (frame === "Rect") {
            frameObject = new Rect(frameBase);
          }

          if (frame === "Triangle") {
            frameObject = new Triangle(frameBase);
          }
          if (frame === "Circle") {
            frameObject = new Circle(frameBase);
          }

          if (!frameObject) return;
          fc.add(frameObject);
          isInteractingWithCanvasRef.current = true;
        };

        const handleMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
          if (!frameObject) return;
          const { x: endX, y: endY } = getCanvasCoordinates(fc, e.e);

          if (frameObject instanceof Circle) {
            // radius = diameter / 2
            // diameter is the straight line (hypotenuse) from start point to end point
            const radius = Math.hypot(endX - startX, endY - startY) / 2;
            frameObject.set({
              // Midpoint formula to offset properly
              left: (startX + endX) / 2,
              top: (startY + endY) / 2,
              radius,
            });
          } else {
            frameObject.set({
              left: (startX + endX) / 2,
              top: (startY + endY) / 2,
              // Horizontal + vertical distance traveled to get width and height
              width: Math.abs(endX - startX),
              height: Math.abs(endY - startY),
            });
          }
          fc.requestRenderAll();
        };

        const handleMouseUp = () => {
          if (!frameObject) return;
          frameObject.set({ excludeFromExport: false });
          fc.setActiveObject(frameObject);
          // The frame was added with excludeFromExport: true, so its
          // object:added never recorded a history entry. Now that it's
          // exportable, fire object:modified to give it its own entry -
          // otherwise it piggybacks onto the next action's snapshot and
          // a single undo removes both.
          fc.fire("object:modified", { target: frameObject });
          fc.requestRenderAll();
          frameObject = null;
          isInteractingWithCanvasRef.current = false;
          setCurrentTool("Select");
        };

        fc.on({
          "mouse:up": handleMouseUp,
          "mouse:down": handleMouseDown,
          "mouse:move": handleMouseMove,
        });

        return () => {
          fc.off({
            "mouse:up": handleMouseUp,
            "mouse:down": handleMouseDown,
            "mouse:move": handleMouseMove,
          });
        };
      }
      case "Line": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        fc.isDrawingMode = false;
        let lineObject: Polyline | null = null;
        let startX: number;
        let startY: number;

        const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
          isInteractingWithCanvasRef.current = true;
          fc.selection = false;
          const { x, y } = getCanvasCoordinates(fc, e.e);
          startX = x;
          startY = y;

          lineObject = new Polyline(
            [
              { x: startX, y: startY },
              { x: startX, y: startY },
            ],
            {
              stroke: color,
              strokeWidth: 4,
              fill: "transparent",
              // let Fabric derive position/bbox from points instead of
              // overriding with a manual left/top
              objectCaching: false,
              excludeFromExport: true,
            }
          );
          fc.add(lineObject);
        };

        const handleMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
          const { x: endX, y: endY } = getCanvasCoordinates(fc, e.e);
          if (!lineObject) return;

          const updatedCoordinates = [
            { x: startX, y: startY },
            { x: endX, y: endY },
          ];

          lineObject.set({ points: updatedCoordinates });
          // recompute bounding box/pathOffset after mutating points,
          // otherwise controls + hit area stay stale
          lineObject.setBoundingBox(true);
          fc.requestRenderAll();
        };

        const handleMouseUp = () => {
          if (!lineObject) return;
          fc.setActiveObject(lineObject);
          // turn caching back on so the finished line is drawn once and
          // reused, instead of being redrawn on every frame
          lineObject.set({ excludeFromExport: false, objectCaching: true });
          fc.fire("object:modified", { target: lineObject });
          isInteractingWithCanvasRef.current = false;
          fc.requestRenderAll();
          lineObject = null;
          setCurrentTool("Select");
        };

        fc.on({
          "mouse:up": handleMouseUp,
          "mouse:down": handleMouseDown,
          "mouse:move": handleMouseMove,
        });

        return () => {
          fc.off({
            "mouse:up": handleMouseUp,
            "mouse:down": handleMouseDown,
            "mouse:move": handleMouseMove,
          });
        };
      }
      default: {
        // defaults to select tool
        fc.isDrawingMode = false;
        fc.selection = true;
      }
    }
  }, [
    fcRef,
    currentTool,
    color,
    pencilWidth,
    eraserWidth,
    textAlignment,
    frame,
    setCurrentTool,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    />
  );
}
