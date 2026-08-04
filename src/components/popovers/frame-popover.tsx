import { Circle, Square, Triangle, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Frame } from "@/context/toolbar/frame/constants";
import { useFramePopover } from "@/context/toolbar/frame/use-frame-popover";
import type { CustomIcon } from "../custom-icons/icons";
import { Button } from "../ui/button";

interface PopoverItem {
  icon: LucideIcon | CustomIcon;
  value: Frame;
}

const popoverItems: PopoverItem[] = [
  {
    icon: Square,
    value: "Rect",
  },
  {
    icon: Triangle,
    value: "Triangle",
  },
  {
    icon: Circle,
    value: "Circle",
  },
];

export function FramePopover() {
  const { frame, setFrame } = useFramePopover();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex gap-1">
      {popoverItems.map((item) => {
        const isActive = frame === item.value;

        return (
          <Button
            onClick={() => setFrame(item.value)}
            style={{ width: "36px", height: "36px", borderRadius: "8px" }}
            key={item.value}
            variant="ghost"
            className="relative"
            aria-label={`Frame ${item.value}`}
          >
            {isActive && (
              <motion.div
                layoutId={
                  prefersReducedMotion
                    ? undefined
                    : "active-eraser-popover-item"
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
              aria-hidden="true"
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
