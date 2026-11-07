// Cloudflare Worker: отдаёт статику из ./public и принимает заявки POST /api/order → Telegram.
// Секреты (wrangler secret put ...): TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const clip = (v, n) => String(v ?? "").trim().slice(0, n);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });

async function handleOrder(request, env) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }
  if (d.website) return json({ ok: true }); // honeypot — тихо игнорируем ботов

  const phone = clip(d.phone, 20);
  if (phone.replace(/\D/g, "").length < 10) return json({ ok: false, error: "phone" }, 422);

  const lines = [
    "🪵 <b>Нова заявка з сайту</b>",
    `📞 ${esc(phone)}`,
    d.name && `👤 ${esc(clip(d.name, 60))}`,
    `📦 ${esc(clip(d.itemName || d.item, 60))}${d.volume ? " — " + esc(clip(d.volume, 20)) : ""}`,
    d.estimate && `💰 ≈ ${esc(clip(d.estimate, 10))} грн (калькулятор)`,
    d.address && `📍 ${esc(clip(d.address, 120))}`,
    d.comment && `💬 ${esc(clip(d.comment, 500))}`,
    `🌐 ${esc(clip(d.lang, 2))} ${esc(clip(d.page, 20))}`,
  ].filter(Boolean).join("\n");

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    console.log("ORDER (Telegram not configured):\n" + lines);
    return json({ ok: true, delivered: false });
  }
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: lines, parse_mode: "HTML" }),
  });
  if (!r.ok) { console.error("telegram", r.status, await r.text()); return json({ ok: false }, 502); }
  return json({ ok: true });
}

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/ru" || url.pathname.startsWith("/ru/")) return Response.redirect(url.origin + "/", 301);
    if (url.pathname === "/api/order") {
      if (request.method !== "POST") return json({ ok: false }, 405);
      return handleOrder(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
