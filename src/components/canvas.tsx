import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ToolbarStates } from "@/App";

function setupCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null
) {
  const dpr = window.devicePixelRatio || 1;

  // Get the size of the canvas in CSS pixels
  const rect = canvas.getBoundingClientRect(); // grabs more accurate fractional values since the canvas is within a container
  const cssWidth = rect.width;
  const cssHeight = rect.height;

  // Set the actual canvas pixel dimensions to the CSS size * devicePixelRatio
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  // Set the canvas display size back to the original CSS size
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  if (!ctx) return;

  // Scale all drawing operations by the dpr
  ctx.scale(dpr, dpr);
  return ctx;
}

export function Canvas({ currentTool }: { currentTool: ToolbarStates }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCurrentMousePosition = (e: MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    return { x: offsetX, y: offsetY };
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCurrentMousePosition(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const { x, y } = getCurrentMousePosition(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (currentTool === "Draw") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "red"; // these drawing propeties are hardcoded, can set up later with color picker and other options
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === "Erase") {
      const eraserBrushSize = 30; // hardcoded for now, can set later
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, eraserBrushSize, 0, Math.PI * 2, false);
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    setupCanvas(canvas, ctx);
  }, []);

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      ref={canvasRef}
      className="pointer-events-auto fixed top-0 left-0 z-2147483646 h-screen w-screen"
    />
  );
}
