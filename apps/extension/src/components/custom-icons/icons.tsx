import type { SVGProps } from "react";

export function Line(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="var(--color-foreground)"
        fillRule="evenodd"
        d="M19 5 a.5.5 0 0 1 0 .708 l-14 14 a.5.5 0 0 1-.708-.708 l14-14 a.5.5 0 0 1 .708 0"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Text(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.67}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3.33337 16.6667H5.83337" />
      <path d="M11.6666 16.6667H17.5" />
      <path d="M5.75 12.5H11.5" />
      <path d="M8.5 5.25L13.3333 16.6667" />
      <path d="M4.16663 16.6666L9.16663 3.33325H10.8333L16.6666 16.6666" />
    </svg>
  );
}

// Add new custom-icon components to this tuple to grow the union.
type CustomIcons = [typeof Line, typeof Text];
export type CustomIcon = CustomIcons[number];
