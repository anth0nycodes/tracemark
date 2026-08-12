import { AddToChromeButton } from "@/components/add-to-chrome-button";
import { Hero } from "@/components/hero";
import { Waitlist } from "@/components/waitlist";

export default function Landing() {
  return (
    <div className="font-regesto-grotesk flex flex-col items-center justify-center gap-16 py-16">
      <div className="flex flex-col items-center justify-center gap-12">
        <div>
          <img
            className="border-border w-full max-w-160 rounded-xl border-2"
            src="/tracemark-preview.png"
            alt="tracemark preview image"
          />
        </div>
        <div className="flex flex-col items-center gap-8">
          <Hero />
          <AddToChromeButton
            label="Add to Chrome — It's Free"
            className="h-auto rounded-full px-8 py-4 text-lg font-bold"
          />
        </div>
      </div>
      <Waitlist />
    </div>
  );
}
