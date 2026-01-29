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

interface ToolbarItemProps {
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  tooltipText: ToolbarStates;
}

type ToolbarItemsRecord = Record<ToolbarStates, ToolbarItemProps>;

const toolbarItems: ToolbarItemsRecord = {
  Select: { icon: MousePointer2, shortcut: "1", tooltipText: "Select" },
  Pencil: { icon: PencilLine, shortcut: "2", tooltipText: "Pencil" },
  Erase: { icon: Eraser, shortcut: "3", tooltipText: "Erase" },
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

  return (
    <div
      className="z-2147483647"
      style={{
        position: "fixed",
        right: "0px",
        bottom: "20px",
        left: "0px",
        display: "flex",
        justifyContent: "center",
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
          borderColor: "var(--border)",
        }}
      >
        {Object.values(toolbarItems).map((item) => {
          const isActive = currentTool === item.tooltipText;

          return (
            <div style={{ width: "44px", height: "44px" }}>
              <Button
                key={item.tooltipText}
                variant={isActive ? null : "ghost"}
                className="relative flex shrink-0 items-center justify-center"
                style={{ width: "100%", height: "100%", borderRadius: "10px" }}
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
                  className="text-muted-foreground/60 dark:text-foreground absolute z-10 font-semibold transition-colors"
                  style={{ fontSize: "9px", bottom: "4px", right: "6px" }}
                  aria-hidden="true"
                >
                  {item.shortcut}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-toolbar-item"
                    className="bg-accent absolute inset-0"
                    style={{ borderRadius: "10px" }}
                    transition={{ type: "spring", damping: 50, stiffness: 600 }}
                  />
                )}
              </Button>
              {isActive && (
                <motion.div
                  layoutId="active-toolbar-item-bar"
                  style={{
                    position: "absolute",
                    top: "-2px",
                    backgroundColor: "#2b7fff",
                    width: "44px",
                    height: "2px",
                  }}
                  transition={{ type: "spring", damping: 50, stiffness: 600 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
