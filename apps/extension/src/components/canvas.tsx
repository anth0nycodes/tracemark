import { useEffect, useRef, type RefObject } from "react";
import { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import { EraserBrush } from "@erase2d/fabric";
import {
  ActiveSelection,
  Circle,
  Color,
  Group,
  IText,
  PencilBrush,
  Point,
  Polyline,
  Rect,
  Textbox,
  Triangle,
  type FabricObject,
  type TPointerEvent,
  type TPointerEventInfo,
  type XY,
} from "fabric";
import type { ToolbarStates } from "@/App";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import { useShadowContainer } from "@/context/shadow-dom/use-shadow-container";
import { useColor } from "@/context/toolbar/color/use-color";
import { useEraserPopover } from "@/context/toolbar/eraser-popover/use-eraser-popover";
import { useFramePopover } from "@/context/toolbar/frame/use-frame-popover";
import { useHighlighterPopover } from "@/context/toolbar/highlighter-popover/use-highlighter-popover";
import type { LineStyle } from "@/context/toolbar/line-popover/constants";
import { useLinePopover } from "@/context/toolbar/line-popover/use-line-popover";
import { usePencilPopover } from "@/context/toolbar/pencil-popover/use-pencil-popover";
import { useTextPopover } from "@/context/toolbar/text-popover/use-text-popover";
import { getCanvasCoordinates } from "@/lib/helpers";

const HIGHLIGHTER_ALPHA = 0.4;
const CANVAS_LAG_WARNING_HEIGHT = 16250;
const CANVAS_HEIGHT_INCREMENT_AMOUNT = 500;
const LINE_STROKE_WIDTH = 4;
const TEXTBOX_DEFAULT_WIDTH = 500;
const ARROW_HEAD_LENGTH = 16;
// Angle between the shaft and each wing of the arrowhead (30deg)
const ARROW_HEAD_ANGLE = Math.PI / 6;
let hasAlertedLagWarning = false;

// The two wing endpoints of an arrowhead whose tip sits at `tip`, pointing
// away from `tail`
function getArrowHeadWings(tip: XY, tail: XY): [XY, XY] {
  const shaftAngle = Math.atan2(tip.y - tail.y, tip.x - tail.x);
  // Cap the head at half the shaft so short arrows don't turn into a blob
  const headLength = Math.min(
    ARROW_HEAD_LENGTH,
    Math.hypot(tip.x - tail.x, tip.y - tail.y) / 2
  );
  const wingAt = (angleOffset: number) => ({
    x: tip.x - headLength * Math.cos(shaftAngle + angleOffset),
    y: tip.y - headLength * Math.sin(shaftAngle + angleOffset),
  });
  return [wingAt(ARROW_HEAD_ANGLE), wingAt(-ARROW_HEAD_ANGLE)];
}

// Arrowheads are drawn by retracing the polyline out to each wing and back to
// the tip, so every style stays a single Polyline object
function getLinePoints(lineStyle: LineStyle, start: XY, end: XY): XY[] {
  if (lineStyle === "Line") return [start, end];

  const [endWingA, endWingB] = getArrowHeadWings(end, start);
  if (lineStyle === "Arrow") return [start, end, endWingA, end, endWingB];

  const [startWingA, startWingB] = getArrowHeadWings(start, end);
  return [startWingA, start, startWingB, start, end, endWingA, end, endWingB];
}

function alertLagWarning() {
  alert(
    "You’ve reached a very long part of this page. You can keep drawing, but it may start to feel laggy."
  );
  hasAlertedLagWarning = true;
}

function initializeCanvasDimensions(fc: FabricCanvas) {
  const currentCanvasHeight = fc.getHeight();
  const contentWidth = Math.max(
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
  const contentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );
  const { scrollY, innerHeight: viewportHeight } = window;
  const heightUpUntilViewportBottom = viewportHeight + scrollY;

  if (contentHeight > CANVAS_LAG_WARNING_HEIGHT) {
    fc.setDimensions({
      width: contentWidth,
      height: Math.min(heightUpUntilViewportBottom, contentHeight),
    });

    if (
      currentCanvasHeight >= CANVAS_LAG_WARNING_HEIGHT &&
      !hasAlertedLagWarning
    ) {
      alertLagWarning();
    }
    return;
  }

  fc.setDimensions({
    width: contentWidth,
    height: Math.min(heightUpUntilViewportBottom, contentHeight),
  });
}

function updateDynamicCanvasHeight(fc: FabricCanvas) {
  const { scrollY, innerHeight: viewportHeight } = window;
  const currentCanvasHeight = fc.getHeight();
  let updatedCanvasHeight = currentCanvasHeight;

  const heightUpUntilViewportBottom = viewportHeight + scrollY;

  const contentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );

  if (
    currentCanvasHeight >= CANVAS_LAG_WARNING_HEIGHT &&
    !hasAlertedLagWarning
  ) {
    alertLagWarning();
  }

  while (
    updatedCanvasHeight < heightUpUntilViewportBottom &&
    heightUpUntilViewportBottom <= contentHeight
  ) {
    updatedCanvasHeight += CANVAS_HEIGHT_INCREMENT_AMOUNT;
  }

  if (updatedCanvasHeight > currentCanvasHeight) {
    fc.setDimensions({
      height: Math.min(
        Math.max(updatedCanvasHeight, heightUpUntilViewportBottom),
        contentHeight
      ),
    });
  }
}

