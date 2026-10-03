/**
 * The next-step field. It grows to fit its text so a long step is never cut off.
 * The wrapper mirrors the text in a hidden ::after (see .autogrow in globals.css),
 * which sizes the grid cell the textarea sits in.
 */
export function StepInput({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <span className={`autogrow ${className}`} data-value={value}>
      <textarea
        rows={1}
        aria-label="Next step"
        placeholder="What is the one next step?"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\n/g, " "))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      />
    </span>
  );
}
