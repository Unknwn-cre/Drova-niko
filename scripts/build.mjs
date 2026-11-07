// Генерирует public/index.html, sitemap.xml и robots.txt.
import { writeFileSync, mkdirSync } from "node:fs";
import { site, catalog, areas, deliveryFreeFrom, deliveryFee } from "./site.config.mjs";
const products = catalog.flatMap((c) => c.items).filter((i) => i.calc);
const allItems = catalog.flatMap((c) => c.items);

const T = {
  uk: {
    lang: "uk", path: "/",
    title: "Дрова Миколаїв — купити дрова, брикети, пелети, вугілля з доставкою",
    desc: `Дрова в Миколаєві: колоті, пиляні, метрові. Паливні брикети, пелети, вугілля ДГ, пісок. Доставка в день замовлення, оплата після розвантаження. ☎ ${site.phoneHuman}`,
    nav: ["Каталог", "Доставка", "Контакти"],
    call: "Подзвонити",
    heroBadge: "На ринку з 1997 року · дрова в наявності",
    heroH1: "Дрова та паливо<br>у Миколаєві з доставкою <span>сьогодні</span>",
    heroSub: `Колоті, пиляні та метрові дрова, паливні брикети, пелети, вугілля ДГ і пісок. Чесний обʼєм, безкоштовна доставка дров, оплата після розвантаження.`,
    heroCta: "Дивитися ціни", heroCta2: "Замовити дзвінок",
    heroPoints: ["Доставка за 2–4 години", "Оплата по факту", "Вологість до 25%"],
    pricesH: "Каталог і ціни", pricesSub: "Дрова, брикети, пелети, вугілля та пісок з доставкою по Миколаєву та області. Ціни вказані «від» — точну суму назвемо за телефоном, вона залежить від обʼєму та фасування. Ціну на пісок уточнюйте за телефоном.", ask: "ціна за телефоном",
    from: "від", unit: "грн/скл.м³", heat: "Тепловіддача", order: "Замовити",
    stepsH: "Як ми працюємо", steps: [
      ["Заявка", "Дзвінок, Viber/Telegram або форма на сайті"],
      ["Підтвердження", "Уточнюємо породу, обʼєм і час за 5 хвилин"],
      ["Доставка", "Привозимо та розвантажуємо в зручне місце"],
      ["Оплата", "Міряєте обʼєм, перевіряєте якість — і лише потім платите"],
    ],
    delivH: "Доставка дров по Миколаєву та області", delivSub: `Безкоштовно від ${deliveryFreeFrom} складометрів по місту. Менші обʼєми — ${deliveryFee} грн. По області — розрахуємо за телефоном.`,
    delivNote: "Доставляємо у всі райони міста та передмістя:",
    revH: "Відгуки клієнтів",
    reviews: [], // TODO: реальні відгуки: ["Імʼя, район", "Текст"]
    formH: "Замовте дрова зараз", formSub: "Залиште номер — передзвонимо за 5 хвилин, уточнимо деталі та час доставки.",
    fName: "Ваше імʼя", fPhone: "Телефон", fWood: "Що замовляєте", fVol: "Кількість", fAddr: "Адреса або район", fMsg: "Коментар (необовʼязково)",
    fBtn: "Замовити дрова", fPolicy: "Натискаючи кнопку, ви погоджуєтесь на обробку даних для звʼязку з вами.",
    fOk: "Дякуємо! Заявку прийнято — передзвонимо протягом 5 хвилин.", fErr: "Не вдалося надіслати. Подзвоніть нам, будь ласка:",
    orWrite: "або напишіть", footer: "Дрова, паливні брикети, пелети, вугілля та пісок з доставкою в Миколаєві та області.", hoursL: "Склад",
    mobCall: "Подзвонити", mobOrder: "Замовити",
  },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const fmt = (n) => n.toLocaleString("uk-UA").replace(/ /g, " ");

function page(L) {
  const t = T[L];
  const name = (p) => p[L];
  const unit = (i) => (L === "uk" ? i.unitUk : i.unitRu);
  const ids = ["prices", "delivery", "contacts"];
  const canonical = site.domain + t.path;
  const hours = site.hours;
  const mapQ = encodeURIComponent(site.address);
  const minPrice = Math.min(...products.map((p) => p.price));

  const ld = [
    {
      "@context": "https://schema.org", "@type": "LocalBusiness", name: site.brand, foundingDate: "1997",
      description: t.desc, url: canonical, telephone: site.phone, priceRange: "₴₴",
      address: { "@type": "PostalAddress", streetAddress: site.street, addressLocality: L === "uk" ? "Миколаїв" : "Николаев", addressRegion: L === "uk" ? "Миколаївська область" : "Николаевская область", addressCountry: "UA" },
      areaServed: { "@type": "City", name: L === "uk" ? "Миколаїв" : "Николаев" },
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: site.opens, closes: site.closes },
      hasOfferCatalog: { "@type": "OfferCatalog", name: t.pricesH, itemListElement: catalog.map((c) => ({ "@type": "OfferCatalog", name: name(c),
        itemListElement: c.items.map((i) => ({ "@type": "Offer", priceCurrency: "UAH", ...(i.price ? { price: i.price } : {}), itemOffered: { "@type": "Product", name: name(i) } })) })) },
    },
  ];

  const productCards = catalog.map((c) => `
        <article class="card product cat-${c.id}" id="cat-${c.id}">
          <div class="cat-ico" aria-hidden="true">${c.icon}</div>
          <h3>${esc(name(c))}</h3>
          <p>${esc(L === "uk" ? c.noteUk : c.noteRu)}</p>
          <ul class="items">${c.items.map((i) => `
            <li>${i.tag ? `<span class="tag-in">${esc(i.tag[L])}</span>` : ""}<span>${esc(name(i))}</span>
              <b>${i.price ? `${t.from} ${fmt(i.price)} <small>грн/${unit(i)}</small>` : `<small>${t.ask}</small>`}</b></li>`).join("")}
          </ul>
          <a class="btn btn-ghost js-pick" href="#order" data-item="${c.items[0].id}">${t.order}</a>
        </article>`).join("") + `
        <article class="card product cta-card">
          <div class="cat-ico" aria-hidden="true">📞</div>
          <h3>${L === "uk" ? "Потрібна консультація?" : "Нужна консультация?"}</h3>
          <p>${L === "uk" ? "Підберемо паливо під ваш котел чи піч, назвемо актуальні ціни та час доставки." : "Подберём топливо под ваш котёл или печь, назовём актуальные цены и время доставки."}</p>
          <a class="big-phone" href="tel:${site.phone}">${site.phoneHuman}</a>
          <a class="btn btn-block" href="tel:${site.phone}">${t.call}</a>
        </article>`;

  const woodOptions = products.map((p) => `<option value="${p.id}">${esc(name(p))} — ${t.from} ${fmt(p.price)} грн</option>`).join("");
  const itemOptions = catalog.map((c) => `<optgroup label="${esc(name(c))}">${c.items.map((i) => `<option value="${i.id}">${esc(name(i))}</option>`).join("")}</optgroup>`).join("");

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.domain}/og.png">
<meta property="og:locale" content="${L === "uk" ? "uk_UA" : "ru_UA"}">
<meta name="theme-color" content="#1f1a14">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="${t.path}"><img src="/favicon.svg" alt="" width="32" height="32"><span>${site.brand}</span></a>
    <nav class="nav">${t.nav.map((n, i) => `<a href="#${ids[i]}">${n}</a>`).join("")}</nav>
    <div class="top-actions">
        <a class="phone" href="tel:${site.phone}">${site.phoneHuman}</a>
      <a class="btn btn-sm" href="tel:${site.phone}">${t.call}</a>
    </div>
  </div>