function trackCanvasInteraction(
  fc: FabricCanvas,
  isUsingToolRef: RefObject<boolean>
) {
  const handleMouseDown = () => {
    isUsingToolRef.current = true;
  };
  const handleMouseUp = () => {
    isUsingToolRef.current = false;
  };

  fc.on({ "mouse:down": handleMouseDown, "mouse:up": handleMouseUp });

  return () => {
    fc.off({ "mouse:down": handleMouseDown, "mouse:up": handleMouseUp });
  };
}

interface CanvasProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
  isUsingToolRef: RefObject<boolean>;
  isHidden: boolean;
}

export function Canvas({
  currentTool,
  setCurrentTool,
  isUsingToolRef,
  isHidden,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { fcRef, setFc } = useFabricCanvas();
  const { color } = useColor();
  const { pencilWidth } = usePencilPopover();
  const { highlighterWidth } = useHighlighterPopover();
  const { eraserWidth } = useEraserPopover();
  const { textAlignment } = useTextPopover();
  const { frame } = useFramePopover();
  const { lineStyle } = useLinePopover();
  const shadowContainer = useShadowContainer();
  // Cloned selection from the last Cmd/Ctrl+C, kept in memory (same tab only)
  const clipboardRef = useRef<FabricObject | null>(null);
  // Last pointer position in client (viewport) coords, null when off-canvas
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  // Sets up fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    console.log("Canvas initialized"); // here to test any rerenders

    const canvas = canvasRef.current;
    const fc = new FabricCanvas(canvas, {
      enableRetinaScaling: true, // Let Fabric handle DPR automatically
    });
    setFc(fc);

    // Make all created paths erasable
    fc.on("object:added", (e) => {
      if (e.target) {
        e.target.set({ erasable: true });
      }
    });

    // Set initial dimensions
    initializeCanvasDimensions(fc);

    // Re-initialize dimensions on resize
    const handleResizeDimensions = () => initializeCanvasDimensions(fc);

    // Update height of canvas on scroll
    const handleScroll = () => updateDynamicCanvasHeight(fc);

    let resizeTimeoutId: ReturnType<typeof setTimeout>;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(handleResizeDimensions, 50);
    });

    resizeObserver.observe(document.body);
    resizeObserver.observe(document.documentElement);
    window.addEventListener("scroll", handleScroll);

    // Track the pointer for paste-at-cursor. Store client coords rather than
    // canvas coords so scrolling after the last move is accounted for at
    // paste time. Plain DOM events instead of fabric's mouse:out, which also
    // fires whenever the hover moves off an object.
    const pointerTarget = fc.upperCanvasEl;
    const handlePointerMove = (e: PointerEvent) => {
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const handlePointerLeave = () => {
      lastPointerRef.current = null;
    };
    pointerTarget.addEventListener("pointermove", handlePointerMove);
    pointerTarget.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      pointerTarget.removeEventListener("pointermove", handlePointerMove);
      pointerTarget.removeEventListener("pointerleave", handlePointerLeave);
      fc.dispose();
      clearTimeout(resizeTimeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setFc]);

  // Canvas keyboard shortcuts.
  useEffect(() => {
    const fc = fcRef.current;
    if (!fc || isHidden) return;

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

    const handleUndoAndRedo = (e: KeyboardEvent) => {
      if (isUsingToolRef.current) return;
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
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "z" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        fc.undo();
      }

      // redo
      if (macRedoShortcut || windowsOrLinuxRedoShortcut) {
        e.preventDefault();
        fc.redo();
      }
    };

    const handleGroupObjects = (e: KeyboardEvent) => {
      const activeObjects = fc.getActiveObjects();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
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

    const handleCopyAndPaste = async (e: KeyboardEvent) => {
      // Keys aimed at a page input belong to the page, not the canvas
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isMod = (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey;
      const key = e.key.toLowerCase();
      if (!isMod || (key !== "c" && key !== "v")) return;
      if (currentTool === "Interact" || isUsingToolRef.current) return;

      // Leave native copy/paste alone while typing in a textbox
      const activeObjects = fc.getActiveObjects();
      for (const object of activeObjects) {
        if (object instanceof IText && object.isEditing) return;
      }

      if (key === "c") {
        const activeObject = fc.getActiveObject();
        // Nothing selected -> let the browser copy page text as usual
        if (!activeObject) return;
        e.preventDefault();
        clipboardRef.current = await activeObject.clone();
        return;
      }

      const clipboard = clipboardRef.current;
      if (!clipboard) return;
      e.preventDefault();

      // Clone again so every paste is independent of the stored copy
      const pasted = await clipboard.clone();

      // Paste under the cursor, or the middle of the viewport if the cursor
      // hasn't moved over the canvas yet / has left it
      const canvasRect = fc.upperCanvasEl.getBoundingClientRect();
      const client = lastPointerRef.current ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      const target = new Point(
        client.x - canvasRect.left,
        client.y - canvasRect.top
      );
      // Centering the whole unit keeps the objects' layout relative to each
      // other; only the anchor moves
      pasted.setPositionByOrigin(target, "center", "center");

      // A multi-selection's children are positioned relative to it;
      // removeAll() bakes them back to absolute canvas coords
      const objects =
        pasted instanceof ActiveSelection ? pasted.removeAll() : [pasted];

      // Same trick as the Frame/Line tools: add while excluded from export so
      // each object:added skips history, then record one entry for the batch
      for (const object of objects) object.set({ excludeFromExport: true });
      fc.discardActiveObject();
      fc.add(...objects);
      for (const object of objects) object.set({ excludeFromExport: false });

      const selection =
        pasted instanceof ActiveSelection
          ? new ActiveSelection(objects, { canvas: fc })
          : pasted;
      fc.setActiveObject(selection);
      fc.fire("object:modified", { target: selection });
      fc.requestRenderAll();
      // Pasted objects come in selected, so hand off to the Select tool
      // instead of leaving handles showing under a drawing tool
      setCurrentTool("Select");
    };

    window.addEventListener("keydown", handleDeleteObject);
    window.addEventListener("keydown", handleUndoAndRedo);
    window.addEventListener("keydown", handleGroupObjects);
    window.addEventListener("keydown", handleCopyAndPaste);

    return () => {
      window.removeEventListener("keydown", handleDeleteObject);
      window.removeEventListener("keydown", handleUndoAndRedo);
      window.removeEventListener("keydown", handleGroupObjects);
      window.removeEventListener("keydown", handleCopyAndPaste);
    };
  }, [fcRef, isUsingToolRef, isHidden, currentTool, setCurrentTool]);

  // Handle active tool logic
  useEffect(() => {
    const fc = fcRef.current;
    if (!fc) return;
    fc.skipTargetFind = currentTool !== "Select";
    fc.selection = currentTool === "Select";

    // Hidden counts as pass-through too: the shadow container spans the whole
    // page, so it would still swallow clicks even with its contents hidden
    const shouldPassThrough = currentTool === "Interact" || isHidden;
    const passThrough = shouldPassThrough ? "none" : "";
    if (containerRef.current) {
      containerRef.current.style.pointerEvents = shouldPassThrough
        ? "none"
        : "auto";
    }
    const layers = [
      shadowContainer,
      fc.wrapperEl,
      fc.upperCanvasEl,
      fc.lowerCanvasEl,
    ];
    for (const el of layers) {
      if (el) el.style.pointerEvents = passThrough;
    }

    // Skip tool setup while hidden; it re-runs on show with the same tool
    if (isHidden) return;

    switch (currentTool) {
      case "Interact": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        break;
      }
      case "Pencil": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const pencil = new PencilBrush(fc);
        fc.freeDrawingBrush = pencil;
        fc.isDrawingMode = true;
        pencil.width = pencilWidth;
        pencil.color = color;

        return trackCanvasInteraction(fc, isUsingToolRef);
      }
      case "Highlighter": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const highlighter = new PencilBrush(fc);
        fc.freeDrawingBrush = highlighter;
        fc.isDrawingMode = true;
        highlighter.width = highlighterWidth;
        // Same brush as the pencil, just translucent so the page shows through
        highlighter.color = new Color(color)
          .setAlpha(HIGHLIGHTER_ALPHA)
          .toRgba();

        return trackCanvasInteraction(fc, isUsingToolRef);
      }
      case "Erase": {
        fc.discardActiveObject();
        fc.requestRenderAll();
        const eraser = new EraserBrush(fc);
        eraser.width = eraserWidth;
        fc.setEraserBrush(eraser);
        fc.isDrawingMode = true;

        return trackCanvasInteraction(fc, isUsingToolRef);
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
          // Textbox (an IText subclass) wraps at a fixed width, so it can be
          // resized from the side handles and alignment has room to show
          const textObject = new Textbox("", {
            left: x,
            top: y,
            width: TEXTBOX_DEFAULT_WIDTH,
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
          isUsingToolRef.current = true;
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
          isUsingToolRef.current = false;
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
        let startPoint: XY;

        const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
          isUsingToolRef.current = true;
          startPoint = getCanvasCoordinates(fc, e.e);

          lineObject = new Polyline(
            getLinePoints(lineStyle, startPoint, startPoint),
            {
              stroke: color,
              strokeWidth: LINE_STROKE_WIDTH,
              // round joins keep the arrowhead tip clean where the polyline
              // doubles back on itself
              strokeLineJoin: "round",
              strokeLineCap: "round",
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
          if (!lineObject) return;
          const endPoint = getCanvasCoordinates(fc, e.e);

          lineObject.set({
            points: getLinePoints(lineStyle, startPoint, endPoint),
          });
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
          isUsingToolRef.current = false;
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
        return trackCanvasInteraction(fc, isUsingToolRef);
      }
    }
  }, [
    fcRef,
    currentTool,
    color,
    pencilWidth,
    highlighterWidth,
    eraserWidth,
    textAlignment,
    frame,
    lineStyle,
    setCurrentTool,
    shadowContainer,
    isUsingToolRef,
    isHidden,
  ]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
