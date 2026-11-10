"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PlayOnViewProps = {
  children: ReactNode;
  className?: string;
};

// How much of the element must be visible before its sequence starts
const VISIBLE_THRESHOLD = 0.5;

/*
 * Holds every animation inside it paused (see `data-waiting` in
 * globals.css) until the element is mostly on screen, then plays them once.
 */
export function PlayOnView({ children, className }: PlayOnViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsInView(true);
        observer.disconnect();
      },
      { threshold: VISIBLE_THRESHOLD }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-motion-sequence
      data-waiting={isInView ? undefined : ""}
      className={className}
    >
      {children}
    </div>
  );
}
