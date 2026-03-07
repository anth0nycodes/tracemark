import { LineSquiggle, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { usePencilPopover } from "@/context/pencil-popover/use-pencil-popover";
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

  return (
    <div className="flex items-center gap-1">
      {popoverItems.map((item) => {
        const isActive = pencilWidth === item.value;

        return (
          <Button
            onClick={() => setPencilWidth(item.value)}
            style={{ width: "36px", height: "36px", borderRadius: "8px" }}
            key={item.value}
            variant="ghost"
            className="relative"
            aria-label={`Pencil width ${item.value}px`}
          >
            {isActive && (
              <motion.div
                layoutId="active-pencil-popover-item"
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
              style={{ stroke: isActive ? "var(--color-background)" : undefined }}
            />
          </Button>
        );
      })}
    </div>
  );
}
