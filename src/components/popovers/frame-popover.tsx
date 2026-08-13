import { Circle, Square, Triangle, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import type { Frame } from "@/context/toolbar/frame/constants";
import { useFramePopover } from "@/context/toolbar/frame/use-frame-popover";
import { cn } from "@/lib/utils";
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
            key={item.value}
            variant="ghost"
            className="relative size-9 rounded-lg"
            aria-label={`Frame ${item.value}`}
          >
            {isActive && (
              <m.div
                layoutId={
                  prefersReducedMotion ? undefined : "active-frame-popover-item"
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
