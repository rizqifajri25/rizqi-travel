import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api.js";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@rizqitravel.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("rt_token", res.data.token);
      toast.success("Login berhasil");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid max-w-6xl items-center px-4 py-12 md:grid-cols-2 md:py-24">
        <div className="hidden md:block">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-400/15 to-indigo-500/15 p-8 shadow-soft">
            <div className="text-sm text-slate-300">Admin Panel</div>
            <div className="mt-2 text-3xl font-semibold">Kelola paket & booking dengan rapi.</div>
            <p className="mt-3 text-slate-300">Login untuk update paket Tour / Haji / Umroh.</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="text-sm text-slate-300">Rizqi Travel</div>
            <h1 className="mt-1 text-2xl font-semibold">Login Admin</h1>

            <form onSubmit={submit} className="mt-5 grid gap-3">
              <div>
                <label className="text-sm text-slate-300">Email</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400/60"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-sky-400/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                className="mt-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-950 hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Login"}
              </button>

              <div className="text-sm text-slate-300">
                <Link to="/" className="hover:text-white">← Kembali ke Home</Link>
              </div>
            </form>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Default seed: admin@rizqitravel.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
