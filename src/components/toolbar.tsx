import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type Ref,
  type RefObject,
} from "react";
import type { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import {
  Check,
  Copy,
  Download,
  Eraser,
  Grip,
  GripHorizontal,
  GripVertical,
  Hand,
  Highlighter,
  Moon,
  MousePointer2,
  PencilLine,
  Square,
  Sun,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  domMax,
  LazyMotion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import * as m from "motion/react-m";
import type { ToolbarStates } from "@/App";
import { ColorPicker } from "@/components/color-picker";
import { Line, Text, type CustomIcon } from "@/components/custom-icons/icons";
import { EraserPopover } from "@/components/popovers/erase-popover";
import { HighlighterPopover } from "@/components/popovers/highlighter-popover";
import { PencilPopover } from "@/components/popovers/pencil-popover";
import { TextPopover } from "@/components/popovers/text-popover";
import { Button } from "@/components/ui/button";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import { useTheme } from "@/context/theme/use-theme";
import {
  getErrorMessage,
  handleClearCanvas,
  handleCopyToClipboard,
  handleExportAsPNG,
} from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { FramePopover } from "./popovers/frame-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SECONDARY_TOOLBAR_ITEM_COOLDOWN = 1250;

type Edge = "top" | "right" | "bottom" | "left";

// Gap between the toolbar and the viewport edge it's snapped to
const EDGE_GAP = 20;
// How close the dragged circle may get to the viewport edge
const DRAG_VIEWPORT_PADDING = 8;
// Cross-axis size of the bar, and the diameter of the collapsed circle:
// 36px buttons + 2 × 6px padding + 2 × 2px border
const TOOLBAR_THICKNESS = 52;
// Pointer travel before a press on the handle counts as a drag, so a plain
// click doesn't move the bar
const DRAG_START_DISTANCE = 4;
// How far the pointer must pull away from the edge (across the bar) before the
// bar collapses into a circle. Movement along the bar just slides it.
const COLLAPSE_PULL_DISTANCE = 32;
// A little bounce as the toolbar lands on its edge
const POSITION_TRANSITION: Transition = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0.15,
};
// No bounce on size: overshooting the circle's diameter would squash it into an oval
const SIZE_TRANSITION: Transition = {
  type: "spring",
  visualDuration: 0.3,
  bounce: 0,
};

// Popovers open away from the edge the toolbar sits on
const POPOVER_SIDE: Record<Edge, Edge> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};

interface Placement {
  edge: Edge;
  // Where the bar's center sits along its edge, or null to center it.
  // `length` is the bar's size along the edge, used to keep it on-screen.
  along: { center: number; length: number } | null;
}

function isVerticalEdge(edge: Edge) {
  return edge === "left" || edge === "right";
}

// clientWidth/clientHeight leave out the page's scrollbars, unlike innerWidth/innerHeight
function getViewportSize() {
  const { clientWidth, clientHeight } = document.documentElement;
  return { width: clientWidth, height: clientHeight };
}

// Keeps the collapsed circle's center far enough in that the whole circle stays visible
function clampToViewport(clientX: number, clientY: number) {
  const viewport = getViewportSize();
  const minCenter = TOOLBAR_THICKNESS / 2 + DRAG_VIEWPORT_PADDING;
  const getMaxCenter = (viewportLength: number) => viewportLength - minCenter;
  return {
    x: Math.min(Math.max(clientX, minCenter), getMaxCenter(viewport.width)),
    y: Math.min(Math.max(clientY, minCenter), getMaxCenter(viewport.height)),
  };
}

/**
 * Picks the edge the point is closest to, measured as a fraction of the
 * viewport so a wide window doesn't favor the top and bottom edges. This
 * splits the viewport into four triangles along its diagonals.
 */
function getNearestEdge(x: number, y: number): Edge {
  const viewport = getViewportSize();
  const fractionAcross = x / viewport.width;
  const fractionDown = y / viewport.height;
  const distances: [Edge, number][] = [
    ["left", fractionAcross],
    ["right", 1 - fractionAcross],
    ["top", fractionDown],
    ["bottom", 1 - fractionDown],
  ];
  return distances.reduce((nearest, current) => (current[1] < nearest[1] ? current : nearest))[0];
}

