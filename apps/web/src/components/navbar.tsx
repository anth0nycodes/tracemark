import Link from "next/link";
import { AddToChromeButton } from "./add-to-chrome-button";
import { TracemarkLogo } from "./svgs/logo";

export function Navbar() {
  return (
    // The border spans the full width; the contents line up with the page
    <header className="border-border w-full border-b">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Tracemark home">
          <TracemarkLogo className="h-7 w-auto sm:h-8" />
        </Link>
        <AddToChromeButton />
      </div>
    </header>
  );
}
