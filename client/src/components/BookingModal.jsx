import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import toast from "react-hot-toast";

export default function BookingModal({ open, onClose, pkg }) {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setFullName("");
      setPhone("");
      setDepartureDate("");
      setNotes("");
    }
  }, [open]);

  if (!open || !pkg) return null;

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/bookings", {
        packageId: pkg.id,
        fullName,
        phone,
        departureDate,
        notes,
      });
      toast.success("Booking berhasil! Admin akan menghubungi Anda.");
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* panel */}
      <div className="relative mx-auto mt-24 w-full max-w-lg px-4">
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-300">Booking</div>
              <div className="text-xl font-semibold">{pkg.title}</div>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <form onSubmit={submit} className="mt-5 grid gap-3">
            <div>
              <label className="text-sm text-slate-300">Nama lengkap</label>
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400/60"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="contoh: Rizqi Fajri"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">No. HP</label>
              <input
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400/60"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="contoh: 0821xxxxxxx"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Tanggal berangkat</label>
              <input
                type="date"
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400/60"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Catatan (opsional)</label>
              <textarea
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-sky-400/60"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="contoh: ingin kamar dekat lift"
                rows={3}
              />
            </div>

            <button
              disabled={loading}
              className="mt-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Mengirim..." : "Kirim Booking"}
            </button>

            <div className="text-xs text-slate-400">
              Dengan mengirim booking, Anda setuju untuk dihubungi admin.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
