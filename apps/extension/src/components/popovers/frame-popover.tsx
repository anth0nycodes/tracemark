import { Circle, Square, Triangle } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import type { Frame } from "@/context/toolbar/frame/constants";
import { useFramePopover } from "@/context/toolbar/frame/use-frame-popover";

const options: PopoverOption<Frame>[] = [
  { icon: Square, value: "Rect", label: "Frame Rect" },
  { icon: Triangle, value: "Triangle", label: "Frame Triangle" },
  { icon: Circle, value: "Circle", label: "Frame Circle" },
];

export function FramePopover() {
  const { frame, setFrame } = useFramePopover();

  return <PopoverOptions options={options} value={frame} onChange={setFrame} />;
}
