import { LineSquiggle, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { usePencilPopover } from "@/context/toolbar/pencil-popover/use-pencil-popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface PopoverItem {
  icon: LucideIcon;
  value: number;
  strokeWidth: number;
}

const popoverItems: PopoverItem[] = [
  {
    icon: LineSquiggle,
    value: 5,
    strokeWidth: 1,
  },
  {
    icon: LineSquiggle,
    value: 15,
    strokeWidth: 2,
  },
  {
    icon: LineSquiggle,
    value: 25,
    strokeWidth: 3,
  },
];

export function PencilPopover() {
  const { pencilWidth, setPencilWidth } = usePencilPopover();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = pencilWidth === item.value;

        return (
          <Button
            onClick={() => setPencilWidth(item.value)}
            key={item.value}
            variant="ghost"
            className="relative size-9 rounded-lg"
            aria-label={`Pencil width ${item.value}px`}
          >
            {isActive && (
              <m.div
                layoutId={
                  prefersReducedMotion
                    ? undefined
                    : "active-pencil-popover-item"
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
