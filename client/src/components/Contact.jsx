export default function Contact() {
  return (
    <section id="contact" className="mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-2xl font-semibold">Contact Us</h2>

            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div>
                <div className="font-semibold text-white">Location</div>
                Jalan Keluyuran No.119, Palembang, Sumatera Selatan 30114
              </div>
              <div>
                <div className="font-semibold text-white">Mobile Phone</div>
                (+62) 821-1234-1234
              </div>
              <div>
                <div className="font-semibold text-white">Instagram</div>
                @rizqi_travel
              </div>
              <div>
                <div className="font-semibold text-white">Email</div>
                rizqitravel@gmail.com
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-sky-400/10 to-indigo-500/10 p-6 shadow-soft">
            <div className="text-sm text-slate-300">Jam operasional</div>
            <div className="mt-2 text-xl font-semibold">Setiap hari • 08:00 - 21:00</div>
            <p className="mt-3 text-slate-300">
              Konsultasi gratis untuk paket Haji, Umroh, dan Tour. Admin respons cepat.
            </p>
          </div>
        </div>

        <footer className="mt-10 border-t border-white/10 py-8 text-center text-sm text-slate-400">
          © 2026 RizqiTravel.com
        </footer>
      </div>
    </section>
  );
}
