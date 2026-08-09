import { useColor } from "@/context/toolbar/color/use-color";

export function ColorPicker() {
  const { color, setColor } = useColor();

  return (
    <div className="size-11 p-1.5">
      <div
        className="flex size-full items-center justify-center rounded-full p-[3px]"
        style={{
          background:
            "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="size-full cursor-pointer appearance-none overflow-hidden rounded-full p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0"
        />
      </div>
    </div>
  );
}
