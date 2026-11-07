(() => {
  const S = window.SITE;
  const $ = (s) => document.querySelector(s);

  const fWood = $("#fWood"), fVol = $("#fVol"), fEst = $("#fEst");
  document.querySelectorAll(".js-pick").forEach((a) =>
    a.addEventListener("click", () => {
      fWood.value = a.dataset.item; fEst.value = "";
      const it = S.items[a.dataset.item]; fVol.value = it && it.calc ? "4 м³" : "";
      fVol.placeholder = it ? it.unit : "";
    }));
  fWood.addEventListener("change", () => { fEst.value = ""; });

  // ---- order form
  const form = $("#orderForm"), msg = $("#formMsg");
  const phoneOk = (v) => v.replace(/\D/g, "").length >= 10;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = form.phone;
    if (!phoneOk(phone.value)) { phone.classList.add("invalid"); phone.focus(); return; }
    phone.classList.remove("invalid");
    const btn = form.querySelector("button");
    btn.disabled = true;
    const data = Object.fromEntries(new FormData(form));
    if (!data.estimate) data.estimate = "";
    data.page = location.pathname;
    data.itemName = (S.items[data.item] || {}).name || data.item;
    try {
      const r = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
      msg.className = "form-msg ok"; msg.textContent = S.ok; msg.hidden = false;
      form.reset();
      window.dataLayer && window.dataLayer.push({ event: "order_submit" });
      window.gtag && window.gtag("event", "generate_lead");
    } catch {
      msg.className = "form-msg err";
      msg.innerHTML = `${S.err} <a href="tel:${S.tel}">${S.phone}</a>`;
      msg.hidden = false;
    } finally { btn.disabled = false; }
  });
})();
