import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";

const PRODUCT_HUNT_URL = "https://www.producthunt.com/products/tracemark";

type ProductHuntBadgeProps = {
  style?: CSSProperties;
};

// Our own badge instead of Product Hunt's embed, which shows the live vote
// count. Styled like the other secondary pill links on the page.
export function ProductHuntBadge({ style }: ProductHuntBadgeProps) {
  return (
    <a
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border hover:bg-secondary-background focus-visible:outline-primary font-secondary inline-flex items-center gap-2 self-center rounded-full border bg-white py-2 pr-5 pl-2.5 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      style={style}
    >
      {/* Product Hunt's "P" mark, from Simple Icons */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-6 shrink-0"
        fill="#FF6154"
      >
        <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z" />
      </svg>
      Find us on Product Hunt
      <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
