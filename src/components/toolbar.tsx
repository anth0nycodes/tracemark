import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import type { CanvasWithHistory as FabricCanvas } from "@anth0nycodes/fabric-history";
import {
  Check,
  Copy,
  Download,
  Eraser,
  GripVertical,
  Hand,
  MousePointer2,
  PencilLine,
  Square,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import type { ToolbarStates } from "@/App";
import { ColorPicker } from "@/components/color-picker";
import { Line, type CustomIcon } from "@/components/custom-icons/icons";
import { EraserPopover } from "@/components/popovers/erase-popover";
import { PencilPopover } from "@/components/popovers/pencil-popover";
import { TextPopover } from "@/components/popovers/text-popover";
import { Button } from "@/components/ui/button";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import {
  getErrorMessage,
  getOS,
  handleClearCanvas,
  handleCopyToClipboard,
  handleExportAsPNG,
} from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { FramePopover } from "./popovers/frame-popover";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ToolbarItemProps {
  name: ToolbarStates;
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  popover?: ReactNode;
}

const toolbarItems: ToolbarItemProps[] = [
  { name: "Interact", icon: Hand, shortcut: "1" },
  { name: "Select", icon: MousePointer2, shortcut: "2" },
  {
    name: "Pencil",
    icon: PencilLine,
    shortcut: "3",
    popover: <PencilPopover />,
  },
  {
    name: "Erase",
    icon: Eraser,
    shortcut: "4",
    popover: <EraserPopover />,
  },
  {
    name: "Text",
    icon: Type,
    shortcut: "5",
    popover: <TextPopover />,
  },
  { name: "Frame", icon: Square, shortcut: "6", popover: <FramePopover /> },
  { name: "Line", icon: Line, shortcut: "7" },
];

interface SecondaryToolbarItem {
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: (
    fcRef: RefObject<FabricCanvas | null>,
    toolbarRef: RefObject<HTMLDivElement | null>
  ) => void;
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
  prefersReducedMotion: boolean | null;
  setCurrentTool: (currentTool: ToolbarStates) => void;
  ref?: Ref<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function ToolbarButton({
  isActive,
  item,
  prefersReducedMotion,
  setCurrentTool,
  ref,
  onClick,
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      {...props}
      ref={ref}
      variant={isActive ? null : "ghost"}
      className="relative flex size-full shrink-0 items-center justify-center rounded-[10px]"
      onClick={(e) => {
        setCurrentTool(item.name);
        onClick?.(e);
      }}
      aria-label={`${item.name} (${item.shortcut})`}
      title={`${item.name} (${item.shortcut})`}
      aria-pressed={isActive}
    >
      <item.icon
        aria-hidden="true"
        className={cn(
          "z-10 size-5 transition-colors",
          isActive && "text-background"
        )}
      />

      <span
        className={cn(
          "text-muted-foreground/60 dark:text-foreground absolute right-1.5 bottom-1 z-10 text-[9px] font-semibold transition-colors",
          isActive && "text-background"
        )}
        aria-hidden="true"
      >
        {item.shortcut}
      </span>

      {isActive && (
        <motion.div
          layoutId={prefersReducedMotion ? undefined : "active-toolbar-item"}
          className="bg-foreground absolute inset-0 rounded-[10px]"
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: "spring", damping: 50, stiffness: 600 }
          }
        />
      )}
    </Button>
  );
}

interface ToolbarProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
  isUsingToolRef: RefObject<boolean>;
}

