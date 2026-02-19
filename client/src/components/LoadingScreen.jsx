export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950">
      <div className="w-full max-w-sm px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500" />
            <div>
              <div className="text-lg font-semibold">Rizqi Travel</div>
              <div className="text-sm text-slate-300">Menyiapkan pengalaman terbaik…</div>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
}