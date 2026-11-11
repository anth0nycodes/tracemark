import { MoveDiagonal, MoveUpRight } from "lucide-react";
import { Line } from "@/components/custom-icons/icons";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import type { LineStyle } from "@/context/toolbar/line-popover/constants";
import { useLinePopover } from "@/context/toolbar/line-popover/use-line-popover";

const options: PopoverOption<LineStyle>[] = [
  { icon: Line, value: "Line", label: "Line style: plain" },
  { icon: MoveUpRight, value: "Arrow", label: "Line style: arrow" },
  {
    icon: MoveDiagonal,
    value: "DoubleArrow",
    label: "Line style: double-headed arrow",
  },
];

export function LinePopover() {
  const { lineStyle, setLineStyle } = useLinePopover();

  return (
    <PopoverOptions
      options={options}
      value={lineStyle}
      onChange={setLineStyle}
    />
  );
}
