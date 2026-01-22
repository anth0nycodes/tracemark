import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ToolbarStates } from "@/App";

function setupCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null
) {
  const dpr = window.devicePixelRatio || 1;

  // Get the full document dimensions (not just viewport)
  const cssWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth
  );
  const cssHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight
  );

  // Set the actual canvas pixel dimensions to the CSS size * devicePixelRatio
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;

  // Set the canvas display size to cover the full document
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  if (!ctx) return;

  // Reset and scale all drawing operations by the dpr
  ctx.setTransform(1, 0, 0, 1, 0, 0); // this line fixes the case of cumulative dpr scaling because it resets the entire transformation (including scale) to identity
  ctx.scale(dpr, dpr);
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

    if (!ctx) return;

    const resize = () => {
      // Grabs the current canvas content, starting from (0, 0) to the full width & height
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      setupCanvas(canvas, ctx);

      // Persist the canvas content on resize
      if (imageData) {
        ctx.putImageData(imageData, 0, 0); // paints the imageData back starting at (0, 0)
      }
    };

    resize();

    // Watches for document size changes
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", stopDrawing);
    return () => window.removeEventListener("mouseup", stopDrawing);
  }, []);

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseDown={startDrawing}
      onMouseLeave={stopDrawing}
      ref={canvasRef}
      className="pointer-events-auto absolute top-0 left-0 z-2147483646 cursor-crosshair"
    />
  );
}
