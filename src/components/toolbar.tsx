import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Eraser,
  MousePointer2,
  PencilLine,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react";
import { Line, type CustomIcon } from "@/components/custom-icons/icons";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ToolbarItemProps {
  icon: LucideIcon | CustomIcon;
  shortcut: string;
  tooltipText: ToolbarItemText;
}

type ToolbarItemText = "Draw" | "Erase" | "Select" | "Text" | "Frame" | "Line";
type ToolbarItemsRecord = Record<ToolbarItemText, ToolbarItemProps>;

const toolbarItems: ToolbarItemsRecord = {
  Draw: { icon: PencilLine, shortcut: "1", tooltipText: "Draw" },
  Erase: { icon: Eraser, shortcut: "2", tooltipText: "Erase" },
  Select: { icon: MousePointer2, shortcut: "3", tooltipText: "Select" },
  Text: { icon: Type, shortcut: "4", tooltipText: "Text" },
  Frame: { icon: Square, shortcut: "5", tooltipText: "Frame" },
  Line: { icon: Line, shortcut: "6", tooltipText: "Line" },
} as const;

export function Toolbar() {
  const [activeToolbarItem, setActiveToolbarItem] =
    useState<ToolbarItemText>("Draw");

  useEffect(() => {
    const handleKeyShortcuts = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Only handle keys 1-6 without modifiers
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
        return;
      }

      switch (e.key) {
        case "1":
          e.preventDefault();
          setActiveToolbarItem("Draw");
          break;
        case "2":
          e.preventDefault();
          setActiveToolbarItem("Erase");
          break;
        case "3":
          e.preventDefault();
          setActiveToolbarItem("Select");
          break;
        case "4":
          e.preventDefault();
          setActiveToolbarItem("Text");
          break;
        case "5":
          e.preventDefault();
          setActiveToolbarItem("Frame");
          break;
        case "6":
          e.preventDefault();
          setActiveToolbarItem("Line");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyShortcuts);

    return () => {
      window.removeEventListener("keydown", handleKeyShortcuts);
    };
  }, []);

  // TODO: handle each toolbar item logic when active

  return (
    <div
      className="flex items-center border-2 border-border bg-background text-foreground shadow-2xl"
      style={{
        width: "max-content",
        height: "max-content",
        gap: "8px",
        padding: "4px",
        borderRadius: "12px",
      }}
    >
      {Object.values(toolbarItems).map((item) => {
        const isActive = activeToolbarItem === item.tooltipText;

        return (
          <Button
            key={item.tooltipText}
            variant={isActive ? null : "ghost"}
            className={cn(
              "relative flex items-center justify-center shrink-0",
              isActive && "text-background",
            )}
            style={{ width: "44px", height: "44px", borderRadius: "10px" }}
            onClick={() => setActiveToolbarItem(item.tooltipText)}
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
                  : "text-muted-foreground/60 dark:text-foreground",
              )}
              style={{ fontSize: "9px", bottom: "4px", right: "6px" }}
              aria-hidden="true"
            >
              {item.shortcut}
            </span>
            {isActive && (
              <motion.div
                layoutId="toolbar-item"
                className="absolute inset-0 bg-foreground"
                style={{ borderRadius: "10px" }}
                transition={{ type: "spring", damping: 50, stiffness: 600 }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
