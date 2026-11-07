// Генерирует public/index.html (укр.) и public/ru/index.html (рус.) из одного шаблона.
import { writeFileSync, mkdirSync } from "node:fs";
import { site, catalog, areas, deliveryFreeFrom, deliveryFee } from "./site.config.mjs";
const products = catalog.flatMap((c) => c.items).filter((i) => i.calc);
const allItems = catalog.flatMap((c) => c.items);

const T = {
  uk: {
    lang: "uk", path: "/", other: "/ru/", otherLabel: "RU",
    title: "Дрова Миколаїв — купити дрова, брикети, пелети, вугілля з доставкою",
    desc: `Дрова в Миколаєві: колоті, пиляні, метрові. Паливні брикети, пелети, вугілля ДГ, пісок. Доставка в день замовлення, оплата після розвантаження. ☎ ${site.phoneHuman}`,
    nav: ["Каталог", "Калькулятор", "Доставка", "Питання"],
    call: "Подзвонити",
    heroBadge: "Сезон 2026/27 · дрова в наявності",
    heroH1: "Дрова та паливо<br>у Миколаєві з доставкою <span>сьогодні</span>",
    heroSub: `Колоті, пиляні та метрові дрова, паливні брикети, пелети, вугілля ДГ і пісок. Чесний обʼєм, безкоштовна доставка дров від ${deliveryFreeFrom} м³, оплата після розвантаження.`,
    heroCta: "Розрахувати вартість", heroCta2: "Замовити дзвінок",
    heroPoints: ["Доставка за 2–4 години", "Оплата по факту", "Вологість до 25%"],
    trust: [["5", "видів палива та матеріалів"], ["2–4 год", "доставка по місту"], ["0 грн", "передоплата"], ["від 1 м³", "мінімальне замовлення"]],
    pricesH: "Каталог і ціни", pricesSub: "Дрова, брикети, пелети, вугілля та пісок з доставкою по Миколаєву та області. Точну ціну на брикети, пелети, вугілля і пісок назвемо за телефоном — залежить від обʼєму та фасування.", ask: "ціна за телефоном",
    from: "від", unit: "грн/скл.м³", heat: "Тепловіддача", order: "Замовити",
    calcH: "Калькулятор вартості дров", calcSub: "Порахуйте ціну за 10 секунд — і отримайте знижку 5% при замовленні через сайт.",
    calcWood: "Вид дров", calcVol: "Обʼєм, складометрів", calcLen: "Довжина поліна", calcLenOpts: ["30–40 см (стандарт)", "до 25 см (для каміна, +100 грн/м³)", "50 см (+0 грн)"], calcMeter: "Метрові — поліно 1 м",
    calcTotal: "Разом з доставкою", calcDelivery: "Доставка", calcFree: "безкоштовно", calcDisc: "Знижка за сайт −5%", calcBtn: "Оформити за цією ціною",
    whyH: "Чому замовляють у нас", why: [
      ["📏", "Чесний складометр", "Укладаємо дрова рівно в кузові та міряємо рулеткою при вас. Не сподобалось — не платите."],
      ["🔥", "Сухі дрова", "Вологість до 25% — дрова горять, а не шиплять. Покажемо вологомір на місці."],
      ["🚚", "Доставка сьогодні", "Власний транспорт і самоскиди. Дрова, паливо та пісок привеземо в день замовлення по всьому Миколаєву."],
      ["💳", "Оплата по факту", "Жодних передоплат. Готівка або переказ на картку після розвантаження."],
      ["🪓", "Дрова будь-якої довжини", "Колоті й пиляні — поліно 25, 30–40 або 50 см. Метрові — для тих, хто коле сам і хоче заощадити."],
      ["🧾", "Документи", "Працюємо з ОСББ, школами та бізнесом — рахунок, накладна, договір."],
    ],
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
    faqH: "Часті питання", faq: [
      ["Що таке складометр і чим він відрізняється від насипного?", "Складометр — це 1 м³ рівно складених полін. Насипний метр — дрова, накидані навалом, у ньому до 30% повітря. Ми продаємо саме складометри, тому ви отримуєте більше деревини за ті ж гроші."],
      ["Наскільки сухі дрова?", "Вологість наших дров — до 25%. Це оптимально для котлів, печей і камінів: дрова легко розпалюються та дають максимум тепла."],
      ["Як швидко привезете?", "Зазвичай за 2–4 години після дзвінка в межах Миколаєва. Можна домовитись на конкретну дату і час."],
      ["Чи потрібна передоплата?", "Ні. Оплата готівкою або переказом після розвантаження та перевірки обʼєму."],
      ["Які дрова найкращі для котла?", "Дуб, граб і акація — найвища тепловіддача та найдовше горіння. Для економії — мікс твердих порід."],
      ["Які пелети та брикети у вас є?", "Агропелети та соняшникові пелети — у мішках або на палетах. Брикети: деревні, торфʼяні та з лушпиння соняшнику. Підкажемо, що краще підійде саме для вашого котла."],
      ["Яке вугілля ви продаєте?", "Вугілля марки ДГ для котлів і печей — навалом або у мішках, з доставкою по Миколаєву та області."],
      ["Який пісок можна замовити?", "Річковий митий пісок і карʼєрний жовтий пісок — для будівництва, стяжки, кладки та благоустрою. Привеземо потрібний обʼєм самоскидом."],
      ["Чи можна замовити 1–2 кубометри?", `Так, від 1 складометра. Доставка малих обʼємів — ${deliveryFee} грн, від ${deliveryFreeFrom} м³ — безкоштовно.`],
    ],
    formH: "Замовте дрова зараз", formSub: "Залиште номер — передзвонимо за 5 хвилин, уточнимо деталі та час доставки.",
    fName: "Ваше імʼя", fPhone: "Телефон", fWood: "Що замовляєте", fVol: "Кількість", fAddr: "Адреса або район", fMsg: "Коментар (необовʼязково)",
    fBtn: "Замовити дрова", fPolicy: "Натискаючи кнопку, ви погоджуєтесь на обробку даних для звʼязку з вами.",
    fOk: "Дякуємо! Заявку прийнято — передзвонимо протягом 5 хвилин.", fErr: "Не вдалося надіслати. Подзвоніть нам, будь ласка:",
    orWrite: "або напишіть", footer: "Дрова, паливні брикети, пелети, вугілля та пісок з доставкою в Миколаєві та області.", hoursL: "Працюємо",
    mobCall: "Подзвонити", mobOrder: "Замовити",
  },
  ru: {
    lang: "ru", path: "/ru/", other: "/", otherLabel: "UA",
    title: "Дрова Николаев — купить дрова, брикеты, пеллеты, уголь с доставкой",
    desc: `Дрова в Николаеве: колотые, пиленые, метровые. Топливные брикеты, пеллеты, уголь ДГ, песок. Доставка в день заказа, оплата после разгрузки. ☎ ${site.phoneHuman}`,
    nav: ["Каталог", "Калькулятор", "Доставка", "Вопросы"],
    call: "Позвонить",
    heroBadge: "Сезон 2026/27 · дрова в наличии",
    heroH1: "Дрова и топливо<br>в Николаеве с доставкой <span>сегодня</span>",
    heroSub: `Колотые, пиленые и метровые дрова, топливные брикеты, пеллеты, уголь ДГ и песок. Честный объём, бесплатная доставка дров от ${deliveryFreeFrom} м³, оплата после разгрузки.`,
    heroCta: "Рассчитать стоимость", heroCta2: "Заказать звонок",
    heroPoints: ["Доставка за 2–4 часа", "Оплата по факту", "Влажность до 25%"],
    trust: [["5", "видов топлива и материалов"], ["2–4 ч", "доставка по городу"], ["0 грн", "предоплата"], ["от 1 м³", "минимальный заказ"]],
    pricesH: "Каталог и цены", pricesSub: "Дрова, брикеты, пеллеты, уголь и песок с доставкой по Николаеву и области. Точную цену на брикеты, пеллеты, уголь и песок назовём по телефону — зависит от объёма и фасовки.", ask: "цена по телефону",
    from: "от", unit: "грн/скл.м³", heat: "Теплоотдача", order: "Заказать",
    calcH: "Калькулятор стоимости дров", calcSub: "Посчитайте цену за 10 секунд — и получите скидку 5% при заказе через сайт.",
    calcWood: "Вид дров", calcVol: "Объём, складометров", calcLen: "Длина полена", calcLenOpts: ["30–40 см (стандарт)", "до 25 см (для камина, +100 грн/м³)", "50 см (+0 грн)"], calcMeter: "Метровые — полено 1 м",
    calcTotal: "Итого с доставкой", calcDelivery: "Доставка", calcFree: "бесплатно", calcDisc: "Скидка за сайт −5%", calcBtn: "Оформить по этой цене",
    whyH: "Почему заказывают у нас", why: [
      ["📏", "Честный складометр", "Укладываем дрова ровно в кузове и меряем рулеткой при вас. Не понравилось — не платите."],
      ["🔥", "Сухие дрова", "Влажность до 25% — дрова горят, а не шипят. Покажем влагомер на месте."],
      ["🚚", "Доставка сегодня", "Свой транспорт и самосвалы. Дрова, топливо и песок привезём в день заказа по всему Николаеву."],
      ["💳", "Оплата по факту", "Никаких предоплат. Наличные или перевод на карту после разгрузки."],
      ["🪓", "Дрова любой длины", "Колотые и пиленые — полено 25, 30–40 или 50 см. Метровые — для тех, кто колет сам и хочет сэкономить."],
      ["🧾", "Документы", "Работаем с ОСМД, школами и бизнесом — счёт, накладная, договор."],
    ],
    stepsH: "Как мы работаем", steps: [
      ["Заявка", "Звонок, Viber/Telegram или форма на сайте"],
      ["Подтверждение", "Уточняем породу, объём и время за 5 минут"],
      ["Доставка", "Привозим и разгружаем в удобное место"],
      ["Оплата", "Меряете объём, проверяете качество — и только потом платите"],
    ],
    delivH: "Доставка дров по Николаеву и области", delivSub: `Бесплатно от ${deliveryFreeFrom} складометров по городу. Меньшие объёмы — ${deliveryFee} грн. По области — рассчитаем по телефону.`,
    delivNote: "Доставляем во все районы города и пригород:",
    revH: "Отзывы клиентов",
    reviews: [], // TODO: реальні відгуки: ["Імʼя, район", "Текст"]
    faqH: "Частые вопросы", faq: [
      ["Что такое складометр и чем он отличается от насыпного?", "Складометр — это 1 м³ ровно сложенных поленьев. Насыпной метр — дрова навалом, в нём до 30% воздуха. Мы продаём именно складометры, поэтому вы получаете больше древесины за те же деньги."],
      ["Насколько сухие дрова?", "Влажность наших дров — до 25%. Это оптимально для котлов, печей и каминов: дрова легко разжигаются и дают максимум тепла."],
      ["Как быстро привезёте?", "Обычно за 2–4 часа после звонка в пределах Николаева. Можно договориться на конкретную дату и время."],
      ["Нужна ли предоплата?", "Нет. Оплата наличными или переводом после разгрузки и проверки объёма."],
      ["Какие дрова лучше для котла?", "Дуб, граб и акация — самая высокая теплоотдача и самое долгое горение. Для экономии — микс твёрдых пород."],
      ["Какие пеллеты и брикеты у вас есть?", "Агропеллеты и подсолнечные пеллеты — в мешках или на паллетах. Брикеты: древесные, торфяные и из лузги подсолнечника. Подскажем, что лучше подойдёт именно для вашего котла."],
      ["Какой уголь вы продаёте?", "Уголь марки ДГ для котлов и печей — навалом или в мешках, с доставкой по Николаеву и области."],
      ["Какой песок можно заказать?", "Речной мытый песок и карьерный жёлтый песок — для строительства, стяжки, кладки и благоустройства. Привезём нужный объём самосвалом."],
      ["Можно заказать 1–2 кубометра?", `Да, от 1 складометра. Доставка малых объёмов — ${deliveryFee} грн, от ${deliveryFreeFrom} м³ — бесплатно.`],
    ],
    formH: "Закажите дрова сейчас", formSub: "Оставьте номер — перезвоним за 5 минут, уточним детали и время доставки.",
    fName: "Ваше имя", fPhone: "Телефон", fWood: "Что заказываете", fVol: "Количество", fAddr: "Адрес или район", fMsg: "Комментарий (необязательно)",
    fBtn: "Заказать дрова", fPolicy: "Нажимая кнопку, вы соглашаетесь на обработку данных для связи с вами.",
    fOk: "Спасибо! Заявка принята — перезвоним в течение 5 минут.", fErr: "Не удалось отправить. Позвоните нам, пожалуйста:",
    orWrite: "или напишите", footer: "Дрова, топливные брикеты, пеллеты, уголь и песок с доставкой в Николаеве и области.", hoursL: "Работаем",
    mobCall: "Позвонить", mobOrder: "Заказать",
  },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const fmt = (n) => n.toLocaleString("uk-UA").replace(/ /g, " ");

function page(L) {
  const t = T[L];
  const name = (p) => p[L];
  const unit = (i) => (L === "uk" ? i.unitUk : i.unitRu);
  const ids = ["prices", "calc", "delivery", "faq"];
  const canonical = site.domain + t.path;
  const hours = L === "uk" ? site.hours : site.hoursRu;
  const minPrice = Math.min(...products.map((p) => p.price));

  const ld = [
    {
      "@context": "https://schema.org", "@type": "LocalBusiness", name: site.brand,
      description: t.desc, url: canonical, telephone: site.phone, priceRange: "₴₴",
      address: { "@type": "PostalAddress", addressLocality: L === "uk" ? "Миколаїв" : "Николаев", addressRegion: L === "uk" ? "Миколаївська область" : "Николаевская область", addressCountry: "UA" },
      geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
      areaServed: { "@type": "City", name: L === "uk" ? "Миколаїв" : "Николаев" },
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "08:00", closes: "20:00" },
      hasOfferCatalog: { "@type": "OfferCatalog", name: t.pricesH, itemListElement: catalog.map((c) => ({ "@type": "OfferCatalog", name: name(c),
        itemListElement: c.items.map((i) => ({ "@type": "Offer", priceCurrency: "UAH", ...(i.price ? { price: i.price } : {}), itemOffered: { "@type": "Product", name: name(i) } })) })) },
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
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
<header class="top">
  <div class="wrap top-in">
    <a class="logo" href="${t.path}"><img src="/favicon.svg" alt="" width="32" height="32"><span>${site.brand}</span></a>
    <nav class="nav">${t.nav.map((n, i) => `<a href="#${ids[i]}">${n}</a>`).join("")}</nav>
    <div class="top-actions">
      <a class="lang" href="${t.other}" hreflang="${t.other === "/" ? "uk" : "ru"}">${t.otherLabel}</a>
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
          <a class="btn btn-lg" href="#calc">${t.heroCta}</a>
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

  <section class="trust">
    <div class="wrap trust-in">${t.trust.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("")}</div>
  </section>

  <section id="prices" class="sec">
    <div class="wrap">
      <h2>${t.pricesH}</h2>
      <p class="sub">${t.pricesSub}</p>
      <div class="grid products">${productCards}
      </div>
    </div>
  </section>

  <section id="calc" class="sec sec-dark">
    <div class="wrap calc-in">
      <div>
        <h2>${t.calcH}</h2>
        <p class="sub">${t.calcSub}</p>
        <form class="calc" id="calcForm" onsubmit="return false">
          <label>${t.calcWood}<select id="cWood">${woodOptions}</select></label>
          <label>${t.calcVol}: <output id="cVolOut">4</output>
            <input id="cVol" type="range" min="1" max="20" step="1" value="4"></label>
          <label>${t.calcLen}<select id="cLen">${t.calcLenOpts.map((o, i) => `<option value="${[0, 100, 0][i]}">${o}</option>`).join("")}</select></label>
        </form>
      </div>
      <div class="calc-res card">
        <div class="row"><span id="rWood"></span><b id="rBase"></b></div>
        <div class="row"><span>${t.calcDelivery}</span><b id="rDel"></b></div>
        <div class="row disc"><span>${t.calcDisc}</span><b id="rDisc"></b></div>
        <div class="total"><span>${t.calcTotal}</span><b id="rTotal"></b></div>
        <a class="btn btn-lg btn-block" href="#order" id="calcGo">${t.calcBtn}</a>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <h2>${t.whyH}</h2>
      <div class="grid why">${t.why.map(([i, h, p]) => `<div class="card"><div class="ico">${i}</div><h3>${h}</h3><p>${p}</p></div>`).join("")}</div>
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

  <section id="faq" class="sec">
    <div class="wrap narrow">
      <h2>${t.faqH}</h2>
      ${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n      ")}
    </div>
  </section>

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

<footer class="foot">
  <div class="wrap foot-in">
    <div><b>${site.brand}</b><p>${t.footer}</p></div>
    <div><p>${t.hoursL}: ${hours}</p><p><a href="tel:${site.phone}">${site.phoneHuman}</a></p></div>
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

mkdirSync("public/ru", { recursive: true });
writeFileSync("public/index.html", page("uk"));
writeFileSync("public/ru/index.html", page("ru"));
writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${["/", "/ru/"].map((p) => `  <url><loc>${site.domain}${p}</loc><changefreq>weekly</changefreq><xhtml:link rel="alternate" hreflang="uk" href="${site.domain}/"/><xhtml:link rel="alternate" hreflang="ru" href="${site.domain}/ru/"/></url>`).join("\n")}
</urlset>
`);
writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.domain}/sitemap.xml\n`);
console.log("built: public/index.html, public/ru/index.html, sitemap.xml, robots.txt");
