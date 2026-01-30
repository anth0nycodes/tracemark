import Link from "next/link";
import { TracemarkLogo } from "./svgs/logo";

export function Navbar() {
  return (
    <div className="w-full p-5 sm:py-6 md:px-12">
      <Link href="/">
        <TracemarkLogo width={175} height={39} />
      </Link>
    </div>
  );
}
