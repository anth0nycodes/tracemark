import {
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
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

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
    return () => timers.forEach((timer) => clearTimeout(timer));
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
          handleCopyToClipboard(fcRef, toolbarRef).catch((error: unknown) => {
            const errorMessage = getErrorMessage(error);
            console.error("Error copying to clipboard:", errorMessage);
          });
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
  }, [setCurrentTool, fcRef]);

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
    <div
      ref={toolbarRef}
      style={{
        transform: "translateX(-50%)",
      }}
      className="fixed bottom-5 left-1/2 z-2147483647"
    >
      <div className="bg-background text-foreground border-border relative flex h-max w-max items-center gap-2 rounded-[10px] border-2 p-1.5 shadow-md">
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
                    prefersReducedMotion ? undefined : "active-toolbar-item-bar"
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
