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

  async function refresh() {
    setLoading(true);
    try {
      if (tab === "packages") await loadPackages();
      if (tab === "bookings") await loadBookings();
      if (tab === "subscribers") await loadSubscribers();
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
