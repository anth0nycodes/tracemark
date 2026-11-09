import { LineSquiggle } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { usePencilPopover } from "@/context/toolbar/pencil-popover/use-pencil-popover";

const options: PopoverOption<number>[] = [
  { icon: LineSquiggle, value: 5, strokeWidth: 1, label: "Pencil width 5px" },
  { icon: LineSquiggle, value: 15, strokeWidth: 2, label: "Pencil width 15px" },
  { icon: LineSquiggle, value: 25, strokeWidth: 3, label: "Pencil width 25px" },
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
