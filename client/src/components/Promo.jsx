import { useState } from "react";
import { api } from "../lib/api.js";
import toast from "react-hot-toast";

export default function Promo() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim()) return toast.error("Masukkan email dulu");
    try {
      setLoading(true);
      const res = await api.post("/subscribers", { email });
      toast.success(res?.data?.message || "Berhasil!");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal daftar promo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="promo" className="mt-16 border-y border-white/10 bg-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-2xl font-semibold">Dapatkan promo menarik sekarang!</h3>
            <p className="mt-2 text-slate-300">Masukkan email untuk info promo & jadwal keberangkatan terbaru.</p>
          </div>

          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400/60"
              placeholder="emailkamu@gmail.com"
            />
            <button
              onClick={submit}
              disabled={loading}
              className="shrink-0 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
