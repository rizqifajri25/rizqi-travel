import { motion } from "framer-motion";

export default function Hero({ onCta }) {
  return (
    <section id="top" className="pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Trusted Travel Service
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Layanan <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Haji</span>{" "}
            dan <span className="bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Umroh</span> modern
          </h1>

          <p className="mt-4 text-slate-300">
            Mari percayakan ibadah dan perjalanan Anda bersama Rizqi Travel. Rapi, nyaman, dan transparan.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onCta}
              className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-medium text-slate-950 shadow-soft hover:opacity-90"
            >
              Yuk Berangkat!
            </button>
            <a
              href="#services"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium hover:bg-white/10"
            >
              Lihat Paket
            </a>
          </div>

          <div className="mt-8 flex gap-6 text-sm text-slate-300">
            <div>
              <div className="text-white font-semibold">100+</div>
              <div>Jamaah puas</div>
            </div>
            <div>
              <div className="text-white font-semibold">24/7</div>
              <div>Support</div>
            </div>
            <div>
              <div className="text-white font-semibold">Aman</div>
              <div>Terpercaya</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-400/20 to-indigo-500/20 blur-2xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 p-[1px]">
              <div className="rounded-2xl bg-slate-950 p-5">
                <div className="text-sm text-slate-300">Highlight</div>
                <div className="mt-2 text-xl font-semibold">Perjalanan nyaman, rencana jelas.</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">Hotel pilihan</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">Guide profesional</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">Itinerary rapi</div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">Harga transparan</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
