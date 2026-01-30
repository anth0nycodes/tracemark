import Link from "next/link";

export function Navbar() {
  return (
    <div className="w-full px-12 py-6">
      <Link href="/">
        <img src="/tracemark-logo.png" alt="tracemark logo" />
      </Link>
    </div>
  );
}
