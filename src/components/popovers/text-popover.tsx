import { IText } from "fabric";
import {
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import type { TextAlign } from "@/context/toolbar/text-popover/constants";
import { useTextPopover } from "@/context/toolbar/text-popover/use-text-popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PopoverItem {
  icon: LucideIcon;
  value: TextAlign;
}

const popoverItems: PopoverItem[] = [
  {
    icon: TextAlignStart,
    value: "left",
  },
  {
    icon: TextAlignCenter,
    value: "center",
  },
  {
    icon: TextAlignEnd,
    value: "right",
  },
];

export function TextPopover() {
  const { fcRef } = useFabricCanvas();
  const { textAlignment, setTextAlignment } = useTextPopover();
  const prefersReducedMotion = useReducedMotion();

  const handleTextAlignmentChange = (alignmentOption: TextAlign) => {
    setTextAlignment(alignmentOption);
    const fc = fcRef.current;
    if (!fc) return;

    const activeObjects = fc.getActiveObjects();
    for (const object of activeObjects) {
      if (object instanceof IText) {
        object.set({ textAlign: alignmentOption });
      }
    }
    fc.requestRenderAll();
  };

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = textAlignment === item.value;

        return (
          <Button
            onClick={() => handleTextAlignmentChange(item.value)}
            key={item.value}
            variant="ghost"
            className="relative size-9 rounded-lg"
            aria-label={`Text alignment: ${item.value}`}
          >
            {isActive && (
              <motion.div
                layoutId={
                  prefersReducedMotion ? undefined : "active-text-popover-item"
                }
                className="bg-foreground absolute inset-0 rounded-lg"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", damping: 50, stiffness: 600 }
                }
              />
            )}
            <item.icon
              aria-hidden="true"
              className={cn(
                "relative z-10 size-5 transition-colors",
                isActive && "stroke-background"
              )}
            />
          </Button>
        );
      })}
    </div>
  );
}
