import { Dot, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEraserPopover } from "@/context/eraser-popover/use-eraser-popover";
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
            style={{ width: "36px", height: "36px", borderRadius: "8px" }}
            key={item.value}
            variant="ghost"
            className="relative"
            aria-label={`Eraser width ${item.value}px`}
          >
            {isActive && (
              <motion.div
                layoutId={
                  prefersReducedMotion ? undefined : "active-eraser-popover-item"
                }
                className="absolute inset-0"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "var(--color-foreground)",
                }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", damping: 50, stiffness: 600 }
                }
              />
            )}
            <item.icon
              strokeWidth={item.strokeWidth}
              className="relative z-10 size-5 transition-colors"
              style={{
                stroke: isActive ? "var(--color-background)" : undefined,
              }}
            />
          </Button>
        );
      })}
    </div>
  );
}
