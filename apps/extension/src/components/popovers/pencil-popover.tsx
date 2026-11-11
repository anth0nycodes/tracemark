import { LineSquiggle } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { usePencilPopover } from "@/context/toolbar/pencil-popover/use-pencil-popover";

const options: PopoverOption<number>[] = [
  { icon: LineSquiggle, value: 3, strokeWidth: 1, label: "Pencil width 3px" },
  { icon: LineSquiggle, value: 5, strokeWidth: 1.5, label: "Pencil width 5px" },
  {
    icon: LineSquiggle,
    value: 10,
    strokeWidth: 2.5,
    label: "Pencil width 10px",
  },
];

export function PencilPopover() {
  const { pencilWidth, setPencilWidth } = usePencilPopover();

  return (
    <PopoverOptions
      options={options}
      value={pencilWidth}
      onChange={setPencilWidth}
    />
  );
}
