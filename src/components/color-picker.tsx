import { useColor } from "@/context/color/use-color";

export function ColorPicker() {
  const { color, setColor } = useColor();

  return (
    <div style={{ width: "44px", height: "44px", padding: "6px" }}>
      <div
        className="flex items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
          padding: "3px",
          borderRadius: "100%",
          background:
            "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
        }}
      >
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            WebkitAppearance: "none",
            appearance: "none",
            borderRadius: "50%",
            overflow: "hidden",
            padding: 0,
          }}
          className="cursor-pointer [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:p-0"
        />
      </div>
    </div>
  );
}
