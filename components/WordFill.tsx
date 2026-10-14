import type { CSSProperties } from "react";

type WordFillProps = {
  text: string;
  className?: string;
};

// Words start faint and fill to full ink as the paragraph scrolls through the viewport.
// The sentence stays real text for screen readers in a visually hidden span.
export default function WordFill({ text, className = "" }: WordFillProps) {
  const words = text.split(" ");
  return (
    <p className={className} data-sd="words">
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="sd-word"
          style={{ "--i": index, "--n": words.length } as CSSProperties}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
