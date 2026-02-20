export default function Modal({ open, title, children, onClose, size = "lg" }) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-3xl",
    "2xl": "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close modal backdrop" />

      {/* container */}
      <div className="relative mx-auto mt-16 w-full px-4">
        <div
          className={[
            "mx-auto w-full",
            sizes[size] || sizes.lg,
          ].join(" ")}
        >
          <div className="rounded-3xl border border-white/10 bg-slate-950 shadow-soft">
            {/* header */}
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div className="text-xl font-semibold">{title}</div>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* body (scrollable) */}
            <div className="max-h-[80vh] overflow-auto px-5 py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}