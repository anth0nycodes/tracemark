import {
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { TextAlign } from "@/context/text-popover/constants";
import { useTextPopover } from "@/context/text-popover/use-text-popover";
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
  const { textAlignment, setTextAlignment } = useTextPopover();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = textAlignment === item.value;

        return (
          <Button
            onClick={() => setTextAlignment(item.value)}
            style={{ width: "36px", height: "36px", borderRadius: "8px" }}
            key={item.value}
            variant="ghost"
            className="relative"
            aria-label={`Text alignment: ${item.value}`}
          >
            {isActive && (
              <motion.div
                layoutId={
                  prefersReducedMotion ? undefined : "active-text-popover-item"
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
