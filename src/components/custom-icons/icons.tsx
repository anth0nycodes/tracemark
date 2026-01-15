import type { SVGProps } from "react";

export function Line(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="var(--foreground)"
        fillRule="evenodd"
        d="M19 5 a.5.5 0 0 1 0 .708 l-14 14 a.5.5 0 0 1-.708-.708 l14-14 a.5.5 0 0 1 .708 0"
        clipRule="evenodd"
      />
    </svg>
  );
}

const icons = [Line] as const;
export type CustomIcon = (typeof icons)[number];
