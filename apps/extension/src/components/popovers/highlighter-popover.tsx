import { Minus } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { useHighlighterPopover } from "@/context/toolbar/highlighter-popover/use-highlighter-popover";

// Thick flat bars read as marker strokes, vs. the pencil's thin squiggles
const options: PopoverOption<number>[] = [
  { icon: Minus, value: 10, strokeWidth: 3, label: "Highlighter width 10px" },
  { icon: Minus, value: 20, strokeWidth: 5, label: "Highlighter width 20px" },
  { icon: Minus, value: 30, strokeWidth: 7, label: "Highlighter width 30px" },
];

export function HighlighterPopover() {
  const { highlighterWidth, setHighlighterWidth } = useHighlighterPopover();

  return (
    <PopoverOptions
      options={options}
      value={highlighterWidth}
      onChange={setHighlighterWidth}
    />
  );
}
