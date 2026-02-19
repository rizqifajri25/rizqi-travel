import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPromoEmail({ to, promoTitle, promoDesc }) {
  const from = process.env.MAIL_FROM || "Rizqi Travel <onboarding@resend.dev>";

  return resend.emails.send({
    from,
    to,
    subject: `Promo Rizqi Travel: ${promoTitle}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 8px">🔥 ${promoTitle}</h2>
        <p style="margin:0 0 14px">${promoDesc}</p>
        <p style="margin:0 0 6px"><b>Butuh bantuan?</b> Balas email ini ya.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <small>Rizqi Travel • Haji & Umroh • Palembang</small>
      </div>
    `,
  });
}
