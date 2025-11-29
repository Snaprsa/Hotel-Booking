# 🏨 Hotel Booking System - Complete Setup Guide

This guide will walk you through setting up a fully functional hotel booking system with:
- ✅ Complete booking engine with availability checking
- ✅ FREE email notifications (Resend - 3,000 emails/month)
- ✅ FREE WhatsApp notifications (Twilio - $15.50 free credit)
- ✅ Stripe payment processing
- ✅ Automated reminder emails
- ✅ Cancellation policy with refunds
- ✅ PostgreSQL database with Prisma ORM

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Variables](#environment-variables)
4. [Email Setup (FREE)](#email-setup-free)
5. [WhatsApp Setup (FREE)](#whatsapp-setup-free)
6. [Stripe Payment Setup](#stripe-payment-setup)
7. [Running the Application](#running-the-application)
8. [Setting Up Automated Reminders](#automated-reminders)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🔧 Prerequisites

Before you begin, make sure you have:

- **Node.js** 18+ installed
- **PostgreSQL** database (local or cloud)
- **npm** or **yarn** package manager

---

## 💾 Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```bash
   createdb hotel_booking
   ```

3. Your connection string will be:
   ```
   postgresql://username:password@localhost:5432/hotel_booking
   ```

### Option 2: Free Cloud Database (Recommended)

**Using Neon (Free PostgreSQL):**
1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string

**Using Supabase:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Run Migrations

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables for:
- Users & Authentication
- Properties & Images
- Bookings & Payments
- Reviews & Ratings
- Notifications

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hotel_booking"

# NextAuth (Generate secret: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Resend (FREE Email API)
RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="Hotel Booking <noreply@yourdomain.com>"

# Twilio (FREE WhatsApp)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_WHATSAPP_FROM="+14155238886"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"

# Optional: Cron Job Security
CRON_SECRET="your-random-secret-for-cron"
```

---

## 📧 Email Setup (FREE)

### Using Resend (Recommended - 3,000 emails/month FREE)

1. **Sign up at [resend.com](https://resend.com)**

2. **Get API Key:**
   - Go to API Keys
   - Click "Create API Key"
   - Copy the key and add to `.env`:
     ```env
     RESEND_API_KEY="re_abc123..."
     ```

3. **Add Domain (Optional for production):**
   - Go to Domains
   - Add your domain
   - Add DNS records
   - For testing, use default domain

4. **Set From Email:**
   ```env
   RESEND_FROM_EMAIL="Hotel Booking <noreply@yourdomain.com>"
   ```

### Email Features Included

- ✅ Booking confirmation emails (with beautiful HTML templates)
- ✅ Host notification emails
- ✅ Cancellation confirmation emails
- ✅ Check-in reminder emails (24 hours before)
- ✅ All emails tracked in database

---

## 💬 WhatsApp Setup (FREE)

### Using Twilio ($15.50 FREE Credit)

1. **Sign up at [twilio.com](https://www.twilio.com/try-twilio)**
   - Get $15.50 free credit (no credit card required)

2. **Set up WhatsApp Sandbox:**
   - Go to Messaging → Try it out → Send a WhatsApp message
   - Follow instructions to connect your WhatsApp
   - Send the code to join sandbox

3. **Get Credentials:**
   - Account SID: Dashboard → Account Info
   - Auth Token: Dashboard → Account Info
   - WhatsApp Number: `+14155238886` (sandbox number)

4. **Add to `.env`:**
   ```env
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_WHATSAPP_FROM="+14155238886"
   ```

### WhatsApp Features Included

- ✅ Instant booking confirmations
- ✅ Cancellation notifications
- ✅ Check-in reminders
- ✅ Host notifications for new bookings
- ✅ All messages tracked in database

### Production WhatsApp (After Testing)

For production, apply for WhatsApp Business API:
1. Go to Twilio Console → WhatsApp
2. Apply for WhatsApp Business
3. Get approved (usually 1-2 weeks)
4. Update phone number in `.env`

---

## 💳 Stripe Payment Setup

### Create Stripe Account

1. **Sign up at [stripe.com](https://stripe.com)**

2. **Get API Keys:**
   - Go to Developers → API Keys
   - Copy **Publishable key** and **Secret key**
   - Start with TEST keys (pk_test_... and sk_test_...)

3. **Add to `.env`:**
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```

### Set up Webhooks (for production)

1. **Go to Developers → Webhooks**
2. **Add endpoint:** `https://yourdomain.com/api/webhooks/stripe`
3. **Select events:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. **Copy webhook signing secret:**
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### Payment Features Included

- ✅ Secure card payments
- ✅ Payment tracking in database
- ✅ Automatic booking confirmation after payment
- ✅ Refund processing
- ✅ Payment status webhooks

---

## 🚀 Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run Database Migrations

```bash
npx prisma migrate dev
```

### 4. Seed Database (Optional)

Create sample data for testing:

```bash
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## ⏰ Automated Reminders

### Setting Up Daily Check-in Reminders

The system includes an API endpoint that sends reminder emails and WhatsApp messages 24 hours before check-in.

**Endpoint:** `GET /api/cron/send-reminders`

### Option 1: Vercel Cron (If deployed on Vercel)

Create `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

This runs daily at 9:00 AM UTC.

### Option 2: Free Cron Service (Any Platform)

**Using cron-job.org (FREE, no account needed):**

1. Go to [cron-job.org](https://cron-job.org)
2. Create a free account
3. Create new cron job:
   - **URL:** `https://yourdomain.com/api/cron/send-reminders`
   - **Schedule:** `0 9 * * *` (9 AM daily)
   - **Headers:** `Authorization: Bearer YOUR_CRON_SECRET`
4. Save and enable

**Using EasyCron (FREE tier):**

1. Sign up at [easycron.com](https://www.easycron.com)
2. Create cron job with same settings

### Security

Add to `.env`:
```env
CRON_SECRET="some-random-secret-string"
```

The cron endpoint checks this header to prevent unauthorized access.

---

## 🧪 Testing

### Test Booking Flow

1. **Create a test property** (or use existing mock data)
2. **Make a booking:**
   ```bash
   POST /api/bookings
   {
     "propertyId": "property-id",
     "guestId": "user-id",
     "guestName": "John Doe",
     "guestEmail": "john@example.com",
     "guestPhone": "+1234567890",
     "checkIn": "2025-12-01",
     "checkOut": "2025-12-05",
     "adults": 2
   }
   ```

3. **Check your email** - You should receive booking confirmation
4. **Check WhatsApp** - You should receive WhatsApp notification

### Test Payments

Use Stripe test cards:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

Any future date for expiry, any 3-digit CVC.

### Test Cancellation

```bash
DELETE /api/bookings/{bookingId}?reason=Change of plans
```

Check email and WhatsApp for cancellation notification.

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Add environment variables
   - Deploy

3. **Set up database:**
   - Use Vercel Postgres (free tier)
   - Or use Neon/Supabase
   - Run migrations after deployment

4. **Update Stripe webhook URL:**
   - Go to Stripe Dashboard → Webhooks
   - Update URL to: `https://yourdomain.vercel.app/api/webhooks/stripe`

### Deploy to Railway

1. **Push to GitHub**
2. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
3. **Add PostgreSQL:**
   - Add PostgreSQL service
   - Copy DATABASE_URL
4. **Add environment variables**
5. **Deploy**

### Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Email sending works (send test booking)
- [ ] WhatsApp sending works
- [ ] Stripe webhook configured
- [ ] Cron job configured for reminders
- [ ] Test complete booking flow

---

## 📊 Key Features Overview

### Booking Engine
- ✅ Availability checking with date range validation
- ✅ Overlap detection (prevents double bookings)
- ✅ Minimum/maximum night requirements
- ✅ Guest capacity validation
- ✅ Blocked dates support
- ✅ Dynamic pricing calculation

### Notifications
- ✅ **Email** (Resend API - 3,000 free/month)
  - Booking confirmations with beautiful HTML templates
  - Host notifications
  - Cancellation confirmations
  - Check-in reminders
- ✅ **WhatsApp** (Twilio - $15.50 free credit)
  - Instant confirmations
  - Cancellation notices
  - Reminder messages
  - Host alerts

### Payments
- ✅ Secure Stripe integration
- ✅ Payment intent creation
- ✅ Webhook handling
- ✅ Refund processing
- ✅ Payment tracking

### Cancellation Policy
- ✅ Automatic refund calculation
- ✅ Time-based refund rules:
  - >24h before: 100% refund
  - 0-24h before: 50% refund
  - After check-in: No refund
- ✅ Payment refund processing

---

## 🆘 Troubleshooting

### Emails not sending

1. Check Resend API key is correct
2. Verify domain is configured (for production)
3. Check logs: `console.log` in `/src/lib/email.ts`
4. Resend free tier limits: 3,000/month, 100/day

### WhatsApp not sending

1. Verify you've joined Twilio sandbox (send code to +14155238886)
2. Check phone number format: `+1234567890` (with country code)
3. Twilio sandbox expires after 3 days of inactivity - rejoin
4. Check Twilio console for error logs

### Database connection errors

1. Verify DATABASE_URL in `.env`
2. Check database is running
3. Run: `npx prisma db push`
4. Check Prisma logs: `npx prisma studio`

### Stripe webhook not working

1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
2. Verify webhook secret matches
3. Check webhook logs in Stripe Dashboard

---

## 📞 Support & Resources

- **Resend Docs:** https://resend.com/docs
- **Twilio WhatsApp:** https://www.twilio.com/docs/whatsapp
- **Stripe Docs:** https://stripe.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

## 🎉 You're All Set!

Your hotel booking system is now ready with:
- ✅ Full booking engine
- ✅ FREE email notifications
- ✅ FREE WhatsApp notifications
- ✅ Payment processing
- ✅ Automated reminders
- ✅ Cancellation handling

**Happy Booking! 🏨**
