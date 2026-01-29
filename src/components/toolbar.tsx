import { useEffect } from "react";
import {
  Eraser,
  MousePointer2,
  PencilLine,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import type { ToolbarStates } from "@/App";
import { Line, type CustomIcon } from "@/components/custom-icons/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ToolbarItemProps {
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  tooltipText: ToolbarStates;
}

type ToolbarItemsRecord = Record<ToolbarStates, ToolbarItemProps>;

const toolbarItems: ToolbarItemsRecord = {
  Pencil: { icon: PencilLine, shortcut: "1", tooltipText: "Pencil" },
  Erase: { icon: Eraser, shortcut: "2", tooltipText: "Erase" },
  Select: { icon: MousePointer2, shortcut: "3", tooltipText: "Select" },
  Text: { icon: Type, shortcut: "4", tooltipText: "Text" },
  Frame: { icon: Square, shortcut: "5", tooltipText: "Frame" },
  Line: { icon: Line, shortcut: "6", tooltipText: "Line" },
} as const;

interface ToolbarProps {
  currentTool: ToolbarStates;
  setCurrentTool: (currentTool: ToolbarStates) => void;
}

export function Toolbar({ currentTool, setCurrentTool }: ToolbarProps) {
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

      // Ignore modified keys
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      const keyMap: Record<string, ToolbarStates> = {
        "1": "Pencil",
        "2": "Erase",
        "3": "Select",
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

  return (
    <div className="fixed right-0 bottom-5 left-0 z-2147483647 flex justify-center">
      <div
        className="border-border bg-background text-foreground flex items-center border-2 shadow-2xl"
        style={{
          width: "max-content",
          height: "max-content",
          gap: "8px",
          padding: "4px",
          borderRadius: "12px",
        }}
      >
        {Object.values(toolbarItems).map((item) => {
          const isActive = currentTool === item.tooltipText;

          return (
            <Button
              key={item.tooltipText}
              variant={isActive ? null : "ghost"}
              className={cn(
                "relative flex shrink-0 items-center justify-center",
                isActive && "text-background"
              )}
              style={{ width: "44px", height: "44px", borderRadius: "10px" }}
              onClick={() => setCurrentTool(item.tooltipText)}
              aria-label={`${item.tooltipText} (${item.shortcut})`}
              title={`${item.tooltipText} (${item.shortcut})`}
              aria-pressed={isActive}
            >
              <item.icon
                aria-hidden="true"
                className="z-10"
                style={{ width: "20px", height: "20px" }}
              />

              <span
                className={cn(
                  "absolute z-10 font-semibold transition-colors",
                  isActive
                    ? "text-background/80"
                    : "text-muted-foreground/60 dark:text-foreground"
                )}
                style={{ fontSize: "9px", bottom: "4px", right: "6px" }}
                aria-hidden="true"
              >
                {item.shortcut}
              </span>

              {isActive && (
                <motion.div
                  layoutId="toolbar-item"
                  className="bg-foreground absolute inset-0"
                  style={{ borderRadius: "10px" }}
                  transition={{ type: "spring", damping: 50, stiffness: 600 }}
                />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
