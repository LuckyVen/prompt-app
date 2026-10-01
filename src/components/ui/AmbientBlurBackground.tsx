type AmbientBlurBackgroundProps = {
  className?: string;
};

export default function AmbientBlurBackground({
  className = "",
}: AmbientBlurBackgroundProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Base dark gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,92,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(90,74,220,0.14),transparent_28%)]" />

      {/* Top-left purple glow */}
      <div className="absolute -left-24 -top-20 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

      {/* Mid-left indigo blur */}
      <div className="absolute left-10 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* Bottom-right purple glow */}
      <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl" />

      {/* Soft center haze */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[140px]" />
    </div>
  );
}