import { Button } from "@/components/ui/button";
import { CHROME_STORE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AddToChromeButtonProps = {
  label?: string;
  className?: string;
};

export function AddToChromeButton({
  label = "Add to Chrome",
  className,
}: AddToChromeButtonProps) {
  const href = CHROME_STORE_URL.trim();

  if (!href) {
    return (
      <Button type="button" disabled className={className}>
        {label}
      </Button>
    );
  }

  return (
    <Button asChild className={cn(className)}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </Button>
  );
}
