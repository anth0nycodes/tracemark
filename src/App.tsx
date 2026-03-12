import { useState } from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";
import { ColorProvider } from "@/context/color/ColorContext";
import { EraserPopoverProvider } from "@/context/eraser-popover/PopoverProvider";
import { PencilPopoverProvider } from "@/context/pencil-popover/PopoverProvider";

export type ToolbarStates =
  | "Select"
  | "Pencil"
  | "Erase"
  | "Text"
  | "Frame"
  | "Line";

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolbarStates>("Select");
  // TODO: make it so you can't swap tools with the shortcuts if you're actively using the tool

  return (
    <ColorProvider>
      <PencilPopoverProvider>
        <EraserPopoverProvider>
          <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
          <Canvas currentTool={currentTool} setCurrentTool={setCurrentTool} />
        </EraserPopoverProvider>
      </PencilPopoverProvider>
    </ColorProvider>
  );
}
