import { Hero } from "@/components/hero";
import { Waitlist } from "@/components/waitlist";

export default function Landing() {
  return (
    <div className="font-regesto-grotesk flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div>
        <img
          className="border-border rounded-xl border-2"
          src="/tracemark-preview.png"
          alt="tracemark preview image"
        />
      </div>
      <div className="flex flex-col items-center gap-10">
        <Hero />
        <Waitlist />
      </div>
    </div>
  );
}
