import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CHROME_STORE_REVIEWS_URL } from "@/lib/constants";
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
    name: "Runbo Li",
    avatarSrc: "/testimonials/runbo-li.png",
    quote:
      "Tracemark is really helpful for quickly communicating changes related to product design. It saves me time from using GPT image to create mock-ups and skips all of the iteration. So I can just indicate exactly what I want the way I want it. It's a useful collaboration tool I recommend for any team that does a lot of design iteration.",
  },
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

      {/*
        Three across on large screens; on tablets two per row with the third
        centered below
      */}
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4">
        {TESTIMONIALS.map((testimonial, testimonialIndex) => (
          <figure
            key={testimonial.name}
            className="border-border flex w-full flex-col justify-between gap-4 rounded-2xl border bg-white p-5 md:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
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

      {/* Secondary on purpose: the hero's Add to Chrome is the main action */}
      <a
        href={CHROME_STORE_REVIEWS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border hover:bg-secondary-background focus-visible:outline-primary font-secondary mx-auto inline-flex items-center gap-1.5 rounded-full border bg-white px-5 py-2.5 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        style={animationStyle(
          riseIn(
            SECTION_CONTENT_DELAY_MS + TESTIMONIALS.length * REVEAL_STAGGER_MS
          )
        )}
      >
        View all reviews
        <ArrowUpRight aria-hidden className="size-4" />
        <span className="sr-only">
          (opens the Chrome Web Store in a new tab)
        </span>
      </a>
    </PlayOnView>
  );
}
