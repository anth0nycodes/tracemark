import Link from "next/link";
import { TracemarkLogo } from "./svgs/logo-mark";

export function Navbar() {
  return (
    // The border spans the full width; the contents line up with the page.
    // No button here: the hero's Add to Chrome is the page's one main action.
    <header className="border-border w-full border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Tracemark home">
          <TracemarkLogo aria-hidden className="h-8 w-auto sm:h-9" />
        </Link>
      </div>
    </header>
  );
}
