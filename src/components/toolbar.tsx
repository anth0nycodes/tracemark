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
  Copy,
  Download,
  Eraser,
  MousePointer2,
  PencilLine,
  Square,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ToolbarStates } from "@/App";
import { ColorPicker } from "@/components/color-picker";
import { Line, type CustomIcon } from "@/components/custom-icons/icons";
import { EraserPopover } from "@/components/popovers/erase-popover";
import { PencilPopover } from "@/components/popovers/pencil-popover";
import { TextPopover } from "@/components/popovers/text-popover";
import { Button } from "@/components/ui/button";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import {
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
  { name: "Select", icon: MousePointer2, shortcut: "1" },
  {
    name: "Pencil",
    icon: PencilLine,
    shortcut: "2",
    popover: <PencilPopover />,
  },
  {
    name: "Erase",
    icon: Eraser,
    shortcut: "3",
    popover: <EraserPopover />,
  },
  {
    name: "Text",
    icon: Type,
    shortcut: "4",
    popover: <TextPopover />,
  },
  { name: "Frame", icon: Square, shortcut: "5", popover: <FramePopover /> },
  { name: "Line", icon: Line, shortcut: "6" },
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
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
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
        className={cn("z-10 transition-colors", isActive && "text-background")}
        style={{ width: "20px", height: "20px" }}
      />

      <span
        className={cn(
          "text-muted-foreground/60 dark:text-foreground absolute z-10 font-semibold transition-colors",
          isActive && "text-background"
        )}
        style={{ fontSize: "9px", bottom: "4px", right: "6px" }}
        aria-hidden="true"
      >
        {item.shortcut}
      </span>

      {isActive && (
        <motion.div
          layoutId={prefersReducedMotion ? undefined : "active-toolbar-item"}
          className="bg-foreground absolute inset-0"
          style={{
            borderRadius: "10px",
          }}
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
}

export function Toolbar({ currentTool, setCurrentTool }: ToolbarProps) {
  const [prevTool, setPrevTool] = useState(currentTool);
  const [openPopoverId, setOpenPopoverId] = useState<ToolbarStates | null>(
    null
  );
  const [cooldowns, setCooldowns] = useState<ReadonlySet<string>>(new Set());
  const [shortcut, setShortcut] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { fcRef } = useFabricCanvas();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  // One timer per button so rapid clicks don't cancel each other's cooldown
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const startCooldown = useCallback((name: string) => {
    clearTimeout(timersRef.current.get(name));
    setCooldowns((prev) => new Set(prev).add(name));

    const id = setTimeout(() => {
      setCooldowns((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
      timersRef.current.delete(name);
    }, 1500);

    timersRef.current.set(name, id);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const resolveShortcut = async () => {
      const os = await getOS();
      setShortcut(os === "macOS" ? "⌘C" : "Ctrl+C");
    };
    resolveShortcut();
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

      // Copy needs a modifier, so handle before the bare-key bail
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (!timersRef.current.has("Copy")) {
          startCooldown("Copy");
          handleCopyToClipboard(fcRef, toolbarRef);
        }
        return;
      }

      // Ignore modified keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      const keyMap: Record<string, ToolbarStates> = {
        "1": "Select",
        "2": "Pencil",
        "3": "Erase",
        "4": "Text",
        "5": "Frame",
        "6": "Line",
      };

      const tool = keyMap[e.key];
      if (!tool) return;

      e.preventDefault();
      setCurrentTool(tool);
    };

    window.addEventListener("keydown", handleKeyShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyShortcuts);
    };
  }, [setCurrentTool, fcRef, startCooldown]);

  if (prevTool !== currentTool) {
    setPrevTool(currentTool);
    setOpenPopoverId(null);
  }

  function handlePopoverOpen(isActive: boolean, toolName: ToolbarStates) {
    if (isActive) {
      setOpenPopoverId((prev) => (prev === toolName ? null : toolName));
    }
  }

  return (
    <div
      ref={toolbarRef}
      className="z-2147483647"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="bg-background text-foreground relative flex items-center shadow-2xl"
        style={{
          width: "max-content",
          height: "max-content",
          gap: "8px",
          padding: "6px",
          borderWidth: "2px",
          borderRadius: "10px",
          borderColor: "var(--color-border)",
        }}
      >
        <ColorPicker />
        <div
          style={{
            backgroundColor: "#C2C7CB",
            height: "32px",
            width: "2px",
            borderRadius: "10px",
          }}
        />
        {toolbarItems.map((item) => {
          const isActive = currentTool === item.name;

          return (
            <div key={item.name} style={{ width: "44px", height: "44px" }}>
              {item.popover ? (
                <Popover
                  open={openPopoverId === item.name}
                  onOpenChange={() => handlePopoverOpen(isActive, item.name)}
                >
                  <PopoverTrigger asChild>
                    <ToolbarButton
                      isActive={isActive}
                      item={item}
                      prefersReducedMotion={prefersReducedMotion}
                      setCurrentTool={setCurrentTool}
                    />
                  </PopoverTrigger>
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
                    prefersReducedMotion ? undefined : "active-toolbar-item-bar"
                  }
                  style={{
                    position: "absolute",
                    top: "-2px",
                    backgroundColor: "#2b7fff",
                    width: "44px",
                    height: "2px",
                  }}
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

        <div className="h-8 w-0.5 rounded-lg bg-[#C2C7CB]" />
        <div className="flex gap-2">
          {secondaryToolbarItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              disabled={cooldowns.has(item.name)}
              onClick={() => {
                startCooldown(item.name);
                setOpenPopoverId(null);
                item.onClick(fcRef, toolbarRef);
              }}
              className="relative size-11"
              aria-label={item.description}
              title={item.description}
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
          ))}
        </div>
      </div>
    </div>
  );
}
