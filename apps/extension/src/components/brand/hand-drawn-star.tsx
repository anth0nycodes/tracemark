import type { SVGProps } from "react";

// Copied from apps/web/src/components/decor/hand-drawn-star.tsx. Keep the two in sync.

const STICKER_FILTER_ID = "sticker-depth";

/*
 * Shading that makes a flat shape look like a slightly raised sticker: a soft
 * shade inside the bottom edge and a highlight inside the top edge. Defined
 * once per page (render it in the root layout) and shared by every star, so
 * the id isn't repeated.
 *
 * Each inset is the same trick: fill everything *outside* the shape, shift
 * that fill a little so it overlaps the shape's edge, blur it, then keep only
 * the part that lands inside the shape.
 */
export function StickerFilterDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0">
      <defs>
        <filter
          id={STICKER_FILTER_ID}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feFlood
            floodColor="#000000"
            floodOpacity="0.22"
            result="shadeColor"
          />
          <feComposite
            in="shadeColor"
            in2="SourceAlpha"
            operator="out"
            result="outsideShade"
          />
          <feOffset in="outsideShade" dy="-1.6" result="shiftedShade" />
          <feGaussianBlur
            in="shiftedShade"
            stdDeviation="0.9"
            result="blurredShade"
          />
          <feComposite
            in="blurredShade"
            in2="SourceAlpha"
            operator="in"
            result="innerShade"
          />

          <feFlood
            floodColor="#ffffff"
            floodOpacity="0.6"
            result="lightColor"
          />
          <feComposite
            in="lightColor"
            in2="SourceAlpha"
            operator="out"
            result="outsideLight"
          />
          <feOffset in="outsideLight" dy="1.2" result="shiftedLight" />
          <feGaussianBlur
            in="shiftedLight"
            stdDeviation="0.6"
            result="blurredLight"
          />
          <feComposite
            in="blurredLight"
            in2="SourceAlpha"
            operator="in"
            result="innerLight"
          />

          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerShade" />
            <feMergeNode in="innerLight" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// A hand-drawn star styled as a sticker: white die-cut outline plus inset
// shading from StickerFilterDefs. Decorative: render it aria-hidden.
export function HandDrawnStar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 22 21" fill="none" {...props}>
      <path
        d="M5.25542 12.5015C4.5003 11.7319 4.12608 11.0251 4.00112 10.9916C3.92243 10.9825 3.89741 10.9539 3.85444 10.9003C3.75235 10.7704 3.50902 10.5085 2.79074 9.97438C2.43515 9.7514 2.2309 9.63349 2.01808 9.40648C1.5061 8.86038 1.09049 8.42368 1.01988 8.23727C0.988641 8.15482 0.989267 8.08516 1.04093 8.04212C1.09259 7.99909 1.1924 7.98453 1.29665 7.97422C1.65083 7.93916 1.80543 7.89213 2.05288 7.83793C2.2643 7.79162 2.44226 7.76884 2.79374 7.73858C3.69697 7.66082 4.14375 7.5057 4.58544 7.40063C4.95276 7.31326 5.5749 7.27862 6.2011 7.25462C6.46496 7.24451 6.55457 7.23435 6.64506 7.19177C6.88164 7.08046 7.37622 6.96455 7.99668 6.20042C8.24165 5.89873 8.67794 5.34231 9.07592 4.7396C9.16348 4.607 9.29991 4.42342 9.41044 4.07421C9.5447 3.65002 9.6579 3.25358 9.751 2.99427C9.80509 2.84363 9.83284 2.60131 9.97599 2.27696C10.2165 1.73195 10.3499 1.46427 10.5183 1.336C10.7303 1.17449 11.12 0.887925 11.3446 1.04808C11.3818 1.07461 11.4019 1.11052 11.4266 1.1461C11.5264 1.28925 11.631 1.41482 11.6802 1.57469C11.7354 1.75402 12.0831 2.40785 12.5198 3.14369C12.6917 3.43332 12.8557 3.67136 12.9694 3.87639C13.0736 4.06428 13.1475 4.46207 13.3651 4.89578C13.6307 5.42525 14.1522 6.1425 14.528 6.33321C14.7615 6.45165 14.9632 6.44057 15.8762 6.61146C16.5544 6.73841 16.9548 6.82411 17.1073 6.84622C17.3865 6.88667 17.7859 6.92779 18.1799 6.99927C18.4827 7.0542 18.8883 7.10001 19.3815 7.35807C20.2953 7.83626 20.7576 7.81671 20.8307 8.11664C20.8488 8.19135 20.8352 8.27459 20.7779 8.33904C20.7039 8.42227 20.6244 8.48954 20.5594 8.54855C20.3861 8.7059 20.1616 8.95501 19.725 9.48526C19.5715 9.67182 19.4452 9.79147 18.8533 10.3794C18.3214 10.9078 17.3502 11.8789 16.8681 12.3857C16.3914 12.8868 16.3929 12.9326 16.3965 13.0475L16.3966 13.0514C16.4003 13.1693 16.4007 13.358 16.4569 13.8382C16.5131 14.3183 16.6217 15.0671 16.7023 15.8536C16.7829 16.6402 16.813 17.443 16.9034 18.0661C17.0579 19.1303 17.1989 19.7115 17.1108 19.7075C16.8301 19.695 16.4305 19.6216 16.1669 19.4636C15.9998 19.3635 15.5777 19.156 14.9375 18.9145C14.6215 18.7953 14.3185 18.6932 13.8228 18.4402C13.327 18.1873 12.6692 17.7745 12.1813 17.5452C11.425 17.1897 11.0739 17.0443 10.8908 17.0772C10.6078 17.1279 10.1785 17.2364 9.53386 17.5005C9.13405 17.6642 8.59526 17.8875 8.22779 18.0834C7.64496 18.3942 7.35407 18.5675 6.82454 18.7465C6.38002 18.8968 5.59693 19.1527 5.20538 19.243C4.81384 19.3333 4.81384 19.2602 4.8209 19.1895C4.82797 19.1189 4.84168 19.0528 4.8521 18.5881C4.86252 18.1234 4.86945 17.2855 4.92312 16.5802C4.9768 15.8749 5.05823 15.315 5.182 14.8543C5.40429 14.0268 5.59095 13.4825 5.61564 13.1788C5.62988 13.0037 5.60862 12.9085 5.55995 12.8419C5.51173 12.7759 5.44816 12.6979 5.25542 12.5015Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${STICKER_FILTER_ID})`}
        className="fill-brand-yellow stroke-white"
      />
    </svg>
  );
}
