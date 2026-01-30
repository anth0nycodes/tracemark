import { Hero } from "@/components/hero";
import { Waitlist } from "@/components/waitlist";

export default function Landing() {
  return (
    <div className="font-regesto-grotesk flex flex-col pt-16 justify-center items-center gap-12">
      <div>
        <img
          className="border-border border-2 rounded-xl"
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
