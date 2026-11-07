# Дрова Ніко — продающий лендинг (Николаев)

Статический лендинг на украинском (`/`; старый `/ru/` → 301 на главную) на Cloudflare Workers Static Assets + Worker для заявок → Telegram.

## Что поменять перед запуском
Всё в `scripts/site.config.mjs`: телефон, Telegram, Viber, домен, каталог и цены (price: null → «ціна за телефоном»), районы. Затем `npm run build`.
Тексты и отзывы — в `scripts/build.mjs` (блок отзывов появляется, когда массив `reviews` не пустой).

## Заявки в Telegram
```
npx wrangler secret put TELEGRAM_BOT_TOKEN   # токен от @BotFather
npx wrangler secret put TELEGRAM_CHAT_ID     # id чата/группы, куда слать заявки
```
Без секретов форма работает, а заявки пишутся в логи воркера.

## Команды
- `npm run dev` — локально (wrangler dev)
- `npm run deploy` — сборка и деплой воркера `drova-niko`

Если воркер подключён к GitHub через Cloudflare Workers Builds: build command `npm run build`, deploy command `npx wrangler deploy`.
