import type { LucideIcon } from "lucide-react";
import type { CustomIcon } from "@/components/custom-icons/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PopoverOption<T extends string | number> {
  value: T;
  icon: LucideIcon | CustomIcon;
  label: string;
  strokeWidth?: number;
}

interface PopoverOptionsProps<T extends string | number> {
  options: PopoverOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function PopoverOptions<T extends string | number>({
  options,
  value,
  onChange,
}: PopoverOptionsProps<T>) {
  return (
    <div className="flex items-center gap-1">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Button
            key={option.value}
            onClick={() => onChange(option.value)}
            variant="ghost"
            className={cn(
              "hover:bg-accent/50 size-9 rounded-lg duration-0!",
              isActive && "bg-accent hover:bg-accent dark:hover:bg-accent",
            )}
            aria-label={option.label}
            aria-pressed={isActive}
          >
            <option.icon
              aria-hidden="true"
              // not every icon has a custom strokWidth, so we only apply it if it's defined
              {...(option.strokeWidth !== undefined && {
                strokeWidth: option.strokeWidth,
              })}
              className="size-5"
            />
          </Button>
        );
      })}
    </div>
  );
}