export function Toolbar({
  currentTool,
  setCurrentTool,
  isUsingToolRef,
}: ToolbarProps) {
  const [prevTool, setPrevTool] = useState(currentTool);
  const [openPopoverId, setOpenPopoverId] = useState<ToolbarStates | null>(
    null
  );
  const [cooldowns, setCooldowns] = useState<ReadonlySet<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [shortcut, setShortcut] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { fcRef } = useFabricCanvas();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const dragConstraintsRef = useRef<HTMLDivElement | null>(null);
  const dragControls = useDragControls();
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const copyToClipboard = useCallback(() => {
    handleCopyToClipboard(fcRef, toolbarRef)
      .then((didCopy) => {
        if (!didCopy) return;
        clearTimeout(copiedTimerRef.current);
        setCopied(true);
        copiedTimerRef.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch((error: unknown) => {
        const errorMessage = getErrorMessage(error);
        console.error("Error copying to clipboard:", errorMessage);
      });
  }, [fcRef]);

  const startCooldown = (name: string) => {
    clearTimeout(timersRef.current.get(name));
    setCooldowns((prev) => new Set(prev).add(name));

    const timeoutId = setTimeout(() => {
      setCooldowns((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
      timersRef.current.delete(name);
    }, 1500);

    timersRef.current.set(name, timeoutId);
  };

  useEffect(() => {
    const resolveShortcut = async () => {
      const os = await getOS();
      setShortcut(os === "macOS" ? "⌘C" : "Ctrl+C");
    };
    resolveShortcut();

    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyShortcuts = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (!timersRef.current.has("Copy")) {
          startCooldown("Copy");
          copyToClipboard();
        }
        return;
      }

      // Ignore modified keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      const keyMap: Record<string, ToolbarStates> = {
        "1": "Interact",
        "2": "Select",
        "3": "Pencil",
        "4": "Erase",
        "5": "Text",
        "6": "Frame",
        "7": "Line",
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
  }, [setCurrentTool, fcRef, isUsingToolRef, copyToClipboard]);

  if (prevTool !== currentTool) {
    setPrevTool(currentTool);
    setOpenPopoverId(null);
  }

  function handlePopoverOpen(isActive: boolean, toolName: ToolbarStates) {
    if (isActive) {
      // if you click on the same active tool, it toggles the popover, otherwise it opens the popover for the new active tool
      setOpenPopoverId((prev) => (prev === toolName ? null : toolName));
    }
  }

  return (
    <>
      {/* Invisible full-viewport box the toolbar is kept inside while dragging */}
      <div
        ref={dragConstraintsRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-2"
      />
      <div
        ref={toolbarRef}
        style={{
          transform: "translateX(-50%)",
        }}
        className="pointer-events-auto fixed bottom-5 left-1/2 z-2147483647"
      >
        <motion.div
          drag
          dragListener={false}
          dragControls={dragControls}
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          className="bg-background text-foreground border-border relative flex h-max w-max items-center gap-2 rounded-[10px] border-2 p-1.5 shadow-md"
        >
          {/* Drag handle — only this grabs the bar, so buttons still click normally */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            role="button"
            tabIndex={0}
            aria-label="Drag to move toolbar"
            title="Drag to move toolbar"
            className="text-muted-foreground flex h-11 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          >
            <GripVertical aria-hidden="true" className="size-5" />
          </div>
          <ColorPicker />
          <div className="h-8 w-0.5 rounded-[10px] bg-[#C2C7CB]" />
          {toolbarItems.map((item) => {
            const isActive = currentTool === item.name;

            return (
              <div key={item.name} className="size-11">
                {item.popover ? (
                  <Popover
                    open={openPopoverId === item.name}
                    onOpenChange={() => handlePopoverOpen(isActive, item.name)}
                  >
                    <PopoverTrigger
                      render={
                        <ToolbarButton
                          isActive={isActive}
                          item={item}
                          prefersReducedMotion={prefersReducedMotion}
                          setCurrentTool={setCurrentTool}
                        />
                      }
                    />
                    <PopoverContent className="w-max p-1" sideOffset={16}>
                      {item.popover}
                    </PopoverContent>
                  </Popover>
                ) : (
                  <ToolbarButton
                    isActive={isActive}
                    item={item}
                    prefersReducedMotion={prefersReducedMotion}
                    setCurrentTool={setCurrentTool}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId={
                      prefersReducedMotion
                        ? undefined
                        : "active-toolbar-item-bar"
                    }
                    className="absolute -top-0.5 h-0.5 w-11 bg-[#2b7fff]"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { type: "spring", damping: 50, stiffness: 600 }
                    }
                  />
                )}
              </div>
            );
          })}

          <div className="h-8 w-0.5 rounded-[10px] bg-[#C2C7CB]" />
          <div className="flex gap-2">
            {secondaryToolbarItems.map((item) => {
              const isCopyConfirming = item.name === "Copy" && copied;
              const label = isCopyConfirming
                ? "Copied canvas to clipboard"
                : item.description;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  disabled={cooldowns.has(item.name)}
                  onClick={() => {
                    startCooldown(item.name);
                    setOpenPopoverId(null);
                    if (item.name === "Copy") {
                      copyToClipboard();
                      return;
                    }
                    item.onClick(fcRef, toolbarRef);
                  }}
                  className={cn(
                    "relative size-11",
                    isCopyConfirming && "disabled:opacity-100"
                  )}
                  aria-label={label}
                  title={label}
                >
                  {item.name === "Clear" ? (
                    <motion.div
                      animate={
                        cooldowns.has("Clear")
                          ? { rotate: [0, 15, -15, 12, -12, 8, -8, 0] }
                          : {}
                      }
                      className="flex size-full items-center justify-center"
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="text-destructive size-5"
                      />
                    </motion.div>
                  ) : item.name === "Copy" ? (
                    <AnimatePresence initial={false} mode="wait">
                      <motion.span
                        key={copied ? "copied" : "copy"}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : {
                                duration: 0.125,
                                ease: "easeInOut",
                              }
                        }
                        className="flex size-full items-center justify-center"
                      >
                        {copied ? (
                          <Check
                            aria-hidden="true"
                            className="text-success size-5"
                          />
                        ) : (
                          <item.icon aria-hidden="true" className="size-5" />
                        )}
                      </motion.span>
                    </AnimatePresence>
                  ) : (
                    <item.icon aria-hidden="true" className="size-5" />
                  )}
                  {item.name === "Copy" && (
                    <sub
                      className="text-muted-foreground/60 absolute right-1 bottom-1.5 text-[9px] font-semibold"
                      aria-hidden="true"
                    >
                      {shortcut}
                    </sub>
                  )}
                </Button>
              );
            })}
          </div>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Copied canvas to clipboard" : ""}
          </span>
        </motion.div>
      </div>
    </>
  );
}
