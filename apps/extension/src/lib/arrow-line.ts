import {
  classRegistry,
  Control,
  controlsUtils,
  Point,
  Polyline,
  type TPointerEvent,
  type Transform,
  type XY,
} from "fabric";
import type { LineStyle } from "@/context/toolbar/line-popover/constants";

const ARROW_HEAD_LENGTH = 16;
// Angle between the shaft and each wing of the arrowhead (30deg)
const ARROW_HEAD_ANGLE = Math.PI / 6;

type Endpoint = "start" | "end";

// Where the shaft's two ends live in each style's points array (see
// getLinePoints for the layouts)
const ENDPOINT_INDICES: Record<LineStyle, Record<Endpoint, number>> = {
  Line: { start: 0, end: 1 },
  Arrow: { start: 0, end: 1 },
  DoubleArrow: { start: 1, end: 4 },
};

// The two wing endpoints of an arrowhead whose tip sits at `tip`, pointing
// away from `tail`
function getArrowHeadWings(tip: XY, tail: XY): [XY, XY] {
  const shaftAngle = Math.atan2(tip.y - tail.y, tip.x - tail.x);
  // Cap the head at half the shaft so short arrows don't turn into a blob
  const headLength = Math.min(
    ARROW_HEAD_LENGTH,
    Math.hypot(tip.x - tail.x, tip.y - tail.y) / 2
  );
  const wingAt = (angleOffset: number) => ({
    x: tip.x - headLength * Math.cos(shaftAngle + angleOffset),
    y: tip.y - headLength * Math.sin(shaftAngle + angleOffset),
  });
  return [wingAt(ARROW_HEAD_ANGLE), wingAt(-ARROW_HEAD_ANGLE)];
}

// Arrowheads are drawn by retracing the polyline out to each wing and back to
// the tip, so every style stays a single Polyline object
function getLinePoints(lineStyle: LineStyle, start: XY, end: XY): XY[] {
  if (lineStyle === "Line") return [start, end];

  const [endWingA, endWingB] = getArrowHeadWings(end, start);
  if (lineStyle === "Arrow") return [start, end, endWingA, end, endWingB];

  const [startWingA, startWingB] = getArrowHeadWings(start, end);
  return [startWingA, start, startWingB, start, end, endWingA, end, endWingB];
}

function createEndpointControl(endpoint: Endpoint) {
  const otherEndpoint: Endpoint = endpoint === "start" ? "end" : "start";

  return new Control({
    actionName: "modifyPoly",
    cursorStyle: "pointer",
    // Reuse Fabric's poly helper to place the handle on the endpoint's point.
    // The index is looked up per render since it depends on the line style
    positionHandler: (dimensions, finalMatrix, fabricObject) => {
      const line = fabricObject as ArrowLine;
      const pointIndex = ENDPOINT_INDICES[line.lineStyle][endpoint];
      return controlsUtils.createPolyPositionHandler(pointIndex)(
        dimensions,
        finalMatrix,
        line
      );
    },
    actionHandler: controlsUtils.wrapWithFireEvent(
      "modifyPoly",
      (
        _eventData: TPointerEvent,
        transform: Transform,
        x: number,
        y: number
      ) => {
        const line = transform.target as ArrowLine;
        const draggedPoint = new Point(x, y);
        const anchoredPoint = line.getEndpoint(otherEndpoint);
        if (endpoint === "start") {
          line.setEndpoints(draggedPoint, anchoredPoint);
        } else {
          line.setEndpoints(anchoredPoint, draggedPoint);
        }
        return true;
      }
    ),
  });
}

type ArrowLineOptions = ConstructorParameters<typeof Polyline>[1] & {
  lineStyle: LineStyle;
};

/**
 * A line/arrow that's resized by dragging its two endpoints instead of
 * scaling a bounding box, so the arrowheads keep a fixed size at any length.
 *
 * @remarks
 * Registered with Fabric's classRegistry so undo/redo (which round-trips the
 * canvas through JSON) rebuilds it as an ArrowLine with these controls,
 * rather than as a plain Polyline with the default scale handles.
 */
export class ArrowLine extends Polyline {
  static override type = "ArrowLine";
  // Serialized alongside the points so a reloaded line knows its layout
  static override customProperties = ["lineStyle"];

  declare lineStyle: LineStyle;

  // Points-based signature matches Polyline so Fabric's fromObject (used by
  // undo/redo) can rebuild it; create new lines with fromEndpoints instead
  constructor(points: XY[], options: ArrowLineOptions) {
    super(points, {
      // only the endpoint handles mean anything for a line; a bounding box
      // around a diagonal line is mostly empty space
      hasBorders: false,
      ...options,
    });
  }

  static fromEndpoints(start: XY, end: XY, options: ArrowLineOptions) {
    return new ArrowLine(getLinePoints(options.lineStyle, start, end), options);
  }

  static override createControls() {
    return {
      controls: {
        start: createEndpointControl("start"),
        end: createEndpointControl("end"),
      },
    };
  }

  /** An endpoint of the shaft, in the canvas (parent) plane */
  getEndpoint(endpoint: Endpoint): Point {
    const pointIndex = ENDPOINT_INDICES[this.lineStyle][endpoint];
    return new Point(this.points[pointIndex])
      .subtract(this.pathOffset)
      .transform(this.calcOwnMatrix());
  }

  /**
   * Rebuilds the points from two endpoints given in the canvas plane.
   * Any rotation/scale picked up from a multi-selection is baked into the new
   * points, so the transform is reset to identity.
   */
  setEndpoints(start: XY, end: XY) {
    this.set({
      angle: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false,
      points: getLinePoints(this.lineStyle, start, end),
    });
    // recompute bounding box/pathOffset after mutating points, otherwise
    // controls + hit area stay stale
    this.setBoundingBox(true);
    this.set("dirty", true);
  }
}

classRegistry.setClass(ArrowLine);
