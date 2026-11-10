import {
  animationStyle,
  popIn,
  REVEAL_STAGGER_MS,
  riseIn,
} from "@/lib/motion-sequence";
import { AddToChromeButton } from "./add-to-chrome-button";
import { SquareGuy } from "./decor/characters";
import { HandDrawnStar } from "./decor/hand-drawn-star";
import { HeroMockup } from "./hero-mockup";

export function Hero() {
  return (
    // Plays on page load rather than on view: it's the first thing anyone sees,
    // and the headline shouldn't wait for JavaScript to show.
    <section
      data-motion-sequence
      className="grid items-center gap-8 py-10 md:grid-cols-2 md:gap-12 md:pt-24 md:pb-16"
    >
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1
            className="font-secondary text-3xl font-medium md:text-6xl"
            style={animationStyle(riseIn(0))}
          >
            The web is your canvas.
          </h1>
          <p
            className="max-w-md"
            style={animationStyle(riseIn(REVEAL_STAGGER_MS))}
          >
            Annotate any website. Mark up your screen, then copy or export the
            result as an image.
          </p>
        </div>
        <div style={animationStyle(riseIn(REVEAL_STAGGER_MS * 2))}>
          <AddToChromeButton label="Add to Chrome — It's Free" />
        </div>
      </div>
      <div
        className="relative"
        style={animationStyle(riseIn(REVEAL_STAGGER_MS * 2))}
      >
        {/* Standing on the browser window, worried about the critique below */}
        <SquareGuy
          aria-hidden
          lookX={-4}
          lookY={4}
          className="pointer-events-none absolute right-[14%] bottom-full -mb-1 w-12 origin-bottom md:w-16"
          // Hops onto the window once the mockup has landed
          style={animationStyle(popIn(700, 350))}
        />
        <HandDrawnStar
          aria-hidden
          className="pointer-events-none absolute -top-4 -left-2 w-8 -rotate-12 md:-top-5 md:-left-5 md:w-10"
          style={animationStyle(popIn(550, 300))}
        />
        <HeroMockup />
      </div>
    </section>
  );
}
