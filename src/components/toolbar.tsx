import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, MousePointer2, PencilLine, Square, Type } from "lucide-react";
import { Line } from "@/components/custom-icons/icons";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const toolbarItems = {
  Select: { icon: MousePointer2, tooltipText: "Select" },
  Draw: { icon: PencilLine, tooltipText: "Draw" },
  Erase: { icon: Eraser, tooltipText: "Erase" },
  Text: { icon: Type, tooltipText: "Text" },
  Frame: { icon: Square, tooltipText: "Frame" },
  Line: { icon: Line, tooltipText: "Line" },
} as const;

type ToolbarItemText = keyof typeof toolbarItems;

export function Toolbar() {
  const [activeToolbarItem, setActiveToolbarItem] = useState<ToolbarItemText>();

  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-full w-max p-1 bg-background shadow-lg">
      {Object.values(toolbarItems).map((item) => {
        const isActive = activeToolbarItem === item.tooltipText;

        return (
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
            {isActive && (
              <motion.div
                layoutId="nav-item"
                className="absolute inset-0 bg-foreground rounded-full"
                transition={{ type: "spring", damping: 50, stiffness: 600 }}
              />
            )}
          </Button>
        );
      })}
    </div>
  );
}
