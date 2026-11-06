import { useEffect, useRef, useState } from "react";
import { IText } from "fabric";
import { Canvas } from "@/components/canvas";
import { Toolbar } from "@/components/toolbar";
import { useFabricCanvas } from "@/context/fabric-canvas/use-fabric-canvas";

export type ToolbarStates =
  | "Interact"
  | "Select"
  | "Pencil"
  | "Highlighter"
  | "Erase"
  | "Text"
  | "Frame"
  | "Line";

interface AppProps {
  onClose: () => void;
}

export function App({ onClose }: AppProps) {
  const [currentTool, setCurrentTool] = useState<ToolbarStates>("Select");
  const [isHidden, setIsHidden] = useState(false);
  // True while the user is mid-interaction with a tool (e.g. drawing a stroke),
  // so shortcuts can't swap tools out from under an in-progress action.
  const isUsingToolRef = useRef(false);
  const { fcRef } = useFabricCanvas();

  useEffect(() => {
    const handleToggleVisibility = (e: KeyboardEvent) => {
      // Match the "." character OR the physical period key, since "." moves
      // around (or needs Shift) on non-US layouts like AZERTY
      const isPeriod = e.key === "." || e.code === "Period";
      const isToggleShortcut =
        (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && isPeriod;
      if (!isToggleShortcut) return;

      // Keep any browser/OS binding for the combo from firing, even on held-key repeats
      e.preventDefault();
      if (e.repeat || isUsingToolRef.current) return;

      setIsHidden((prev) => !prev);
    };

    window.addEventListener("keydown", handleToggleVisibility);
    return () => window.removeEventListener("keydown", handleToggleVisibility);
  }, []);

  useEffect(() => {
    if (!isHidden) return;

    // Fabric's text input lives in document.body, outside our container, so
    // it would keep focus and keep typing into hidden text
    const activeObject = fcRef.current?.getActiveObject();
    if (activeObject instanceof IText && activeObject.isEditing) {
      activeObject.exitEditing();
      fcRef.current?.requestRenderAll();
    }
  }, [isHidden, fcRef]);

  return (
    // `contents` keeps the wrapper out of layout; `hidden` (display: none)
    // hides the toolbar and canvas without unmounting them
    <div className={isHidden ? "hidden" : "contents"}>
      <Toolbar
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        isUsingToolRef={isUsingToolRef}
        isHidden={isHidden}
        onClose={onClose}
      />
      <Canvas
        currentTool={currentTool}
        setCurrentTool={setCurrentTool}
        isUsingToolRef={isUsingToolRef}
        isHidden={isHidden}
      />
    </div>
  );
}
