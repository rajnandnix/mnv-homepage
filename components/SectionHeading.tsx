type SectionHeadingProps = {
  id: string;
  lines: readonly string[];
  className?: string;
};

// First line light, second line bold; each line rises from behind a mask as it scrolls in.
export default function SectionHeading({ id, lines, className = "" }: SectionHeadingProps) {
  return (
    <h2 id={id} className={className}>
      <span className="sd-mask">
        <span className="sd-line font-light" data-sd="line">
          {lines[0]}
        </span>
      </span>{" "}
      <span className="sd-mask">
        <span className="sd-line font-bold" data-sd="line" style={{ "--i": 1 } as React.CSSProperties}>
          {lines[1]}
        </span>
      </span>
    </h2>
  );
}
