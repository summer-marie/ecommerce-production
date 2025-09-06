/**
 * WaveText: per-character wave/bounce text.
 * CSS: see .wave-text/.wave-char and @keyframes wave-bounce in index.css.
 * A11y: wrapper uses aria-label; char spans are aria-hidden; honors prefers-reduced-motion.
 * Props:
 *  - text (string, required) — spaces preserved.
 *  - className (string) — extra style classes.
 *  - delay (ms, default 80) — stagger between chars.
 *  - amplitude (px, default 8) — vertical travel.
 *  - duration (s, default 1.6) — cycle length.
 * Example: <WaveText text="More coming soon" className="berkshireSwashFont text-5xl" />
 */
export default function WaveText({
  text,
  className = "",
  delay = 80,
  amplitude = 8,
  duration = 1.6,
}) {
  // Robustly split into grapheme-like units. Array.from is acceptable here for simple ASCII.
  // If emoji/complex scripts are needed, consider a grapheme splitter library.
  const chars = Array.from(text ?? "");
  return (
    <div
      className={`wave-text ${className}`}
      role="text"
      aria-label={text}
      style={{
        // These CSS variables are consumed by .wave-text/.wave-char rules in index.css
        "--delay-step": `${delay}ms`,
        "--amplitude": `${amplitude}px`,
        "--wave-duration": `${duration}s`,
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="wave-char"
          aria-hidden="true"
          // `--i` provides each char's offset in the wave; see animation-delay calc in CSS
          style={{ "--i": i }}
        >
          {/* Preserve whitespace by using a non-breaking space for visual gaps */}
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}
