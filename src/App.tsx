import { useRef, useState } from "react";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";

export type ToolbarStates =
  | "Interact"
  | "Select"
  | "Pencil"
  | "Erase"
  | "Text"
  | "Frame"
  | "Line";

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolbarStates>("Select");
  // True while the user is mid-interaction with a tool (e.g. drawing a stroke),
  // so shortcuts can't swap tools out from under an in-progress action.
  const isUsingToolRef = useRef(false);

  return (
    <>
      <Toolbar
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        isUsingToolRef={isUsingToolRef}
      />
      <Canvas
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        isUsingToolRef={isUsingToolRef}
      />
    </>
  );
}
