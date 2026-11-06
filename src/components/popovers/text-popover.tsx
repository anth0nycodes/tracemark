import { IText } from "fabric";
import { TextAlignCenter, TextAlignEnd, TextAlignStart } from "lucide-react";
import {
  PopoverOptions,
  type PopoverOption,
} from "@/components/popovers/popover-options";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";
import type { TextAlign } from "@/context/toolbar/text-popover/constants";
import { useTextPopover } from "@/context/toolbar/text-popover/use-text-popover";

const options: PopoverOption<TextAlign>[] = [
  { icon: TextAlignStart, value: "left", label: "Text alignment: left" },
  { icon: TextAlignCenter, value: "center", label: "Text alignment: center" },
  { icon: TextAlignEnd, value: "right", label: "Text alignment: right" },
];

export function TextPopover() {
  const { fcRef } = useFabricCanvas();
  const { textAlignment, setTextAlignment } = useTextPopover();

  const handleTextAlignmentChange = (alignmentOption: TextAlign) => {
    setTextAlignment(alignmentOption);
    const fc = fcRef.current;
    if (!fc) return;

    const activeObjects = fc.getActiveObjects();
    for (const object of activeObjects) {
      if (object instanceof IText) {
        object.set({ textAlign: alignmentOption });
      }
    }
    fc.requestRenderAll();
  };

  return (
    <PopoverOptions
      options={options}
      value={textAlignment}
      onChange={handleTextAlignmentChange}
    />
  );
}
