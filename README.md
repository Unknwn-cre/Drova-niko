# Дрова Ніко — продающий лендинг (Николаев)

Статический лендинг (UA `/` + RU `/ru/`) на Cloudflare Workers Static Assets + Worker для заявок → Telegram.

## Что поменять перед запуском
Всё в `scripts/site.config.mjs`: телефон, Telegram, Viber, домен, цены, районы. Затем `npm run build`.
Тексты (отзывы, цифры доверия «2 400+ доставок» и т.п.) — в `scripts/build.mjs`. **Отзывы — примеры, замените на реальные.**

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
