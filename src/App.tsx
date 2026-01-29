import { useState } from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

export type ToolbarStates =
  | "Pencil"
  | "Erase"
  | "Select"
  | "Text"
  | "Frame"
  | "Line";

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolbarStates>("Pencil");
  // TODO: make it so you can't swap tools with the shortcuts if you're actively using the tool

  return (
    <>
      <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
      <Canvas currentTool={currentTool} />
    </>
  );
}