</header>

<main>
  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-text">
        <span class="badge">● ${t.heroBadge}</span>
        <h1>${t.heroH1}</h1>
        <p class="lead">${t.heroSub}</p>
        <div class="cta-row">
          <a class="btn btn-lg" href="#prices">${t.heroCta}</a>
          <a class="btn btn-lg btn-light" href="#order">${t.heroCta2}</a>
        </div>
        <ul class="points">${t.heroPoints.map((p) => `<li>${p}</li>`).join("")}</ul>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="stack">${Array.from({ length: 15 }, () => "<span></span>").join("")}</div>
        <div class="flame"></div>
        <div class="price-bubble">${L === "uk" ? "Дрова" : "Дрова"} ${t.from} <b>${fmt(minPrice)}</b> грн/м³</div>
      </div>
    </div>
  </section>

  <section id="prices" class="sec">
    <div class="wrap">
      <h2>${t.pricesH}</h2>
      <p class="sub">${t.pricesSub}</p>
      <div class="grid products">${productCards}
      </div>
    </div>
  </section>

  <section class="sec sec-alt">
    <div class="wrap">
      <h2>${t.stepsH}</h2>
      <ol class="steps">${t.steps.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join("")}</ol>
    </div>
  </section>

  <section id="delivery" class="sec">
    <div class="wrap">
      <h2>${t.delivH}</h2>
      <p class="sub">${t.delivSub}</p>
      <p>${t.delivNote}</p>
      <ul class="areas">${areas[L].map((a) => `<li>${a}</li>`).join("")}</ul>
    </div>
  </section>

  ${t.reviews.length ? `<section id="reviews" class="sec sec-alt">
    <div class="wrap">
      <h2>${t.revH}</h2>
      <div class="grid reviews">${t.reviews.map(([n, r]) => `<figure class="card"><div class="stars">★★★★★</div><blockquote>${r}</blockquote><figcaption>${n}</figcaption></figure>`).join("")}</div>
    </div>
  </section>` : ""}

  <section id="order" class="sec sec-dark">
    <div class="wrap order-in">
      <div>
        <h2>${t.formH}</h2>
        <p class="sub">${t.formSub}</p>
        <a class="big-phone" href="tel:${site.phone}">${site.phoneHuman}</a>
        <p class="muted">${t.orWrite}:</p>
        <div class="messengers">
          <a class="btn btn-viber" href="viber://chat?number=%2B${site.viberPhone}">Viber</a>
          <a class="btn btn-tg" href="https://t.me/${site.telegram}">Telegram</a>
        </div>
      </div>
      <form class="card order" id="orderForm" novalidate>
        <label>${t.fName}<input name="name" autocomplete="name" maxlength="60"></label>
        <label>${t.fPhone} *<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+380" maxlength="20"></label>
        <div class="two">
          <label>${t.fWood}<select name="item" id="fWood">${itemOptions}</select></label>
          <label>${t.fVol}<input name="volume" id="fVol" inputmode="decimal" maxlength="20" value="4 м³"></label>
        </div>
        <label>${t.fAddr}<input name="address" autocomplete="street-address" maxlength="120"></label>
        <label>${t.fMsg}<textarea name="comment" rows="2" maxlength="500"></textarea></label>
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="lang" value="${L}">
        <input type="hidden" name="estimate" id="fEst">
        <button class="btn btn-lg btn-block" type="submit">${t.fBtn}</button>
        <p class="policy">${t.fPolicy}</p>
        <p class="form-msg" id="formMsg" role="status" hidden></p>
      </form>
    </div>
  </section>
