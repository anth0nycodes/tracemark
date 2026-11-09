import { Dot } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { useEraserPopover } from "@/context/toolbar/eraser-popover/use-eraser-popover";

const options: PopoverOption<number>[] = [
  { icon: Dot, value: 5, strokeWidth: 3, label: "Eraser width 5px" },
  { icon: Dot, value: 15, strokeWidth: 7, label: "Eraser width 15px" },
  { icon: Dot, value: 25, strokeWidth: 10, label: "Eraser width 25px" },
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
