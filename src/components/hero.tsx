import { Badge } from "./ui/badge";

export function Hero() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-2 text-center">
      <Badge className="text-foreground bg-[#ECD434] text-sm font-bold">
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
