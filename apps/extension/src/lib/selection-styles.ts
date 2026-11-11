import { InteractiveFabricObject, IText } from "fabric";

const SELECTION_BLUE = "#3B82F6";

/**
 * Overrides Fabric's default selection look (pale blue hairline, hollow square
 * corners) with a bolder border and solid white circular handles.
 *
 * @remarks
 * Fabric copies these class defaults onto each object in its constructor, so
 * this must run before any object is created. Objects rebuilt by undo/redo
 * pick them up too, since none of these props are serialized.
 */
export function applySelectionStyles() {
  InteractiveFabricObject.ownDefaults = {
    ...InteractiveFabricObject.ownDefaults,
    borderColor: SELECTION_BLUE,
    borderScaleFactor: 1.5,
    // breathing room so the border doesn't sit right on top of thin strokes
    padding: 4,
    cornerStyle: "circle",
    cornerSize: 10,
    // white fill + blue outline stays visible on both light and dark pages
    transparentCorners: false,
    cornerColor: "#FFFFFF",
    cornerStrokeColor: SELECTION_BLUE,
  };

  // IText swaps to this border color while typing
  IText.ownDefaults = {
    ...IText.ownDefaults,
    editingBorderColor: "rgba(59, 130, 246, 0.5)",
  };
}

// Drag-to-select marquee on the canvas itself
export const canvasSelectionOptions = {
  selectionColor: "rgba(59, 130, 246, 0.08)",
  selectionBorderColor: SELECTION_BLUE,
  selectionLineWidth: 1,
};
