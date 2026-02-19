import { formatIDR } from "../lib/money.js";

const typeMeta = {
  TOUR: { tag: "TOUR", accent: "from-amber-300 to-orange-500" },
  HAJI: { tag: "HAJI", accent: "from-emerald-300 to-teal-500" },
  UMROH: { tag: "UMROH", accent: "from-sky-300 to-indigo-500" },
};

export default function ServiceCard({ pkg, onBook }) {
  const meta = typeMeta[pkg.type] || typeMeta.TOUR;

  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft transition hover:-translate-y-1 hover:bg-white/10">
      <div className="flex items-center justify-between">
        <div className={`rounded-full bg-gradient-to-r ${meta.accent} px-3 py-1 text-xs font-semibold text-slate-950`}>
          {meta.tag}
        </div>
        <div className="text-sm text-slate-300">{pkg.durationDays} hari</div>
      </div>

      <h3 className="mt-4 text-lg font-semibold">{pkg.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm text-slate-300">{pkg.description}</p>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xs text-slate-400">Mulai dari</div>
          <div className="text-xl font-semibold">Rp {formatIDR(pkg.price)}</div>
        </div>

        <button
          onClick={() => onBook(pkg)}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10"
        >
          Pesan
        </button>
      </div>
    </div>
  );
}
