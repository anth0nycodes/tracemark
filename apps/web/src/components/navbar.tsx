import Link from "next/link";
import { AddToChromeButton } from "./add-to-chrome-button";
import { TracemarkLogo } from "./svgs/logo";

export function Navbar() {
  return (
    <div className="flex w-full items-center justify-between py-5 sm:py-6 md:px-12">
      <Link href="/">
        <TracemarkLogo width={175} height={39} />
      </Link>
      <AddToChromeButton className="rounded-full font-bold" />
    </div>
  );
}
