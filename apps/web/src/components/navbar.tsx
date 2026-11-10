import Link from "next/link";
import { AddToChromeButton } from "./add-to-chrome-button";
import { TracemarkLogo } from "./svgs/logo";

export function Navbar() {
  return (
    <header className="border-border flex w-full items-center justify-between border-b px-4 py-3 sm:px-5">
      <Link href="/" aria-label="Tracemark home">
        <TracemarkLogo className="h-7 w-auto sm:h-8" />
      </Link>
      <AddToChromeButton />
    </header>
  );
}
