import { useState } from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

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
    <>
      <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <Canvas currentTool={currentTool} />
    </>
  );
}
