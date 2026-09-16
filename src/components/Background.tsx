/**
 * Fixed, full-page background: a deep navy → blue gradient with two soft glow
 * blobs. Pure CSS (no JS/scroll listeners) so it's rock-solid under static
 * export and sits behind every section. Refines the original blue theme.
 */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 70% -10%, rgba(14,165,233,0.18), transparent 60%)," +
            "radial-gradient(1000px 700px at 10% 110%, rgba(37,99,235,0.16), transparent 60%)," +
            "linear-gradient(180deg, #020617 0%, #030b26 40%, #020617 100%)",
        }}
      />
    </div>
  );
}
