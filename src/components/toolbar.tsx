import {
  useEffect,
  useState,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from "react";
import {
  Eraser,
  MousePointer2,
  PencilLine,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ToolbarStates } from "@/App";
import { ColorPicker } from "@/components/color-picker";
import { Line, type CustomIcon } from "@/components/custom-icons/icons";
import { EraserPopover } from "@/components/popovers/erase-popover";
import { FramePopover } from "@/components/popovers/frame-popover";
import { PencilPopover } from "@/components/popovers/pencil-popover";
import { TextPopover } from "@/components/popovers/text-popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ToolbarItemProps {
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  tooltipText: ToolbarStates;
  popover?: ReactNode;
}

type ToolbarItemsRecord = Record<ToolbarStates, ToolbarItemProps>;

const toolbarItems: ToolbarItemsRecord = {
  Select: { icon: MousePointer2, shortcut: "1", tooltipText: "Select" },
  Pencil: {
    icon: PencilLine,
    shortcut: "2",
    tooltipText: "Pencil",
    popover: <PencilPopover />,
  },
  Erase: {
    icon: Eraser,
    shortcut: "3",
    tooltipText: "Erase",
    popover: <EraserPopover />,
  },
  Text: {
    icon: Type,
    shortcut: "4",
    tooltipText: "Text",
    popover: <TextPopover />,
  },
  Frame: {
    icon: Square,
    shortcut: "5",
    tooltipText: "Frame",
    popover: <FramePopover />,
  },
  Line: { icon: Line, shortcut: "6", tooltipText: "Line" },
} as const;

interface ToolbarProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
}

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
        setCurrentTool(item.tooltipText);
        onClick?.(e);
      }}
      aria-label={`${item.tooltipText} (${item.shortcut})`}
      title={`${item.tooltipText} (${item.shortcut})`}
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

export function Toolbar({ currentTool, setCurrentTool }: ToolbarProps) {
  const [openPopoverId, setOpenPopoverId] = useState<ToolbarStates | null>(
    null
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyShortcuts = (e: KeyboardEvent) => {
      // Ignore typing contexts
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Ignore modified keys (this is susceptible to change when adding future undo/redo + copy logic)
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
  }, []);

  useEffect(() => {
    if (currentTool !== openPopoverId) {
      setOpenPopoverId(null);
    }
  }, [currentTool, openPopoverId]);

  function handlePopoverOpen(isActive: boolean, tooltipText: ToolbarStates) {
    if (isActive) {
      setOpenPopoverId((prev) => (prev === tooltipText ? null : tooltipText));
    }
  }

  return (
    <div
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
        {Object.values(toolbarItems).map((item) => {
          const isActive = currentTool === item.tooltipText;

          return (
            <div
              key={item.tooltipText}
              style={{ width: "44px", height: "44px" }}
            >
              {item.popover ? (
                <Popover
                  open={openPopoverId === item.tooltipText}
                  onOpenChange={() =>
                    handlePopoverOpen(isActive, item.tooltipText)
                  }
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
      </div>
    </div>
  );
}
