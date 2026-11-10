"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type Ref,
} from "react";

type PlayOnViewProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "section" | "footer";
  // How much of the element must be visible before it plays
  threshold?: number;
  // Shrinks the viewport for the check, e.g. "0px 0px -15% 0px" plays once
  // the element's top passes 85% of the screen. Use with threshold 0 for
  // sections that can be taller than the screen.
  rootMargin?: string;
};

/*
 * Holds every animation inside it paused (see `data-waiting` in
 * globals.css) until it scrolls into view, then plays them once.
 */
export function PlayOnView({
  as: Element = "div",
  threshold = 0.5,
  rootMargin,
  children,
  ...elementProps
}: PlayOnViewProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <Element
      ref={elementRef as Ref<HTMLDivElement>}
      data-motion-sequence
      data-waiting={isInView ? undefined : ""}
      {...elementProps}
    >
      {children}
    </Element>
  );
}
