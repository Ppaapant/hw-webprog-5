# Лабораторні роботи №4–6 — Node.js бекенд + статичний сайт

**ЛР6:** Sails.js + **Nodemailer + Brevo SMTP** + zrok  
(у методичці для варіанту 24 зазначено SMTP2GO; через неможливість реєстрації використано еквівалент — транзакційну пошту **Brevo** через SMTP, узгодьте формулювання з викладачем.)

## Стек

- **Sails.js** — Node.js веб-фреймворк, роздає статичний сайт з `assets/` та обробляє API
- **Nodemailer + Brevo SMTP** — надсилання email з форми зворотного зв’язку
- **zrok** — тунелювання локального сервера в публічний URL

## Як запустити

### 1. Залежності

```bash
npm install
```

### 2. Налаштувати `.env`

```bash
cp .env.example .env
```

**Brevo** ([реєстрація](https://www.brevo.com/), кабінет [app.brevo.com](https://app.brevo.com/)):

1. **Transactional** → **SMTP & API** → згенеруйте **SMTP key** (не пароль входу на сайт).
2. **BREVO_SMTP_LOGIN** — email, яким ви входите в Brevo.
3. **Senders** — додайте й підтвердіть адресу відправника; у **MAIL_FROM** вкажіть ту саму (або формат `Ім’я <email@...>`).
4. **MAIL_TO** — ваша пошта, куди приходитимуть листи з форми.

Сервер: `smtp-relay.brevo.com`, порт **587** (уже в `.env.example`).

### 3. Запустити

```bash
npm start
```

### 4. Тунель zrok

```bash
npm run tunnel
# або: zrok share public http://localhost:1337
```

Детальніше: [docs.zrok.io/docs/getting-started](https://docs.zrok.io/docs/getting-started).

## API

### `GET /`

Головна сторінка (`assets/index.html`).

### `POST /api/contact`

JSON: `name` (2–100), `email`, `subject` (2–200), `message` (5–5000).

- `200` — успіх  
- `400` — валідація  
- `502` — помилка SMTP

## Що реалізовано

**ЛР4 (фронт):** `localStorage`, коментарі з JSONPlaceholder, модальна форма через 1 хв, день/ніч тема, лічильник відвідувань.

**ЛР6:** Sails, статичні файли з `assets/`, `POST /api/contact`, Nodemailer + Brevo SMTP, тунель zrok.

## Висновок

Опановано Sails.js, серверну валідацію та відправку листів через **Nodemailer** і **транзакційний SMTP (Brevo)**; для публічного доступу до локального сервера використано **zrok**.

## Посилання на коміт

https://github.com/Ppaapant/hw-webprog-5/commits/main
