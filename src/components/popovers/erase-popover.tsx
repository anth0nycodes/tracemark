import { Dot, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
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
          >
            {isActive && (
              <motion.div
                layoutId="active-eraser-popover-item"
                className="absolute inset-0"
                style={{
                  borderRadius: "8px",
                  backgroundColor: "var(--color-foreground)",
                }}
                transition={{ type: "spring", damping: 50, stiffness: 600 }}
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
