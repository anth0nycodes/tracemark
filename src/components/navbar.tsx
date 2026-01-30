import Link from "next/link";

export function Navbar() {
  return (
    <div className="w-full p-5 md:px-12 sm:py-6">
      <Link href="/">
        <img src="/tracemark-logo.png" alt="tracemark logo" />
      </Link>
    </div>
  );
}