</main>

<section id="contacts" class="sec sec-alt">
  <div class="wrap contacts-in">
    <div>
      <h2>Склад і контакти</h2>
      <ul class="contacts">
        <li><span>📍 Адреса складу</span><b>${site.address}</b></li>
        <li><span>🕖 Графік роботи складу</span><b>${hours}</b></li>
        <li><span>📞 Телефон</span><b><a href="tel:${site.phone}">${site.phoneHuman}</a></b></li>
      </ul>
      <a class="btn btn-light" href="https://www.google.com/maps/search/?api=1&query=${mapQ}" target="_blank" rel="noopener">Відкрити в Google Maps</a>
    </div>
    <div class="map">
      <iframe title="${esc(site.address)} на карті" src="https://maps.google.com/maps?q=${mapQ}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="wrap foot-in">
    <div><b>${site.brand}</b><p>${t.footer}</p></div>
    <div><p>${site.address}</p><p>${t.hoursL}: ${hours}</p><p><a href="tel:${site.phone}">${site.phoneHuman}</a></p></div>
    <div><p>© ${new Date().getFullYear()} ${site.brand}</p></div>
  </div>
</footer>

<div class="mob-bar">
  <a class="btn btn-light" href="tel:${site.phone}">📞 ${t.mobCall}</a>
  <a class="btn" href="#order">${t.mobOrder}</a>
</div>

<script>window.SITE=${JSON.stringify({ lang: L, products: products.map((p) => ({ id: p.id, name: name(p), price: p.price, noLength: !!p.noLength })), items: Object.fromEntries(allItems.map((i) => [i.id, { name: name(i), unit: unit(i), calc: !!i.calc }])), freeFrom: deliveryFreeFrom, fee: deliveryFee, ok: t.fOk, err: t.fErr, phone: site.phoneHuman, tel: site.phone, free: t.calcFree })};</script>
<script src="/app.js" defer></script>
</body>
</html>
`;
}

writeFileSync("public/index.html", page("uk"));
writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.domain}/</loc><changefreq>weekly</changefreq></url>
</urlset>
`);
writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.domain}/sitemap.xml\n`);
console.log("built: public/index.html, sitemap.xml, robots.txt");
