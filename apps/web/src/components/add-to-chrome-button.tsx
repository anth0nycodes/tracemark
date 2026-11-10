import { CHROME_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AddToChromeButtonProps = {
  label?: string;
  className?: string;
};

// A link styled as a button: it navigates to the Chrome Web Store.
export function AddToChromeButton({
  label = "Add to Chrome",
  className,
}: AddToChromeButtonProps) {
  return (
    <a
      href={CHROME_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "font-secondary bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:outline-primary inline-flex items-center justify-center rounded-full px-4 py-2 text-base whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className
      )}
    >
      {label}
    </a>
  );
}
