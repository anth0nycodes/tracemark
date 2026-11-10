import Image from "next/image";
import {
  animationStyle,
  REVEAL_STAGGER_MS,
  riseIn,
  SECTION_CONTENT_DELAY_MS,
  SECTION_TRIGGER,
} from "@/lib/motion-sequence";
import { HandDrawnStar } from "./decor/hand-drawn-star";
import { PlayOnView } from "./play-on-view";
import { SectionHeader } from "./section-header";

// Reviews and profile pictures from the Chrome Web Store listing. The
// pictures are saved locally rather than linked from Google, whose URLs
// change when someone updates their photo.
const TESTIMONIALS = [
  {
    name: "Simon Xu",
    avatarSrc: "/testimonials/simon-xu.png",
    quote:
      "I use this at my company every day, really helpful for providing context to engineers / agents.",
  },
  {
    name: "Andrew Miller",
    avatarSrc: "/testimonials/andrew-miller.png",
    quote:
      "Really helpful extension. I've been using it to give coding agents better context and for quick sketches. It's well made, and the shortcuts are intuitive. 10/10.",
  },
  {
    name: "retr0",
    avatarSrc: "/testimonials/retr0.png",
    quote: "easy to use and neat design!",
  },
];

// A slightly different tilt per star, so a row looks drawn by hand
const STAR_TILTS = [-8, 5, -3, 9, -5];

export function Testimonials() {
  return (
    <PlayOnView
      as="section"
      {...SECTION_TRIGGER}
      aria-labelledby="testimonials-title"
      className="flex flex-col gap-10 py-16 md:py-24"
    >
      <SectionHeader
        id="testimonials-title"
        title="From the people who use it"
        description="Here's what people have to say after annotating their first page."
      />

      {/* Two per row, with an odd card centered below */}
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4">
        {TESTIMONIALS.map((testimonial, testimonialIndex) => (
          <figure
            key={testimonial.name}
            className="border-border flex w-full flex-col justify-between gap-4 rounded-2xl border bg-white p-5 md:w-[calc(50%-0.5rem)]"
            style={animationStyle(
              riseIn(
                SECTION_CONTENT_DELAY_MS + testimonialIndex * REVEAL_STAGGER_MS
              )
            )}
          >
            <blockquote className="text-sm md:text-base">
              <p>&ldquo;{testimonial.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="flex items-center gap-3">
              {/* Decorative: the name is right next to it */}
              <Image
                src={testimonial.avatarSrc}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full"
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-secondary text-base font-medium">
                  {testimonial.name}
                </span>
                <span
                  role="img"
                  aria-label={`Rated ${STAR_TILTS.length} out of ${STAR_TILTS.length}`}
                  className="flex gap-0.5"
                >
                  {STAR_TILTS.map((tiltDegrees, starIndex) => (
                    <HandDrawnStar
                      key={starIndex}
                      aria-hidden
                      className="size-4"
                      style={{ rotate: `${tiltDegrees}deg` }}
                    />
                  ))}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </PlayOnView>
  );
}
