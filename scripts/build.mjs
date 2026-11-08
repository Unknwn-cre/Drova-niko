// Генерирует public/index.html (UA), public/ru/index.html (RU), sitemap.xml и robots.txt.
import { writeFileSync, mkdirSync } from "node:fs";
import { site, catalog, areas } from "./site.config.mjs";
const products = catalog.flatMap((c) => c.items).filter((i) => i.price);

const T = {
  uk: {
    lang: "uk", path: "/",
    title: "Склад твердого палива та сипучих матеріалів у Миколаєві — вугілля, пісок, щебінь, відсів",
    desc: `Вугілля ДГ, річковий і карʼєрний пісок, щебінь і відсів у Миколаєві — опт і роздріб. Доставка в день замовлення, оплата після розвантаження. ☎ ${site.phoneHuman}`,
    nav: ["Каталог", "Доставка", "Контакти"],
    call: "Подзвонити",
    heroBadge: "На ринку з 1997 року · опт і роздріб",
    heroH1: "Вугілля, щебінь, пісок Миколаїв",
    heroSub: `Вугілля ДГ, річковий і карʼєрний пісок, щебінь різних фракцій і відсів. Чесна вага, доставка по місту та області, оплата після розвантаження.`,
    heroCta: "Обрати товар", heroCta2: "Замовити дзвінок",
    heroPoints: ['<span data-day="pt">Доставка за 2–4 години</span>', "Оплата по факту", "Опт і роздріб"],
    pricesH: "Каталог і ціни", pricesSub: "Вугілля, пісок, щебінь і відсів з доставкою по Миколаєву та області.", ask: "ціна за телефоном",
    from: "від", unit: "грн/скл.м³", heat: "Тепловіддача", order: "Замовити",
    stepsH: "Як ми працюємо", steps: [
      ["Заявка", "Дзвінок, Viber/Telegram або форма на сайті"],
      ["Підтвердження", "Уточнюємо товар, кількість і час за 5 хвилин"],
      ["Доставка", "Привозимо та розвантажуємо в зручне місце"],
      ["Оплата", "Перевіряєте кількість і якість — і лише потім платите"],
    ],
    delivH: "Доставка по Миколаєву та області", delivSub: `Привеземо самоскидом або вантажівкою <span data-day="dl">в день замовлення</span>. Вартість доставки залежить від обʼєму та адреси — розрахуємо за телефоном.`,
    delivNote: "Доставляємо у всі райони міста та передмістя:",
    revH: "Відгуки клієнтів",
    reviews: [], // TODO: реальні відгуки: ["Імʼя, район", "Текст"]
    formH: "Залиште заявку", formSub: "Залиште номер — передзвонимо за 5 хвилин, уточнимо деталі та час доставки.",
    fName: "Ваше імʼя", fPhone: "Телефон", fWood: "Що замовляєте", fVol: "Кількість", fAddr: "Адреса або район", fMsg: "Коментар (необовʼязково)",
    fBtn: "Надіслати заявку", fPolicy: "Натискаючи кнопку, ви погоджуєтесь на обробку даних для звʼязку з вами.",
    fOk: "Дякуємо! Заявку прийнято — передзвонимо протягом 5 хвилин.", fErr: "Не вдалося надіслати. Подзвоніть нам, будь ласка:",
    orWrite: "або напишіть", footer: "Вугілля, пісок, щебінь і відсів з доставкою в Миколаєві та області.", hoursL: "Склад",
    mobCall: "Подзвонити", mobOrder: "Замовити",
    pos: ["позиція", "позиції", "позицій"], choose: "Обрати", close: "Закрити", qty: "Кількість", less: "Менше", more: "Більше",
    add: "Додати в кошик", added: "✓ Додано", buyIn: "купити в Миколаєві", photo: "Фото товару",
    cartH: "Кошик", cartEmpty: "Кошик порожній. Оберіть товари в каталозі.", approxL: "Орієнтовно",
    fDeliv: "Адреса доставки", fDelivPh: "Вулиця, будинок, район",
    payNote: "💳 Оплата при отриманні — нічого платити заздалегідь не потрібно",
    confirmNote: "📞 Замовлення надходить у роботу після підтвердження по дзвінку",
    cartBtn: "Відправити заявку", cartPolicy: "Остаточну ціну та час доставки уточнимо під час дзвінка.",
    openCart: "Відкрити кошик", cartWord: "Кошик",
    ctaH: "Потрібна консультація?", ctaP: "Підкажемо потрібну фракцію та кількість, назвемо актуальні ціни й час доставки.",
    heroPay: "🛒 Замовляйте на сайті — оплата при отриманні", heroAlt: "Вугілля, пісок і щебінь", pricesFrom: "Ціни",
    cbH: "Замовити дзвінок", cbPh: "Що потрібно, куди привезти", cbBtn: "Передзвоніть мені",
    contactsH: "Склад і контакти", cAddr: "📍 Адреса складу", cHours: "🕖 Графік роботи складу", cPhone: "📞 Телефон",
    openMap: "Відкрити в Google Maps", onMap: "на карті", city: "Миколаїв", region: "Миколаївська область",
    okCart: "Дякуємо! Заявку прийнято. Замовлення надходить у роботу після підтвердження по дзвінку — ми передзвонимо протягом 5 хвилин.",
    js: { day: { today: { h1: "сьогодні", pt: "Доставка за 2–4 години", dl: "в день замовлення" }, tomorrow: { h1: "завтра", pt: "Доставка завтра", dl: "наступного дня" } },
      from: "від", grn: "грн", ask: "ціна за телефоном", plusAsk: " + позиції за телефоном", qty: "Кількість", less: "Менше", more: "Більше", rm: "Видалити", add: "Додати в кошик", added: "✓ Додано" },
  },
  ru: {
    lang: "ru", path: "/ru/",
    title: "Склад твёрдого топлива и сыпучих материалов в Николаеве — уголь, щебень, песок, отсев",
    desc: `Уголь ДГ, речной и карьерный песок, щебень и отсев в Николаеве — опт и розница. Доставка в день заказа, оплата после разгрузки. ☎ ${site.phoneHuman}`,
    nav: ["Каталог", "Доставка", "Контакты"],
    call: "Позвонить",
    heroBadge: "На рынке с 1997 года · опт и розница",
    heroH1: "Уголь, щебень, песок Николаев",
    heroSub: `Уголь ДГ, речной и карьерный песок, щебень разных фракций и отсев. Честный вес, доставка по городу и области, оплата после разгрузки.`,
    heroCta: "Выбрать товар", heroCta2: "Заказать звонок",
    heroPoints: ['<span data-day="pt">Доставка за 2–4 часа</span>', "Оплата по факту", "Опт и розница"],
    pricesH: "Каталог и цены", pricesSub: "Уголь, песок, щебень и отсев с доставкой по Николаеву и области.", ask: "цена по телефону",
    from: "от", order: "Заказать",
    stepsH: "Как мы работаем", steps: [
      ["Заявка", "Звонок, Viber/Telegram или форма на сайте"],
      ["Подтверждение", "Уточняем товар, количество и время за 5 минут"],
      ["Доставка", "Привозим и разгружаем в удобное место"],
      ["Оплата", "Проверяете количество и качество — и только потом платите"],
    ],
    delivH: "Доставка по Николаеву и области", delivSub: `Привезём самосвалом или грузовиком <span data-day="dl">в день заказа</span>. Стоимость доставки зависит от объёма и адреса — рассчитаем по телефону.`,
    delivNote: "Доставляем во все районы города и пригород:",
    revH: "Отзывы клиентов",
    reviews: [],
    formH: "Оставьте заявку", formSub: "Оставьте номер — перезвоним за 5 минут, уточним детали и время доставки.",
    fName: "Ваше имя", fPhone: "Телефон", fMsg: "Комментарий (необязательно)",
    fPolicy: "Нажимая кнопку, вы соглашаетесь на обработку данных для связи с вами.",
    fOk: "Спасибо! Заявка принята — перезвоним в течение 5 минут.", fErr: "Не удалось отправить. Позвоните нам, пожалуйста:",
    orWrite: "или напишите", footer: "Уголь, песок, щебень и отсев с доставкой в Николаеве и области.", hoursL: "Склад",
    mobCall: "Позвонить", mobOrder: "Заказать",
    pos: ["позиция", "позиции", "позиций"], choose: "Выбрать", close: "Закрыть", qty: "Количество", less: "Меньше", more: "Больше",
    add: "В корзину", added: "✓ Добавлено", buyIn: "купить в Николаеве", photo: "Фото товара",
    cartH: "Корзина", cartEmpty: "Корзина пуста. Выберите товары в каталоге.", approxL: "Ориентировочно",
    fDeliv: "Адрес доставки", fDelivPh: "Улица, дом, район",
    payNote: "💳 Оплата при получении — ничего платить заранее не нужно",
    confirmNote: "📞 Заказ поступает в работу после подтверждения по звонку",
    cartBtn: "Отправить заявку", cartPolicy: "Окончательную цену и время доставки уточним во время звонка.",
    openCart: "Открыть корзину", cartWord: "Корзина",
    ctaH: "Нужна консультация?", ctaP: "Подскажем нужную фракцию и количество, назовём актуальные цены и время доставки.",
    heroPay: "🛒 Заказывайте на сайте — оплата при получении", heroAlt: "Уголь, песок и щебень", pricesFrom: "Цены",
    cbH: "Заказать звонок", cbPh: "Что нужно, куда привезти", cbBtn: "Перезвоните мне",
    contactsH: "Склад и контакты", cAddr: "📍 Адрес склада", cHours: "🕖 График работы склада", cPhone: "📞 Телефон",
    openMap: "Открыть в Google Maps", onMap: "на карте", city: "Николаев", region: "Николаевская область",
    okCart: "Спасибо! Заявка принята. Заказ поступает в работу после подтверждения по звонку — мы перезвоним в течение 5 минут.",
    js: { day: { today: { h1: "сегодня", pt: "Доставка за 2–4 часа", dl: "в день заказа" }, tomorrow: { h1: "завтра", pt: "Доставка завтра", dl: "на следующий день" } },
      from: "от", grn: "грн", ask: "цена по телефону", plusAsk: " + позиции по телефону", qty: "Количество", less: "Меньше", more: "Больше", rm: "Удалить", add: "В корзину", added: "✓ Добавлено" },
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
  const addr = L === "uk" ? site.address : site.addressRu;
  const brand = L === "uk" ? site.brand : site.brandRu;
  const minPrice = Math.min(...products.map((p) => p.price));

  const ld = [
    {
      "@context": "https://schema.org", "@type": "LocalBusiness", name: brand, foundingDate: "1997",
      description: t.desc, url: canonical, telephone: site.phone, priceRange: "₴₴",
      address: { "@type": "PostalAddress", streetAddress: site.street, addressLocality: t.city, addressRegion: t.region, addressCountry: "UA" },
      areaServed: { "@type": "City", name: t.city },
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: site.opens, closes: site.closes },
      hasOfferCatalog: { "@type": "OfferCatalog", name: t.pricesH, itemListElement: catalog.map((c) => ({ "@type": "OfferCatalog", name: name(c),
        itemListElement: c.items.map((i) => ({ "@type": "Offer", priceCurrency: "UAH", ...(i.price ? { price: i.price } : {}), itemOffered: { "@type": "Product", name: name(i) } })) })) },
    },
  ];

  const thumb = (i, c, cls = "item-img") => `<div class="${cls}${i.img ? "" : ` noimg cat-${c.id}`}">${i.img
    ? `<img src="${i.img}" alt="${esc(name(i))} — ${t.buyIn}" width="800" height="600" loading="lazy" decoding="async">`
    : `<span aria-hidden="true">${c.icon}</span>`}</div>`;
  const priceOf = (i) => i.price ? `${i.exact ? "" : `<small>${t.from}</small> `}<b>${fmt(i.price)}</b> <small>грн/${unit(i)}</small>` : `<span class="ask">${t.ask}</span>`;
  const categoryCards = catalog.map((c) => {
    const priced = c.items.filter((i) => i.price);
    const min = priced.length ? Math.min(...priced.map((i) => i.price)) : 0;
    const cover = c.img ? { ...c, img: c.img } : c.items.find((i) => i.img) || c.items[0];
    return `
        <button type="button" class="card cat-card" data-cat="${c.id}" aria-haspopup="dialog">
          ${thumb(cover, c)}
          <span class="item-body">
            <span class="item-cat">${c.items.length} ${t.pos[c.items.length > 4 ? 2 : c.items.length > 1 ? 1 : 0]}</span>
            <span class="cat-title">${esc(name(c))}</span>
            <span class="cat-note">${esc(c.items.map((i) => name(i)).join(" · "))}</span>
            <span class="price">${min ? `${priced.every((i) => i.exact && i.price === min) ? "" : `<small>${t.from}</small> `}<b>${fmt(min)}</b> <small>грн/${unit(priced[0])}</small>` : `<span class="ask">${t.ask}</span>`}</span>
            <span class="btn btn-ghost">${t.choose}</span>
          </span>
        </button>`;
  }).join("");
  const categoryDialogs = catalog.map((c) => `
<dialog class="sheet" id="dlg-${c.id}" aria-labelledby="dlg-${c.id}-h">
  <div class="sheet-head"><h2 id="dlg-${c.id}-h">${esc(name(c))}</h2><button type="button" class="x" data-close aria-label="${t.close}">×</button></div>
  <p class="muted">${esc(L === "uk" ? c.noteUk : c.noteRu)}</p>
  <div class="sheet-list">${c.items.map((i) => `
    <div class="pick" data-id="${i.id}">
      ${thumb(i, c, "pick-img")}
      <div class="pick-info"><h3>${esc(name(i))}</h3><div class="price">${priceOf(i)}</div></div>
      <div class="pick-act">
        <div class="qty" aria-label="${t.qty}"><button type="button" data-dec aria-label="${t.less}">−</button><input type="text" value="1" inputmode="decimal" autocomplete="off" aria-label="${t.qty}, ${unit(i)}"><span class="qty-u">${unit(i)}</span><button type="button" data-inc aria-label="${t.more}">+</button></div>
        <button type="button" class="btn" data-add="${i.id}">${t.add}</button>
      </div>
    </div>`).join("")}
  </div>
</dialog>`).join("");
  const cartDialog = `
<dialog class="lightbox" id="dlg-photo" aria-label="${t.photo}">
  <button type="button" class="x" data-close aria-label="${t.close}">×</button>
  <img id="photoImg" src="data:," alt="">
  <p id="photoCap"></p>
</dialog>
<dialog class="sheet" id="dlg-cart" aria-labelledby="dlg-cart-h">
  <div class="sheet-head"><h2 id="dlg-cart-h">${t.cartH}</h2><button type="button" class="x" data-close aria-label="${t.close}">×</button></div>
  <div id="cartList" class="cart-list"></div>
  <p class="cart-empty muted" id="cartEmpty">${t.cartEmpty}</p>
  <form id="cartForm" class="order cart-form" novalidate>
    <div class="cart-total"><span>${t.approxL}</span><b id="cartTotal"></b></div>
    <label>${t.fName}<input name="name" autocomplete="name" maxlength="60"></label>
    <label>${t.fPhone} *<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+380" maxlength="20"></label>
    <label>${t.fDeliv} *<input name="address" autocomplete="street-address" required maxlength="160" placeholder="${t.fDelivPh}"></label>
    <label>${t.fMsg}<textarea name="comment" rows="2" maxlength="500"></textarea></label>
    <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="pay-note pay-sm">${t.payNote}</p>
    <p class="pay-note pay-sm">${t.confirmNote}</p>
    <button class="btn btn-lg btn-block" type="submit">${t.cartBtn}</button>
    <p class="policy">${t.cartPolicy} ${t.fPolicy}</p>
    <p class="form-msg" id="cartMsg" role="status" hidden></p>
  </form>
</dialog>
<button type="button" class="cart-fab" id="cartFab" hidden aria-label="${t.openCart}">🛒 ${t.cartWord} <b id="cartCount">0</b></button>`;

  const ctaBanner = `
      <div class="cta-card cta-banner">
        <div><h3>${t.ctaH}</h3>
        <p>${t.ctaP}</p></div>
        <a class="btn btn-lg" href="tel:${site.phone}">📞 ${site.phoneHuman}</a>
      </div>`;


  return `<!doctype html>
<html lang="${t.lang}">
<head>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtm}');</script>
<!-- End Google Tag Manager -->
<!-- Google tag (gtag.js) — Google Ads -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.adsId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.adsId}');</script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="uk" href="${site.domain}/">
<link rel="alternate" hreflang="ru" href="${site.domain}/ru/">
<link rel="alternate" hreflang="x-default" href="${site.domain}/">
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
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.gtm}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="${t.path}"><img src="/favicon.svg" alt="" width="32" height="32"><span>${brand}</span></a>
    <nav class="nav">${t.nav.map((n, i) => `<a href="#${ids[i]}">${n}</a>`).join("")}</nav>
    <div class="top-actions">
      <a class="lang" href="${L === "uk" ? "/ru/" : "/"}" hreflang="${L === "uk" ? "ru" : "uk"}" lang="${L === "uk" ? "ru" : "uk"}">${L === "uk" ? "RU" : "UA"}</a>
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
        <p class="pay-note">${t.heroPay}</p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <img class="hero-photo" src="/img/hero-bulk.webp" alt="${t.heroAlt}" width="1100" height="669" fetchpriority="high">
        <div class="price-bubble">${t.pricesFrom} ${t.from} <b>${fmt(minPrice)}</b> грн/т</div>
      </div>
    </div>
  </section>

  <section id="prices" class="sec">
    <div class="wrap">
      <h2>${t.pricesH}</h2>
      <p class="sub">${t.pricesSub}</p>
      <div class="grid cats-grid">${categoryCards}
      </div>${ctaBanner}
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
        <h3>${t.cbH}</h3>
        <label>${t.fName}<input name="name" autocomplete="name" maxlength="60"></label>
        <label>${t.fPhone} *<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+380" maxlength="20"></label>
        <label>${t.fMsg}<textarea name="comment" rows="2" maxlength="500" placeholder="${t.cbPh}"></textarea></label>
        <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <button class="btn btn-lg btn-block" type="submit">${t.cbBtn}</button>
        <p class="policy">${t.fPolicy}</p>
        <p class="form-msg" id="formMsg" role="status" hidden></p>
      </form>
    </div>
  </section>
</main>

<section id="contacts" class="sec sec-alt">
  <div class="wrap contacts-in">
    <div>
      <h2>${t.contactsH}</h2>
      <ul class="contacts">
        <li><span>${t.cAddr}</span><b>${addr}</b></li>
        <li><span>${t.cHours}</span><b>${hours}</b></li>
        <li><span>${t.cPhone}</span><b><a href="tel:${site.phone}">${site.phoneHuman}</a></b></li>
      </ul>
      <a class="btn btn-light" href="https://www.google.com/maps/search/?api=1&query=${mapQ}" target="_blank" rel="noopener">${t.openMap}</a>
    </div>
    <div class="map">
      <iframe title="${esc(addr)} ${t.onMap}" src="https://maps.google.com/maps?q=${mapQ}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>

<footer class="foot">
  <div class="wrap foot-in">
    <div><b>${brand}</b><p>${t.footer}</p></div>
    <div><p>${addr}</p><p>${t.hoursL}: ${hours}</p><p><a href="tel:${site.phone}">${site.phoneHuman}</a></p></div>
    <div><p>© ${new Date().getFullYear()} ${brand}</p></div>
  </div>
</footer>

<div class="mob-bar">
  <a class="btn btn-light" href="tel:${site.phone}">📞 ${t.mobCall}</a>
  <button type="button" class="btn" data-open-cart>🛒 ${t.cartWord} <b class="cart-n">0</b></button>
</div>

<script>window.SITE=${JSON.stringify({ items: Object.fromEntries(catalog.flatMap((c) => c.items.map((i) => [i.id, { name: name(i), unit: unit(i), price: i.price || 0, exact: !!i.exact, cat: name(c) }]))), ok: t.fOk, okCart: t.okCart, err: t.fErr, t: t.js, phone: site.phoneHuman, tel: site.phone })};</script>
${categoryDialogs}${cartDialog}
<script src="/app.js" defer></script>
</body>
</html>
`;
}

writeFileSync("public/index.html", page("uk"));
mkdirSync("public/ru", { recursive: true });
writeFileSync("public/ru/index.html", page("ru"));
writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${site.domain}/</loc><changefreq>weekly</changefreq>
    <xhtml:link rel="alternate" hreflang="uk" href="${site.domain}/"/><xhtml:link rel="alternate" hreflang="ru" href="${site.domain}/ru/"/>
  </url>
  <url><loc>${site.domain}/ru/</loc><changefreq>weekly</changefreq>
    <xhtml:link rel="alternate" hreflang="uk" href="${site.domain}/"/><xhtml:link rel="alternate" hreflang="ru" href="${site.domain}/ru/"/>
  </url>
</urlset>
`);
writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.domain}/sitemap.xml\n`);
console.log("built: public/index.html, public/ru/index.html, sitemap.xml, robots.txt");
