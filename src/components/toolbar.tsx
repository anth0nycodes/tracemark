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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
    <div className="flex items-center gap-2 border border-gray-300 rounded-lg w-max p-1 bg-background shadow-md">
      {Object.values(toolbarItems).map((item) => {
        const isActive = activeToolbarItem === item.tooltipText;

        return (
          <Tooltip key={item.tooltipText}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? null : "ghost"}
                className={cn(
                  "relative rounded-lg size-11 flex items-center justify-center",
                  isActive && "text-background",
                )}
                onClick={() => setActiveToolbarItem(item.tooltipText)}
              >
                <item.icon aria-hidden="true" className="z-10" />
                <span
                  className={cn(
                    "absolute bottom-1 right-1.5 z-10 text-[9px] font-semibold transition-colors",
                    isActive
                      ? "text-background/80"
                      : "text-muted-foreground/60",
                  )}
                >
                  {item.shortcut}
                </span>
                <TooltipContent side="top">{item.tooltipText}</TooltipContent>
                {isActive && (
                  <motion.div
                    layoutId="toolbar-item"
                    className="absolute inset-0 bg-foreground rounded-lg"
                    transition={{ type: "spring", damping: 50, stiffness: 600 }}
                  />
                )}
              </Button>
            </TooltipTrigger>
          </Tooltip>
        );
      })}
    </div>
  );
}
