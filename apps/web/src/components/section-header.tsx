import {
  animationStyle,
  REVEAL_STAGGER_MS,
  riseIn,
} from "@/lib/motion-sequence";

type SectionHeaderProps = {
  id: string;
  title: string;
  description?: string;
};

// Title and intro for a landing section. Pass `id` to the section's
// aria-labelledby. Render it inside a PlayOnView so its entrance waits.
export function SectionHeader({ id, title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:items-center md:text-center">
      <h2
        id={id}
        className="font-secondary md:text-4xl-plus text-2xl font-medium"
        style={animationStyle(riseIn(0))}
      >
        {title}
      </h2>
      {description && (
        <p style={animationStyle(riseIn(REVEAL_STAGGER_MS))}>{description}</p>
      )}
    </div>
  );
}
