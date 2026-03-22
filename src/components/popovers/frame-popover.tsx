import {
  Circle,
  Diamond,
  Square,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { FrameShape } from "@/context/frame-popover/constants";
import { useFramePopover } from "@/context/frame-popover/use-frame-popover";
import { Button } from "../ui/button";

interface PopoverItem {
  icon: LucideIcon;
  value: FrameShape;
}

const popoverItems: PopoverItem[] = [
  {
    icon: Square,
    value: "square",
  },
  {
    icon: Circle,
    value: "circle",
  },
  {
    icon: Diamond,
    value: "diamond",
  },
];

export function FramePopover() {
  const { frameShape, setFrameShape } = useFramePopover();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = frameShape === item.value;

        return (
          <Button
            onClick={() => setFrameShape(item.value)}
            style={{ width: "36px", height: "36px", borderRadius: "8px" }}
            key={item.value}
            variant="ghost"
            className="relative"
            aria-label={`Frame shape: ${item.value}`}
          >
            {isActive && (
              <motion.div
                layoutId={
                  prefersReducedMotion
                    ? undefined
                    : "active-frame-popover-item"
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
