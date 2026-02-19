export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mx-auto mt-24 w-full max-w-xl px-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="text-xl font-semibold">{title}</div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
