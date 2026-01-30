import { Badge } from "./ui/badge";

export function Hero() {
  return (
    <div className="flex flex-col gap-2 items-center text-center max-w-2xl w-full">
      <Badge className="bg-[#EFFF9D] text-sm font-medium text-foreground">
        Coming Soon
      </Badge>
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl font-medium">
          The only markup tool you need.
        </span>
        <p className="text-muted-foreground text-xl">
          Annotate any website. Mark up your screen, then copy or export the
          viewport or full page.
        </p>
      </div>
    </div>
  );
}