// Uses the `translate` property rather than `transform`, since Motion owns
// `transform` for the layout animation on the same element
function getPlacementStyle({ edge, along }: Placement): CSSProperties {
  const isVertical = isVerticalEdge(edge);
  let position = "50%";
  if (along) {
    // clamp() keeps a custom spot fully on-screen even if the window shrinks later
    const inset = along.length / 2 + EDGE_GAP;
    // 100% is the viewport minus scrollbars, since the anchor is position: fixed
    position = `clamp(${inset}px, ${along.center}px, calc(100% - ${inset}px))`;
  }

  const style: CSSProperties = isVertical
    ? { top: position, translate: "0 -50%" }
    : { left: position, translate: "-50% 0" };
  style[edge] = EDGE_GAP;
  return style;
}

// Keeps a bar of the given length fully on-screen along its edge.
// Mirrors the clamp() in getPlacementStyle.
function clampAlongCenter(center: number, barLength: number, viewportLength: number) {
  const minCenter = barLength / 2 + EDGE_GAP;
  const maxCenter = viewportLength - minCenter;
  return Math.min(Math.max(center, minCenter), maxCenter);
}

// Puts the collapsed circle's center on the point
function getDragTranslate(point: { x: number; y: number }) {
  return `${point.x - TOOLBAR_THICKNESS / 2}px ${point.y - TOOLBAR_THICKNESS / 2}px`;
}

interface ToolbarItemProps {
  name: ToolbarStates;
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  popover?: ReactNode;
}

const toolbarItems: ToolbarItemProps[] = [
  { name: "Interact", icon: Hand, shortcut: "i" },
  { name: "Select", icon: MousePointer2, shortcut: "v" },
  {
    name: "Pencil",
    icon: PencilLine,
    shortcut: "p",
    popover: <PencilPopover />,
  },
  {
    name: "Highlighter",
    icon: Highlighter,
    shortcut: "h",
    popover: <HighlighterPopover />,
  },
  {
    name: "Erase",
    icon: Eraser,
    shortcut: "e",
    popover: <EraserPopover />,
  },
  {
    name: "Text",
    icon: Text,
    shortcut: "t",
    popover: <TextPopover />,
  },
  { name: "Frame", icon: Square, shortcut: "f", popover: <FramePopover /> },
  { name: "Line", icon: Line, shortcut: "l" },
];

interface SecondaryToolbarItem {
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: (
    fcRef: RefObject<FabricCanvas | null>,
    toolbarRef: RefObject<HTMLDivElement | null>,
  ) => Promise<boolean> | boolean;
}

const secondaryToolbarItems: SecondaryToolbarItem[] = [
  {
    name: "Copy",
    description: "Copy canvas to clipboard",
    icon: Copy,
    onClick: handleCopyToClipboard,
  },

  {
    name: "Export",
    description: "Export canvas as PNG",
    icon: Download,
    onClick: handleExportAsPNG,
  },
  {
    name: "Clear",
    description: "Clear canvas content",
    icon: Trash2,
    onClick: handleClearCanvas,
  },
];

interface ToolbarButtonProps {
  isActive: boolean;
  item: ToolbarItemProps;
  setCurrentTool: (currentTool: ToolbarStates) => void;
  ref?: Ref<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function ToolbarButton({
  isActive,
  item,
  setCurrentTool,
  ref,
  onClick,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      {...props}
      ref={ref}
      variant="ghost"
      className={cn(
        "hover:bg-accent/50 relative flex size-full shrink-0 items-center justify-center rounded-[10px] duration-0!",
        isActive && "bg-accent hover:bg-accent dark:hover:bg-accent",
      )}
      onClick={(e) => {
        setCurrentTool(item.name);
        onClick?.(e);
      }}
      aria-label={`${item.name} (${item.shortcut.toUpperCase()})`}
      title={`${item.name} (${item.shortcut.toUpperCase()})`}
      aria-pressed={isActive}
    >
      <item.icon aria-hidden="true" className="size-4" />

      <span
        className="text-muted-foreground/60 dark:text-foreground absolute right-1 bottom-0.5 text-[9px] font-semibold capitalize"
        aria-hidden="true"
      >
        {item.shortcut}
      </span>
    </Button>
  );
}

interface ToolbarProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
  isUsingToolRef: RefObject<boolean>;
  isHidden: boolean;
  onClose: () => void;
}

