import { Dot, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEraserPopover } from "@/context/toolbar/eraser-popover/use-eraser-popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PopoverItem {
  icon: LucideIcon;
  value: number;
  strokeWidth: number;
}

const popoverItems: PopoverItem[] = [
  {
    icon: Dot,
    value: 5,
    strokeWidth: 3,
  },
  {
    icon: Dot,
    value: 15,
    strokeWidth: 7,
  },
  {
    icon: Dot,
    value: 25,
    strokeWidth: 10,
  },
];

export function EraserPopover() {
  const { eraserWidth, setEraserWidth } = useEraserPopover();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = eraserWidth === item.value;

        return (
          <Button
            onClick={() => setEraserWidth(item.value)}
            key={item.value}
            variant="ghost"
            className="relative size-9 rounded-lg"
            aria-label={`Eraser width ${item.value}px`}
          >
            {isActive && (
              <m.div
                layoutId={
                  prefersReducedMotion
                    ? undefined
                    : "active-eraser-popover-item"
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
              strokeWidth={item.strokeWidth}
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
