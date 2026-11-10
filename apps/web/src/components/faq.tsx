import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  animationStyle,
  riseIn,
  SECTION_CONTENT_DELAY_MS,
  SECTION_TRIGGER,
} from "@/lib/motion-sequence";
import { PlayOnView } from "./play-on-view";
import { SectionHeader } from "./section-header";

function Keys({ children }: { children: ReactNode }) {
  return (
    // Shorter than a line of text (12px type, no line-height) so keycaps
    // don't bump into the lines above and below
    <kbd className="border-border bg-secondary-background mx-0.5 inline-block rounded-md border px-1.5 py-1 align-[0.1em] font-sans text-xs leading-none">
      {children}
    </kbd>
  );
}

const QUESTIONS: { question: string; answer: ReactNode }[] = [
  {
    question: "Is Tracemark free?",
    answer:
      "Yes. Tracemark is free to install and use, with no account or sign-up. It's also open source under the MIT license.",
  },
  {
    question: "Does Tracemark collect my data?",
    answer:
      "No. Everything runs in your browser, on the tab you open it on. Your drawings and captures are never uploaded anywhere.",
  },
  {
    question: "Are my drawings saved?",
    answer:
      "No. Drawings only last while the overlay is open, so copy or export before you close it or reload the page.",
  },
  {
    question: "Can I still use the page while drawing?",
    answer: (
      <>
        Yes. Switch to the Interact tool <Keys>I</Keys> to scroll and click the
        page with your drawings still on top. You can also hide the overlay with{" "}
        <Keys>⌘ .</Keys> on Mac or <Keys>Ctrl .</Keys> on Windows and Linux, and
        bring it back the same way.
      </>
    ),
  },
  {
    question: "How do I share my annotations?",
    answer: (
      <>
        Copy what&apos;s on screen, drawings included, to your clipboard with{" "}
        <Keys>⇧ C</Keys> or the Copy button, then paste it anywhere. Or use
        Export to save it as a PNG.
      </>
    ),
  },
];

export function Faq() {
  return (
    <PlayOnView
      as="section"
      {...SECTION_TRIGGER}
      aria-labelledby="faq-title"
      className="flex flex-col gap-10 py-16 md:py-24"
    >
      <SectionHeader id="faq-title" title="Frequently Asked Questions" />

      <div className="mx-auto w-full max-w-2xl">
        {QUESTIONS.map(({ question, answer }, questionIndex) => (
          // `name` makes these an exclusive accordion: opening one closes the rest
          <details
            key={question}
            name="faq"
            className="faq-item group border-border border-b"
            // A tighter stagger than cards: rows are short and close together
            style={animationStyle(
              riseIn(SECTION_CONTENT_DELAY_MS + questionIndex * 50)
            )}
          >
            <summary className="hover:text-foreground-hover flex cursor-pointer list-none items-center justify-between gap-4 py-4 transition-colors [&::-webkit-details-marker]:hidden">
              <span className="font-secondary text-base md:text-lg">
                {question}
              </span>
              <ChevronDown
                aria-hidden
                className="size-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <p className="text-muted-foreground pb-4 leading-relaxed">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </PlayOnView>
  );
}
