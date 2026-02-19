export default function WhatsAppFloat() {
  const phone = "6282116065705"; 
  const text = encodeURIComponent("Halo Rizqi Travel, saya mau tanya paket umroh/haji.");

  const waLink = `https://wa.me/${phone}?text=${text}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50"
      aria-label="Chat WhatsApp"
      title="Chat WhatsApp"
    >
      <div className="relative">
        {/* glow ring */}
        <div className="absolute inset-0 rounded-full blur-xl opacity-70 wa-glow" />

        {/* button */}
        <div className="wa-wiggle grid h-14 w-14 place-items-center rounded-full bg-emerald-500 shadow-soft ring-1 ring-white/20">
          {/* icon (svg) */}
          <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
            <path d="M19.11 17.21c-.27-.14-1.57-.77-1.81-.86-.24-.09-.42-.14-.6.14-.18.27-.69.86-.85 1.03-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.56-1.49-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.31.4-.46.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.14-.6-1.45-.82-1.99-.22-.53-.44-.46-.6-.47h-.51c-.18 0-.47.07-.71.34-.24.27-.94.92-.94 2.24 0 1.32.96 2.59 1.09 2.77.14.18 1.89 2.89 4.58 4.05.64.28 1.14.45 1.53.58.64.2 1.22.17 1.68.1.51-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.16-1.26-.07-.11-.24-.18-.51-.32zM16.02 27.5h-.01c-1.98 0-3.92-.53-5.62-1.54l-.4-.24-4.16 1.09 1.11-4.05-.26-.42a11.39 11.39 0 0 1-1.75-6.07c0-6.3 5.13-11.43 11.44-11.43 3.05 0 5.92 1.19 8.08 3.35a11.37 11.37 0 0 1 3.35 8.08c0 6.31-5.13 11.43-11.44 11.43zm9.72-21.15A13.69 13.69 0 0 0 16.02 2.5C8.47 2.5 2.33 8.64 2.33 16.2c0 2.45.65 4.84 1.89 6.95L2.2 30.5l7.51-1.97a13.62 13.62 0 0 0 6.31 1.55h.01c7.55 0 13.69-6.14 13.69-13.69 0-3.66-1.42-7.09-3.98-9.64z" />
          </svg>
        </div>
      </div>
    </a>
  );
}
