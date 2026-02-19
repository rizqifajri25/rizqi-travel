import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500" />
          <div className="leading-tight">
            <div className="font-semibold">Rizqi Travel</div>
            <div className="text-xs text-slate-300">Haji • Umroh • Tour</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a className="hover:text-white" href="#services">Services</a>
          <a className="hover:text-white" href="#promo">Promo</a>
          <a className="hover:text-white" href="#contact">Contact</a>
          <Link
            to="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
          >
            Admin Login
          </Link>
        </nav>

        <Link
          to="/login"
          className="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          Login
        </Link>
      </div>
    </header>
  );
}