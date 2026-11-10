import { AddToChromeButton } from "./add-to-chrome-button";
import { HeroMockup } from "./hero-mockup";

export function Hero() {
  return (
    <section className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:py-16">
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="font-secondary text-3xl font-medium md:text-6xl">
            The web is your canvas.
          </h1>
          <p className="max-w-md">
            Annotate any website. Mark up your screen, then copy or export the
            result as an image.
          </p>
        </div>
        <AddToChromeButton label="Add to Chrome — It's Free" />
      </div>
      <HeroMockup />
    </section>
  );
}
