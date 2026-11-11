import { Dot } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { useEraserPopover } from "@/context/toolbar/eraser-popover/use-eraser-popover";

const options: PopoverOption<number>[] = [
  { icon: Dot, value: 8, strokeWidth: 4, label: "Eraser width 8px" },
  { icon: Dot, value: 12, strokeWidth: 6, label: "Eraser width 12px" },
  { icon: Dot, value: 18, strokeWidth: 9, label: "Eraser width 18px" },
];

export function EraserPopover() {
  const { eraserWidth, setEraserWidth } = useEraserPopover();

  return (
    <PopoverOptions
      options={options}
      value={eraserWidth}
      onChange={setEraserWidth}
    />
  );
}