export function Toolbar({
  currentTool,
  setCurrentTool,
  isUsingToolRef,
  isHidden,
  onClose,
}: ToolbarProps) {
  const [prevTool, setPrevTool] = useState(currentTool);
  const [openPopoverId, setOpenPopoverId] = useState<ToolbarStates | null>(null);
  const [cooldowns, setCooldowns] = useState<Map<string, boolean>>(new Map());
  // Also turns the toolbar's snap, collapse and expand into instant jumps
  const prefersReducedMotion = useReducedMotion();
  const { fcRef } = useFabricCanvas();
  const { theme, toggleTheme } = useTheme();
  const themeToggleLabel = theme === "light" ? "Switch to dark theme" : "Switch to light theme";
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<Placement>({
    edge: "bottom",
    along: null,
  });
  // Where the circle was when the bar collapsed; null when not collapsed.
  // Later pointer moves write straight to the DOM so the whole toolbar doesn't
  // re-render on every frame.
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  // Mutable drag bookkeeping, kept in a ref so pointer moves don't re-render.
  // pressed: handle is down but hasn't moved far enough to count as a drag
  // sliding: bar is moving along its edge, still expanded
  // collapsed: bar has been pulled off its edge and is now a circle
  const dragRef = useRef<{
    phase: "pressed" | "sliding" | "collapsed";
    startX: number;
    startY: number;
    barLength: number;
    // Bar's center along its edge when the drag began, and where it is now
    startAlongCenter: number;
    currentAlongCenter: number;
  } | null>(null);
  const isCollapsed = dragOrigin !== null;
  const isVertical = isVerticalEdge(placement.edge);
  const dividerClassName = cn("bg-muted rounded-full", isVertical ? "h-0.5 w-7" : "h-7 w-0.5");
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const startCooldown = (name: string, result: boolean) => {
    clearTimeout(timersRef.current.get(name));
    setCooldowns((prev) => new Map(prev).set(name, result));

    const timeoutId = setTimeout(() => {
      setCooldowns((prev) => {
        const next = new Map(prev);
        next.delete(name);
        return next;
      });
      timersRef.current.delete(name);
    }, SECONDARY_TOOLBAR_ITEM_COOLDOWN);

    timersRef.current.set(name, timeoutId);
  };

  function renderSecondaryIcons(item: SecondaryToolbarItem, isCopyConfirming: boolean) {
    if (item.name === "Clear") {
      return (
        <m.div
          animate={cooldowns.has("Clear") ? { rotate: [0, 15, -15, 12, -12, 8, -8, 0] } : {}}
          className="flex size-full items-center justify-center"
          transition={{ duration: 0.6 }}
        >
          <item.icon aria-hidden="true" className="text-destructive size-4" />
        </m.div>
      );
    }

    if (item.name === "Copy") {
      return (
        <AnimatePresence initial={false} mode="wait">
          <m.span
            key={cooldowns.get("Copy") === true ? "copied" : "copy"}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.1,
                    ease: "easeInOut",
                  }
            }
            className="flex size-full items-center justify-center"
          >
            {isCopyConfirming ? (
              <Check aria-hidden="true" className="text-success size-4" />
            ) : (
              <item.icon aria-hidden="true" className="size-4" />
            )}
          </m.span>
        </AnimatePresence>
      );
    }

    return <item.icon aria-hidden="true" className="size-4" />;
  }

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    // No tool/copy shortcuts while hidden, so keys go to the page untouched
    if (isHidden) return;

    const handleKeyShortcuts = async (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      const isCopyCanvasShortcut =
        e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey && e.key.toLowerCase() === "c";
      if (isCopyCanvasShortcut) {
        e.preventDefault();
        if (!timersRef.current.has("Copy")) {
          try {
            const didCopy = await handleCopyToClipboard(fcRef, toolbarRef);
            startCooldown("Copy", didCopy);
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error("Error copying to clipboard:", errorMessage);
            startCooldown("Copy", false);
          }
        }
        return;
      }

      // Ignore modified keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      const keyMap: Record<string, ToolbarStates> = {
        i: "Interact",
        v: "Select",
        p: "Pencil",
        h: "Highlighter",
        e: "Erase",
        t: "Text",
        f: "Frame",
        l: "Line",
      };

      const tool = keyMap[e.key];
      if (!tool) return;

      // Don't swap tools mid-interaction (e.g. while drawing a stroke)
      if (isUsingToolRef.current) return;

      e.preventDefault();
      setCurrentTool(tool);
    };

    window.addEventListener("keydown", handleKeyShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyShortcuts);
    };
  }, [setCurrentTool, fcRef, isUsingToolRef, isHidden]);

  if (prevTool !== currentTool) {
    setPrevTool(currentTool);
    setOpenPopoverId(null);
  }

  function handleDragHandlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    // Capture keeps move/up events coming to the handle even when the pointer
    // leaves it or the window
    event.currentTarget.setPointerCapture(event.pointerId);
    const shellRect = shellRef.current?.getBoundingClientRect();
    if (!shellRect) return;
    const alongCenter = isVertical
      ? shellRect.top + shellRect.height / 2
      : shellRect.left + shellRect.width / 2;
    dragRef.current = {
      phase: "pressed",
      startX: event.clientX,
      startY: event.clientY,
      barLength: isVertical ? shellRect.height : shellRect.width,
      startAlongCenter: alongCenter,
      currentAlongCenter: alongCenter,
    };
  }

  function handleDragHandlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    const anchor = toolbarRef.current;
    if (!drag || !anchor) return;

    const offsetX = event.clientX - drag.startX;
    const offsetY = event.clientY - drag.startY;

    if (drag.phase === "pressed") {
      if (Math.hypot(offsetX, offsetY) < DRAG_START_DISTANCE) return;
      drag.phase = "sliding";
      // Popovers are positioned once on open and wouldn't follow the bar
      setOpenPopoverId(null);
    }

    if (drag.phase === "sliding") {
      const offsetAcrossBar = Math.abs(isVertical ? offsetX : offsetY);
      if (offsetAcrossBar > COLLAPSE_PULL_DISTANCE) {
        drag.phase = "collapsed";
        setDragOrigin(clampToViewport(event.clientX, event.clientY));
        return;
      }

      const viewport = getViewportSize();
      drag.currentAlongCenter = clampAlongCenter(
        drag.startAlongCenter + (isVertical ? offsetY : offsetX),
        drag.barLength,
        isVertical ? viewport.height : viewport.width,
      );
      // Written straight to the DOM; React takes over again on release
      anchor.style[isVertical ? "top" : "left"] = `${drag.currentAlongCenter}px`;
      return;
    }

    anchor.style.translate = getDragTranslate(clampToViewport(event.clientX, event.clientY));
  }

  function handleDragHandlePointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.phase === "pressed") return;

    if (drag.phase === "sliding") {
      setPlacement({
        edge: placement.edge,
        along: { center: drag.currentAlongCenter, length: drag.barLength },
      });
      return;
    }

    const point = clampToViewport(event.clientX, event.clientY);
    const edge = getNearestEdge(point.x, point.y);
    // Moving to a new edge centers the bar; dropping on the same edge keeps it
    // where it was let go
    const along =
      edge === placement.edge
        ? {
            center: isVerticalEdge(edge) ? point.y : point.x,
            length: drag.barLength,
          }
        : null;

    setPlacement({ edge, along });
    setDragOrigin(null);
  }

  function handlePopoverOpen(isActive: boolean, toolName: ToolbarStates) {
    if (isActive) {
      // if you click on the same active tool, it toggles the popover, otherwise it opens the popover for the new active tool
      setOpenPopoverId((prev) => (prev === toolName ? null : toolName));
    }
  }

  return (
    <LazyMotion features={domMax}>
      {/*
        Anchor: pinned to an edge, or following the pointer while dragging.
        layout="position" glides it between spots without scaling the bar.
      */}
      <m.div
        ref={toolbarRef}
        layout="position"
        transition={prefersReducedMotion ? { duration: 0 } : POSITION_TRANSITION}
        style={
          dragOrigin
            ? { left: 0, top: 0, translate: getDragTranslate(dragOrigin) }
            : getPlacementStyle(placement)
        }
        className="pointer-events-auto fixed z-2147483647"
      >
        {/*
          Shell: animates its real width/height (not a scale) so the border stays
          crisp. Collapsing shrinks it along its length down to the drag handle,
          which is square and first, so it ends up centered in the circle.
        */}
        <m.div
          ref={shellRef}
          initial={false}
          animate={{
            width: isCollapsed || isVertical ? TOOLBAR_THICKNESS : "auto",
            height: isCollapsed || !isVertical ? TOOLBAR_THICKNESS : "auto",
          }}
          transition={prefersReducedMotion ? { duration: 0 } : SIZE_TRANSITION}
          className="bg-background text-foreground border-border overflow-hidden rounded-full border-2 shadow-md"
        >
          {/*
            Padding lives here, not on the shell: Motion subtracts padding when it
            converts "auto" to px, so a padded shell would animate toward the wrong size
          */}
          <div className={cn("flex items-center gap-1 p-1.5 *:shrink-0", isVertical && "flex-col")}>
            {/* Drag handle — only this grabs the bar, so buttons still click normally */}
            <button
              type="button"
              onPointerDown={handleDragHandlePointerDown}
              onPointerMove={handleDragHandlePointerMove}
              onPointerUp={handleDragHandlePointerUp}
              onPointerCancel={handleDragHandlePointerUp}
              aria-label="Drag to move toolbar"
              title="Drag to move toolbar"
              className="text-muted-foreground flex size-9 cursor-grab touch-none appearance-none items-center justify-center rounded-full border-0 bg-transparent p-0 active:cursor-grabbing"
            >
              {isCollapsed ? (
                <Grip aria-hidden="true" className="size-4" />
              ) : isVertical ? (
                <GripHorizontal aria-hidden="true" className="size-4" />
              ) : (
                <GripVertical aria-hidden="true" className="size-4" />
              )}
            </button>
            <ColorPicker />
            <div className={dividerClassName} />
            {toolbarItems.map((item) => {
              const isActive = currentTool === item.name;

              return (
                <div key={item.name} className="size-9">
                  {item.popover ? (
                    <Popover
                      // Forced closed while hidden so page clicks/Escape can't toggle it in the background
                      open={!isHidden && !isCollapsed && openPopoverId === item.name}
                      onOpenChange={() => handlePopoverOpen(isActive, item.name)}
                    >
                      <PopoverTrigger
                        render={
                          <ToolbarButton
                            isActive={isActive}
                            item={item}
                            setCurrentTool={setCurrentTool}
                          />
                        }
                      />
                      {/* Zero the enter slide from ui/popover so it only scales in place */}
                      <PopoverContent
                        // Portaled outside the hidden wrapper, so hide it directly too;
                        // display: none also skips the exit animation that would linger
                        className={cn(
                          "w-max p-1 duration-75 [--tw-enter-translate-x:0]! [--tw-enter-translate-y:0]!",
                          isHidden && "hidden",
                        )}
                        side={POPOVER_SIDE[placement.edge]}
                        sideOffset={16}
                      >
                        {item.popover}
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <ToolbarButton
                      isActive={isActive}
                      item={item}
                      setCurrentTool={setCurrentTool}
                    />
                  )}
                </div>
              );
            })}

            <div className={dividerClassName} />
            <div className={cn("flex gap-1", isVertical && "flex-col")}>
              {secondaryToolbarItems.map((item) => {
                const isCopyConfirming = item.name === "Copy" && cooldowns.get("Copy") === true;
                const label = isCopyConfirming ? "Copied canvas to clipboard" : item.description;

                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    disabled={cooldowns.has(item.name)}
                    onClick={async () => {
                      startCooldown(item.name, false);
                      const result = await item.onClick(fcRef, toolbarRef);
                      startCooldown(item.name, result);
                      setOpenPopoverId(null);
                    }}
                    className={cn(
                      "hover:bg-accent/50 relative size-9 rounded-[10px] duration-0!",
                      isCopyConfirming && "disabled:opacity-100",
                    )}
                    aria-label={label}
                    title={label}
                  >
                    {renderSecondaryIcons(item, isCopyConfirming)}
                    {item.name === "Copy" && (
                      <sub
                        className="text-muted-foreground/60 dark:text-foreground absolute right-1 bottom-1.5 text-[9px] font-semibold"
                        aria-hidden="true"
                      >
                        ⇧C
                      </sub>
                    )}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="hover:bg-accent/50 size-9 rounded-[10px] duration-0!"
                aria-label={themeToggleLabel}
                title={themeToggleLabel}
              >
                {theme === "light" ? (
                  <Sun aria-hidden="true" className="size-4" />
                ) : (
                  <Moon aria-hidden="true" className="size-4" />
                )}
              </Button>
            </div>
            <div className={dividerClassName} />
            <Button
              variant="ghost"
              onClick={onClose}
              className="hover:bg-accent/50 size-9 rounded-[10px] duration-0!"
              aria-label="Close Tracemark"
              title="Close Tracemark"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
            <span role="status" aria-live="polite" className="sr-only">
              {cooldowns.has("Copy")
                ? cooldowns.get("Copy")
                  ? "Copied canvas to clipboard"
                  : "Failed to copy canvas to clipboard"
                : ""}
            </span>
          </div>
        </m.div>
      </m.div>
    </LazyMotion>
  );
}
