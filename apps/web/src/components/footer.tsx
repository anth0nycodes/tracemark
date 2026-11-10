import Link from "next/link";
import {
  animationStyle,
  REVEAL_STAGGER_MS,
  riseIn,
} from "@/lib/motion-sequence";
import { PlayOnView } from "./play-on-view";
import { TracemarkWordmark } from "./svgs/wordmark";

const LINK_CLASS_NAME =
  "text-muted-foreground hover:text-foreground transition-colors";

export function Footer() {
  return (
    // overflow-clip: the entrance slides items up from 16px lower. Without
    // clipping, the wordmark at the very bottom would briefly make the page
    // taller, so the page height and scroll position jump as it settles.
    <PlayOnView
      as="footer"
      threshold={0.3}
      className="border-border mt-auto flex flex-col items-center gap-3 overflow-clip border-t px-4 pt-8 text-sm"
    >
      <p className="text-muted-foreground" style={animationStyle(riseIn(0))}>
        Made with ❤️ by{" "}
        <a
          href="https://github.com/anth0nycodes"
          className="text-foreground hover:text-foreground-hover transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          anth0nycodes
        </a>
      </p>
      <nav
        aria-label="Footer"
        className="flex gap-4"
        style={animationStyle(riseIn(REVEAL_STAGGER_MS))}
      >
        <a href="mailto:hoanganthony2207@gmail.com" className={LINK_CLASS_NAME}>
          Contact
        </a>
        <Link href="/privacy" className={LINK_CLASS_NAME}>
          Privacy
        </Link>
        <a
          href="https://github.com/anth0nycodes/tracemark"
          className={LINK_CLASS_NAME}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </nav>
      {/* Oversized wordmark that fades out toward the bottom of the page */}
      <div
        aria-hidden
        className="mt-4 w-72 md:w-96"
        style={animationStyle(riseIn(REVEAL_STAGGER_MS * 2))}
      >
        <TracemarkWordmark className="text-foreground w-full [mask-image:linear-gradient(to_bottom,black_20%,transparent)]" />
      </div>
    </PlayOnView>
  );
}
