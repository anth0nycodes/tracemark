import { Cta } from "@/components/cta";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features/features";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";

export default function Landing() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <Hero />
      <Features />
      <Testimonials />
      <Faq />
      <Cta />
    </main>
  );
}
