# Raha Plaza Booking System

A high-concurrency, production-ready hotel booking engine built with Next.js 14, Prisma, and PostgreSQL.

## Features

- **Zero Booking Fees**: Direct guest-to-owner reservation flow.
- **Concurrency Safe**: Prevents overbooking using database transactions and atomic locks.
- **Timezone Aware**: Handles `Asia/Riyadh` property time strictly.
- **Notifications**: Email (SMTP) and Telegram alerts.
- **Calendar Integration**: ICS file generation for calendar apps.
- **Elegant UI**: Kempinski-inspired luxury hotel design.

## Quick Start

### 1. Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Database (Local)

```bash
docker-compose up -d
```

### 3. Install & Seed

```bash
npm install
npx prisma migrate dev --name init
npm run seed
```

### 4. Run

```bash
npm run dev
```

Visit http://localhost:3000. MailHog UI available at http://localhost:8025 to view emails.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Notifications**: Nodemailer + Telegram Bot API
- **Calendar**: ICS file generation

## Project Structure

```
apps/web/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── book/            # Booking page
│   ├── cancel/          # Cancellation page
│   └── success/         # Confirmation page
├── components/          # React components
├── emails/              # Email templates
├── lib/                 # Utilities (db, validation, etc.)
├── prisma/              # Database schema & migrations
└── public/              # Static assets
```

## API Endpoints

- `POST /api/search` - Search available rooms
- `POST /api/reservations/confirm` - Create reservation
- `POST /api/reservations/cancel` - Cancel reservation
- `GET /api/ics/[code]` - Download calendar file
- `GET /api/health` - Health check

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Database

Provision a PostgreSQL instance (Neon, Supabase, or RDS).

### App

Deploy to Vercel:
- Set environment variables
- Build command: `npx prisma migrate deploy && next build`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username (optional) |
| `SMTP_PASS` | SMTP password (optional) |
| `SMTP_FROM` | From email address |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token (optional) |
| `TELEGRAM_CHAT_ID` | Telegram chat ID (optional) |
| `PROPERTY_TZ` | Property timezone (default: Asia/Riyadh) |
| `NEXT_PUBLIC_BASE_URL` | Public base URL |

## License

MIT
