import { useState } from "react";
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
  tooltipText: ToolbarItemText;
}

type ToolbarItemText = "Draw" | "Erase" | "Select" | "Text" | "Frame" | "Line";
type ToolbarItemsRecord = Record<ToolbarItemText, ToolbarItemProps>;

const toolbarItems: ToolbarItemsRecord = {
  Draw: { icon: PencilLine, tooltipText: "Draw" },
  Erase: { icon: Eraser, tooltipText: "Erase" },
  Select: { icon: MousePointer2, tooltipText: "Select" },
  Text: { icon: Type, tooltipText: "Text" },
  Frame: { icon: Square, tooltipText: "Frame" },
  Line: { icon: Line, tooltipText: "Line" },
} as const;

export function Toolbar() {
  const [activeToolbarItem, setActiveToolbarItem] =
    useState<ToolbarItemText>("Draw");

  // TODO: handle each toolbar item logic when active

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full w-max p-1 bg-background shadow-lg">
      {Object.values(toolbarItems).map((item) => {
        const isActive = activeToolbarItem === item.tooltipText;

        return (
          <Tooltip>
            <TooltipTrigger>
              <Button
                key={item.tooltipText}
                variant={isActive ? null : "ghost"}
                className={cn(
                  "relative rounded-full size-10 flex items-center justify-center",
                  isActive && "text-background",
                )}
                onClick={() => setActiveToolbarItem(item.tooltipText)}
              >
                <item.icon aria-hidden="true" className="z-10" />
                <TooltipContent side="top">{item.tooltipText}</TooltipContent>
                {isActive && (
                  <motion.div
                    layoutId="toolbar-item"
                    className="absolute inset-0 bg-foreground rounded-full"
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
