import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import toast from "react-hot-toast";
import { formatIDR } from "../lib/money.js";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal.jsx";

export default function Dashboard() {
  const nav = useNavigate();

  const [tab, setTab] = useState("packages"); // packages | bookings | subscribers

  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    type: "TOUR",
    title: "",
    description: "",
    price: 0,
    durationDays: 5,
    isActive: true,
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  async function loadPackages() {
    const res = await api.get("/packages/admin/all");
    setPackages(res.data.packages || []);
  }

  async function loadBookings() {
    const res = await api.get("/admin/bookings");
    setBookings(res.data.bookings || []);
  }

  async function loadSubscribers() {
    const res = await api.get("/admin/subscribers");
    setSubscribers(res.data.subscribers || []);
  }

    // ===== PROMOS =====
  const [promos, setPromos] = useState([]);

  const [promoCreate, setPromoCreate] = useState({
    title: "",
    description: "",
    terms: "",
    validFrom: "",
    validTo: "",
    ctaText: "Klaim Promo via WhatsApp",
    isActive: true,
  });

  const [promoEditOpen, setPromoEditOpen] = useState(false);
  const [promoEdit, setPromoEdit] = useState(null);

  async function loadPromos() {
    const res = await api.get("/promos/admin/all");
    setPromos(res.data.promos || []);
  }

  async function addPromo(e) {
    e.preventDefault();
    try {
      await api.post("/promos", promoCreate);
      toast.success("Promo dibuat");
      setPromoCreate({
        title: "",
        description: "",
        terms: "",
        validFrom: "",
        validTo: "",
        ctaText: "Klaim Promo via WhatsApp",
        isActive: true,
      });
      await loadPromos();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal membuat promo");
    }
  }

  function openEditPromo(p) {
    setPromoEdit({
      id: p.id,
      title: p.title || "",
      description: p.description || "",
      terms: p.terms || "",
      validFrom: p.validFrom || "",
      validTo: p.validTo || "",
      ctaText: p.ctaText || "Klaim Promo via WhatsApp",
      isActive: !!p.isActive,
    });
    setPromoEditOpen(true);
  }

  async function savePromoEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/promos/${promoEdit.id}`, promoEdit);
      toast.success("Promo diupdate");
      setPromoEditOpen(false);
      await loadPromos();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal update promo");
    }
  }

  async function togglePromo(id) {
    try {
      await api.patch(`/promos/${id}/toggle`);
      toast.success("Status promo diubah");
      await loadPromos();
      // update state modal biar label tombol langsung berubah
      setPromoEdit((p) => (p && p.id === id ? { ...p, isActive: !p.isActive } : p));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal toggle promo");
    }
  }

  async function deletePromo(id) {
    const ok = confirm("Hapus promo ini?");
    if (!ok) return;

    try {
      await api.delete(`/promos/${id}`);
      toast.success("Promo dihapus");
      setPromoEditOpen(false);
      await loadPromos();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal hapus promo");
    }
  }

    async function refresh() {
    setLoading(true);
    try {
      if (tab === "packages") await loadPackages();
      if (tab === "bookings") await loadBookings();
      if (tab === "subscribers") await loadSubscribers();
      if (tab === "promos") await loadPromos(); // ✅ tambah ini
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal load data (cek token / role admin)");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function addPackage(e) {
    e.preventDefault();
    try {
      await api.post("/packages", {
        ...createForm,
        price: Number(createForm.price),
        durationDays: Number(createForm.durationDays),
      });
      toast.success("Paket ditambahkan");
      setCreateForm({ type: "TOUR", title: "", description: "", price: 0, durationDays: 5, isActive: true });
      await loadPackages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal menambah paket");
    }
  }

  function openEdit(pkg) {
    setEditForm({
      id: pkg.id,
      type: pkg.type,
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      durationDays: pkg.durationDays,
      isActive: pkg.isActive,
    });
    setEditOpen(true);
  }

  async function saveEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/packages/${editForm.id}`, {
        ...editForm,
        price: Number(editForm.price),
        durationDays: Number(editForm.durationDays),
      });
      toast.success("Paket diupdate");
      setEditOpen(false);
      await loadPackages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal update paket");
    }
  }

  async function toggleActive(id) {
    try {
      await api.patch(`/packages/${id}/toggle`);
      toast.success("Status paket diubah");
      await loadPackages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Gagal toggle paket");
    }
  }

  function logout() {
    localStorage.removeItem("rt_token");
    nav("/login");
  }

  const tabs = useMemo(
    () => [
      { key: "packages", label: "Packages" },
      { key: "bookings", label: "Bookings" },
      { key: "subscribers", label: "Subscribers" },
      { key: "promos", label: "Promos" }, // ✅
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm text-slate-300">Dashboard</div>
            <h1 className="text-2xl font-semibold">Admin Rizqi Travel</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={refresh}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={logout}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                "rounded-2xl px-4 py-2 text-sm border",
                tab === t.key
                  ? "border-sky-400/40 bg-sky-400/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Packages */}
        {tab === "packages" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              <h2 className="text-lg font-semibold">Tambah Paket</h2>
              <form onSubmit={addPackage} className="mt-4 grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-300">Type</label>
                    <select
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={createForm.type}
                      onChange={(e) => setCreateForm((p) => ({ ...p, type: e.target.value }))}
                    >
                      <option value="TOUR">TOUR</option>
                      <option value="HAJI">HAJI</option>
                      <option value="UMROH">UMROH</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Durasi (hari)</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={createForm.durationDays}
                      onChange={(e) => setCreateForm((p) => ({ ...p, durationDays: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Title</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={createForm.title}
                    onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Description</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={createForm.description}
                    onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Price</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={createForm.price}
                    onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>

                <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90">
                  Tambah
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              <h2 className="text-lg font-semibold">Daftar Paket</h2>

              <div className="mt-4 space-y-3">
                {packages.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-slate-400">
                          {p.type} • {p.durationDays} hari •{" "}
                          <span className={p.isActive ? "text-emerald-300" : "text-amber-300"}>
                            {p.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="mt-1 text-sm text-slate-300 line-clamp-2">{p.description}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-400">Mulai</div>
                        <div className="font-semibold">Rp {formatIDR(p.price)}</div>
                        <div className="mt-3 flex gap-2 justify-end">
                          <button
                            onClick={() => openEdit(p)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleActive(p.id)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                          >
                            {p.isActive ? "Nonaktif" : "Aktifkan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {packages.length === 0 && <div className="text-slate-300">Belum ada paket.</div>}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Daftar Booking</h2>
            <div className="mt-4 space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-slate-400">
                        {new Date(b.createdAt).toLocaleString("id-ID")} • status: {b.status}
                      </div>
                      <div className="font-semibold">{b.fullName} — {b.phone}</div>
                      <div className="text-sm text-slate-300">
                        Paket: <span className="text-white">{b.Package?.title || "-"}</span>
                      </div>
                      <div className="text-sm text-slate-300">Tanggal berangkat: {b.departureDate}</div>
                      {b.notes && <div className="text-sm text-slate-400">Catatan: {b.notes}</div>}
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <div className="text-slate-300">Belum ada booking.</div>}
            </div>
          </div>
        )}

        {/* Subscribers */}
        {tab === "subscribers" && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Daftar Subscribers</h2>
            <div className="mt-4 space-y-3">
              {subscribers.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                  <div className="text-xs text-slate-400">{new Date(s.createdAt).toLocaleString("id-ID")}</div>
                  <div className="font-semibold">{s.email}</div>
                </div>
              ))}
              {subscribers.length === 0 && <div className="text-slate-300">Belum ada subscriber.</div>}
            </div>
          </div>
        )}

                {/* Promos */}
        {tab === "promos" && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Create Promo */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              <h2 className="text-lg font-semibold">Buat Promo</h2>

              <form onSubmit={addPromo} className="mt-4 grid gap-3">
                <div>
                  <label className="text-sm text-slate-300">Judul Promo</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={promoCreate.title}
                    onChange={(e) => setPromoCreate((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Contoh: Promo Umroh Hemat Kuota Terbatas"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Deskripsi</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    rows={4}
                    value={promoCreate.description}
                    onChange={(e) => setPromoCreate((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Contoh: Diskon biaya paket + bonus perlengkapan..."
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Syarat & Ketentuan (opsional)</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    rows={4}
                    value={promoCreate.terms}
                    onChange={(e) => setPromoCreate((p) => ({ ...p, terms: e.target.value }))}
                    placeholder="Contoh: DP minimal 5 juta, kuota terbatas..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-300">Berlaku dari</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={promoCreate.validFrom}
                      onChange={(e) => setPromoCreate((p) => ({ ...p, validFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Sampai</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={promoCreate.validTo}
                      onChange={(e) => setPromoCreate((p) => ({ ...p, validTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300">CTA Text</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={promoCreate.ctaText}
                    onChange={(e) => setPromoCreate((p) => ({ ...p, ctaText: e.target.value }))}
                    placeholder="Contoh: Klaim Promo via WhatsApp"
                  />
                </div>

                <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90">
                  Simpan Promo
                </button>
              </form>
            </div>

            {/* List Promos */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
              <div className="flex items-end justify-between gap-3">
                <h2 className="text-lg font-semibold">Daftar Promo</h2>
                <div className="text-xs text-slate-400">Klik promo untuk edit + preview email</div>
              </div>

              <div className="mt-4 space-y-3">
                {promos.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-slate-400">
                          <span className={p.isActive ? "text-emerald-300" : "text-amber-300"}>
                            {p.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                          {(p.validFrom || p.validTo) && (
                            <span className="ml-2">
                              • {p.validFrom || "?"} → {p.validTo || "?"}
                            </span>
                          )}
                        </div>
                        <div className="font-semibold">{p.title}</div>
                        <div className="mt-1 text-sm text-slate-300 line-clamp-2">{p.description}</div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-xs text-slate-400">CTA</div>
                        <div className="text-sm text-white/90">{p.ctaText}</div>

                        <div className="mt-3 flex gap-2 justify-end">
                          <button
                            onClick={() => openEditPromo(p)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                          >
                            Edit + Preview
                          </button>
                          <button
                            onClick={() => togglePromo(p.id)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
                          >
                            {p.isActive ? "Nonaktif" : "Aktifkan"}
                          </button>
                          <button
                            onClick={() => deletePromo(p.id)}
                            className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs hover:bg-rose-400/15"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {promos.length === 0 && <div className="text-slate-300">Belum ada promo.</div>}
              </div>
            </div>
          </div>
        )}

                {/* Promo Edit + Preview Modal */}
        <Modal open={promoEditOpen} title="Edit Promo + Preview Email" onClose={() => setPromoEditOpen(false)}>
          {promoEdit && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Form Edit */}
              <form onSubmit={savePromoEdit} className="grid gap-3">
                <div>
                  <label className="text-sm text-slate-300">Judul</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={promoEdit.title}
                    onChange={(e) => setPromoEdit((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Deskripsi</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    rows={4}
                    value={promoEdit.description}
                    onChange={(e) => setPromoEdit((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">S&K</label>
                  <textarea
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    rows={4}
                    value={promoEdit.terms}
                    onChange={(e) => setPromoEdit((p) => ({ ...p, terms: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-300">Berlaku dari</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={promoEdit.validFrom}
                      onChange={(e) => setPromoEdit((p) => ({ ...p, validFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300">Sampai</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                      value={promoEdit.validTo}
                      onChange={(e) => setPromoEdit((p) => ({ ...p, validTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300">CTA Text</label>
                  <input
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={promoEdit.ctaText}
                    onChange={(e) => setPromoEdit((p) => ({ ...p, ctaText: e.target.value }))}
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90">
                    Simpan
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePromo(promoEdit.id)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
                  >
                    {promoEdit.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePromo(promoEdit.id)}
                    className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-5 py-3 text-sm hover:bg-rose-400/15"
                  >
                    Hapus
                  </button>
                </div>
              </form>

              {/* Preview Email */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                <div className="text-xs text-slate-400">Preview Email</div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-white p-4 text-slate-900">
                  <div style={{ fontFamily: "Inter, Arial, sans-serif", lineHeight: 1.6 }}>
                    <h2 style={{ margin: "0 0 8px" }}>🔥 {promoEdit.title || "Judul Promo"}</h2>

                    {(promoEdit.validFrom || promoEdit.validTo) && (
                      <div style={{ color: "#64748b", fontSize: 12, marginBottom: 10 }}>
                        Berlaku: {promoEdit.validFrom || "?"} — {promoEdit.validTo || "?"}
                      </div>
                    )}

                    <p style={{ margin: "0 0 14px" }}>
                      {promoEdit.description || "Deskripsi promo akan tampil di sini."}
                    </p>

                    {promoEdit.terms?.trim() && (
                      <>
                        <p style={{ margin: "0 0 6px" }}>
                          <b>Syarat & Ketentuan:</b>
                        </p>
                        <p style={{ margin: "0 0 14px", whiteSpace: "pre-wrap" }}>{promoEdit.terms}</p>
                      </>
                    )}

                    <div
                      style={{
                        display: "inline-block",
                        background: "#10b981",
                        color: "#ffffff",
                        padding: "10px 14px",
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {promoEdit.ctaText || "Klaim Promo via WhatsApp"}
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
                    <small style={{ color: "#64748b" }}>Rizqi Travel • Haji & Umroh • Palembang</small>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  Email yang terkirim ke subscriber akan mengikuti isi promo aktif terbaru.
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal open={editOpen} title="Edit Paket" onClose={() => setEditOpen(false)}>
          {editForm && (
            <form onSubmit={saveEdit} className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Type</label>
                  <select
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={editForm.type}
                    onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="TOUR">TOUR</option>
                    <option value="HAJI">HAJI</option>
                    <option value="UMROH">UMROH</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-300">Durasi (hari)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                    value={editForm.durationDays}
                    onChange={(e) => setEditForm((p) => ({ ...p, durationDays: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Title</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Description</label>
                <textarea
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Price</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none"
                  value={editForm.price}
                  onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                />
              </div>

              <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90">
                Simpan
              </button>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
