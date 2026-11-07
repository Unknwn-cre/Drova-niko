(() => {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (n) => Math.round(n).toLocaleString("uk-UA");
  const phoneOk = (v) => v.replace(/\D/g, "").length >= 10;

  // ---- dialogs
  const open = (d) => { if (d && !d.open) d.showModal(); };
  $$("[data-cat]").forEach((b) => b.addEventListener("click", () => open($("#dlg-" + b.dataset.cat))));
  $$("dialog.sheet").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });

  // ---- photo lightbox (tap a product photo in a category dialog)
  const photo = $("#dlg-photo");
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".pick-img img");
    if (!img) return;
    $("#photoImg").src = img.currentSrc || img.src;
    $("#photoImg").alt = img.alt;
    $("#photoCap").textContent = img.closest(".pick")?.querySelector("h3")?.textContent || "";
    open(photo);
  });
  photo.addEventListener("click", (e) => { if (e.target === photo || e.target.closest("[data-close]") || e.target.id === "photoImg") photo.close(); });

  // ---- cart state
  let cart = {};
  try { cart = JSON.parse(localStorage.getItem("cart") || "{}") || {}; } catch { cart = {}; }
  for (const id of Object.keys(cart)) if (!S.items[id] || !(cart[id] > 0)) delete cart[id];
  const save = () => { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch {} };

  const clampQty = (v) => Math.max(1, Math.min(999, Math.round(+v) || 1));

  // qty steppers (category dialogs and cart rows)
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-inc],[data-dec]");
    if (!b) return;
    const inp = b.parentElement.querySelector("input");
    inp.value = clampQty(+inp.value + (b.hasAttribute("data-inc") ? 1 : -1));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // typing your own amount: select on focus, clamp on blur/Enter
  document.addEventListener("focusin", (e) => { if (e.target.matches(".qty input")) setTimeout(() => e.target.select(), 0); });
  document.addEventListener("focusout", (e) => { if (e.target.matches(".qty input")) { e.target.value = clampQty(e.target.value); e.target.dispatchEvent(new Event("change", { bubbles: true })); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".qty input")) { e.preventDefault(); e.target.blur(); } });

  // add to cart
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.add;
    const inp = b.closest(".pick").querySelector("input");
    cart[id] = clampQty((cart[id] || 0) + clampQty(inp.value));
    save(); render();
    b.textContent = "✓ Додано"; b.classList.add("added");
    setTimeout(() => { b.textContent = "Додати в кошик"; b.classList.remove("added"); }, 1400);
    pulse();
  }));

  const fab = $("#cartFab"), list = $("#cartList"), empty = $("#cartEmpty"), form = $("#cartForm");
  const pulse = () => { fab.classList.remove("pulse"); void fab.offsetWidth; fab.classList.add("pulse"); };

  function render() {
    const ids = Object.keys(cart);
    const count = ids.length;
    $("#cartCount").textContent = count;
    $$(".cart-n").forEach((n) => (n.textContent = count));
    fab.hidden = count === 0;
    empty.hidden = count > 0;
    form.hidden = count === 0;
    let total = 0, unknown = false, approx = false;
    list.innerHTML = ids.map((id) => {
      const it = S.items[id], q = cart[id];
      if (it.price) { total += it.price * q; if (!it.exact) approx = true; } else unknown = true;
      return `<div class="cart-row" data-id="${id}">
        <div><small class="item-cat">${it.cat}</small><b>${it.name}</b>
          <span class="muted">${it.price ? `${it.exact ? "" : "від "}${fmt(it.price * q)} грн` : "ціна за телефоном"}</span></div>
        <div class="qty"><button type="button" data-dec aria-label="Менше">−</button><input type="number" min="1" max="999" value="${q}" inputmode="numeric" aria-label="Кількість"><span class="qty-u">${it.unit}</span><button type="button" data-inc aria-label="Більше">+</button></div>
        <button type="button" class="rm" data-rm aria-label="Видалити">×</button>
      </div>`;
    }).join("");
    $("#cartTotal").textContent = total ? `${approx ? "від " : ""}${fmt(total)} грн${unknown ? " + позиції за телефоном" : ""}` : "ціну назвемо за телефоном";
  }

  list.addEventListener("change", (e) => {
    const row = e.target.closest(".cart-row");
    if (!row || e.target.tagName !== "INPUT") return;
    cart[row.dataset.id] = clampQty(e.target.value);
    save(); render();
  });
  list.addEventListener("click", (e) => {
    const row = e.target.closest("[data-rm]") && e.target.closest(".cart-row");
    if (!row) return;
    delete cart[row.dataset.id];
    save(); render();
  });

  const openCart = () => { $$("dialog.sheet[open]").forEach((d) => d.close()); render(); open($("#dlg-cart")); };
  fab.addEventListener("click", openCart);
  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", () => {
    if (Object.keys(cart).length) openCart(); else $("#prices").scrollIntoView({ behavior: "smooth" });
  }));

  async function send(data) {
    const r = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error(r.status);
  }
  function showMsg(el, ok, okText = S.ok) {
    el.className = "form-msg " + (ok ? "ok" : "err");
    if (ok) el.textContent = okText; else el.innerHTML = `${S.err} <a href="tel:${S.tel}">${S.phone}</a>`;
    el.hidden = false;
  }

  // ---- cart checkout
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("#cartMsg");
    let bad = null;
    for (const f of [form.phone, form.address]) {
      const invalid = f === form.phone ? !phoneOk(f.value) : !f.value.trim();
      f.classList.toggle("invalid", invalid);
      if (invalid && !bad) bad = f;
    }
    if (bad) { bad.focus(); return; }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    const d = Object.fromEntries(new FormData(form));
    d.type = "cart";
    d.page = location.pathname;
    d.items = Object.keys(cart).map((id) => ({ name: S.items[id].name, qty: cart[id], unit: S.items[id].unit, price: S.items[id].price, exact: S.items[id].exact }));
    try {
      await send(d);
      cart = {}; save(); render();
      form.hidden = false; empty.hidden = true; form.reset();
      showMsg(msg, true, S.okCart);
      window.gtag && window.gtag("event", "generate_lead");
    } catch { showMsg(msg, false); }
    finally { btn.disabled = false; }
  });

  // ---- callback form
  const cb = $("#orderForm");
  cb.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!phoneOk(cb.phone.value)) { cb.phone.classList.add("invalid"); cb.phone.focus(); return; }
    cb.phone.classList.remove("invalid");
    const btn = cb.querySelector("button"); btn.disabled = true;
    const d = Object.fromEntries(new FormData(cb)); d.type = "callback"; d.page = location.pathname;
    try { await send(d); cb.reset(); showMsg($("#formMsg"), true); }
    catch { showMsg($("#formMsg"), false); }
    finally { btn.disabled = false; }
  });

  render();
})();
