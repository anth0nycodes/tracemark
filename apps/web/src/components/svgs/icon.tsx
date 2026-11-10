import { SVGProps } from "react";

export function TracemarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g filter="url(#filter0_g_130_15)">
        <rect
          x="2.5"
          y="2.5"
          width="114.888"
          height="114.888"
          rx="28.472"
          fill="white"
          stroke="black"
        />
      </g>
      <path
        d="M40.5729 93.5892L80.5886 53.5784L67.0143 39.9924L27 79.9954L40.5729 93.5892Z"
        fill="#ECD434"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 89.8582V79.9954L40.5729 93.5892H30.9196L27 89.8582Z"
        fill="#DCB78C"
      />
      <path d="M27 93.5892H30.9196L27 89.8582V93.5892Z" fill="black" />
      <path
        d="M27 89.8582V79.9954L67.0143 39.9924L80.5886 53.5784L40.5729 93.5892H30.9196M27 79.9954L40.5729 93.5892M30.9196 93.5892H27V89.8582M30.9196 93.5892L27 89.8582"
        stroke="black"
      />
      <path
        d="M84.3594 49.75C84.3594 49.75 93.4925 42.038 93.4925 40.5883C93.4925 39.1386 81.3572 26.7721 80.1353 26.9458C78.9134 27.1194 70.8024 36.2215 70.8024 36.2215L84.3594 49.75Z"
        fill="#E691D2"
        stroke="black"
        strokeWidth="0.929765"
      />
      <defs>
        <filter
          id="filter0_g_130_15"
          x="0"
          y="0"
          width="119.888"
          height="119.888"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1190476268529892 0.1190476268529892"
            numOctaves="3"
            seed="5213"
          />
          <feDisplacementMap
            in="shape"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedImage"
            width="100%"
            height="100%"
          />
          <feMerge result="effect1_texture_130_15">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
