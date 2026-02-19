import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Promo from "../components/Promo.jsx";
import Contact from "../components/Contact.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import BookingModal from "../components/BookingModal.jsx";
import LoadingScreen from "../components/LoadingScreen.jsx";
import WhatsAppFloat from "../components/WhatsAppFloat.jsx";

export default function Home() {
  const [bootLoading, setBootLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  async function loadPackages() {
    try {
      setLoading(true);
      const res = await api.get("/packages");
      setPackages(res.data.packages || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackages();
  }, []);

  const grouped = useMemo(() => {
    const order = ["TOUR", "HAJI", "UMROH"];
    return order
      .map((t) => ({
        type: t,
        items: packages.filter((p) => p.type === t),
      }))
      .filter((g) => g.items.length);
  }, [packages]);

  function openBooking(pkg) {
    setSelected(pkg);
    setOpenModal(true);
  }

  return (
    <div className="min-h-screen">
      {bootLoading && <LoadingScreen />}
      <Navbar />
      <Hero onCta={() => document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })} />

      <section id="services" className="mt-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Services</h2>
              <p className="mt-2 text-slate-300">Paket terbaik yang disusun rapi untuk kenyamanan Anda.</p>
            </div>
            <button
              onClick={loadPackages}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {packages.length === 0 && !loading ? (
              <>
                <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
                <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
              </>
            ) : (
              grouped.flatMap((g) => g.items).map((pkg) => (
                <ServiceCard key={pkg.id} pkg={pkg} onBook={openBooking} />
              ))
            )}
          </div>
        </div>
      </section>

      <Promo />
      <Contact />

      <BookingModal
        open={openModal}
        pkg={selected}
        onClose={() => setOpenModal(false)}
      />
      <WhatsAppFloat />
    </div>
    
    
  );
}
