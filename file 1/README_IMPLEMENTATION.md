# 🏨 Hotel Booking System - Full Stack Implementation

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-13.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38B2AC)

**A production-ready hotel booking system with FREE email & WhatsApp notifications**

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Demo](#demo)

</div>

---

## ✨ Features

### 🎯 Core Functionality

- ✅ **Complete Booking Engine**
  - Real-time availability checking
  - Date range validation
  - Overlap detection (prevents double bookings)
  - Guest capacity validation
  - Dynamic pricing calculation
  - Minimum/maximum night requirements
  - Blocked dates support

- ✅ **FREE Email Notifications** (Resend API)
  - 3,000 emails/month on free tier
  - Beautiful HTML templates
  - Booking confirmations
  - Host notifications
  - Cancellation confirmations
  - 24-hour check-in reminders
  - Tracked in database

- ✅ **FREE WhatsApp Notifications** (Twilio)
  - $15.50 free credit
  - Instant booking confirmations
  - Cancellation notices
  - Check-in reminders
  - Host alerts
  - Tracked in database

- ✅ **Stripe Payment Processing**
  - Secure card payments
  - Payment Intent API
  - Webhook integration
  - Refund processing
  - Payment tracking

- ✅ **Smart Cancellation Policy**
  - Automatic refund calculation
  - Time-based refund rules
  - >24h before: 100% refund
  - 0-24h before: 50% refund
  - After check-in: No refund

- ✅ **Automated Reminders**
  - Cron job for daily reminders
  - Sends 24 hours before check-in
  - Email + WhatsApp
  - Free cron services compatible

### 🎨 Frontend (Existing Template)

- Modern Next.js 13 with App Directory
- Tailwind CSS with dark mode
- Responsive design
- 80+ reusable components
- Framer Motion animations
- Google Maps integration

### 🗄️ Database & Backend

- **PostgreSQL** with Prisma ORM
- Complete schema for:
  - Users & Authentication
  - Properties & Listings
  - Bookings & Reservations
  - Payments & Transactions
  - Reviews & Ratings
  - Notifications tracking
  - Analytics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
npx prisma generate
npx prisma migrate dev

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions
- **[API Documentation](./API_DOCUMENTATION.md)** - Full API reference
- **[Environment Variables](./.env.example)** - Configuration template

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Stays   │  │ Checkout │  │ Bookings │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Bookings │  │ Payments │  │  Cron    │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
         │               │               │
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Prisma     │ │    Stripe    │ │    Resend    │
│  (Database)  │ │  (Payments)  │ │   (Email)    │
└──────────────┘ └──────────────┘ └──────────────┘
         │                              │
         ▼                              ▼
┌──────────────┐                ┌──────────────┐
│  PostgreSQL  │                │    Twilio    │
│              │                │  (WhatsApp)  │
└──────────────┘                └──────────────┘
```

---

## 🗂️ Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Directory
│   │   ├── api/               # API Routes
│   │   │   ├── bookings/      # Booking endpoints
│   │   │   ├── payments/      # Payment endpoints
│   │   │   ├── webhooks/      # Webhook handlers
│   │   │   └── cron/          # Cron job endpoints
│   │   ├── checkout/          # Checkout pages
│   │   ├── (stay-listings)/   # Property listings
│   │   └── ...
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts         # Database client
│   │   ├── booking-utils.ts  # Booking logic
│   │   ├── email.ts          # Email service (Resend)
│   │   ├── whatsapp.ts       # WhatsApp service (Twilio)
│   │   ├── notifications.ts  # Notification orchestrator
│   │   └── stripe.ts         # Payment processing
│   │
│   ├── components/            # React components
│   ├── data/                  # Mock data & types
│   └── shared/                # Shared UI components
│
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
│
├── SETUP_GUIDE.md           # Setup instructions
├── API_DOCUMENTATION.md     # API reference
└── .env.example             # Environment template
```

---

## 🔌 API Endpoints

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?userId={id}` | Get user bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| PATCH | `/api/bookings/{id}` | Update booking status |
| DELETE | `/api/bookings/{id}` | Cancel booking |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-intent` | Create payment intent |

### Properties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties/{id}/availability` | Check availability |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/stripe` | Stripe webhook handler |

### Cron Jobs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cron/send-reminders` | Send daily reminders |

---

## 💾 Database Schema

### Key Models

- **User** - Authentication & user profiles
- **Property** - Listings with details, pricing, amenities
- **Booking** - Reservations with guest info, dates, pricing
- **Payment** - Stripe payment tracking
- **Review** - Guest reviews & ratings
- **Notification** - Email & WhatsApp notification logs
- **BookingNotification** - Notification tracking per booking

See full schema in [`prisma/schema.prisma`](prisma/schema.prisma)

---

## 📧 Notification System

### Email Templates

All emails include beautiful HTML templates with:
- Booking confirmation with property details
- Host notification for new bookings
- Cancellation confirmation with refund info
- Check-in reminder with instructions

### WhatsApp Messages

Formatted text messages with:
- Booking confirmations
- Cancellation notices
- Check-in reminders
- Host notifications

### Delivery Tracking

All notifications are tracked in the database:
- Status (PENDING, SENT, DELIVERED, FAILED)
- External IDs (Resend email ID, Twilio message SID)
- Timestamps
- Error logs

---

## 💳 Payment Flow

```
1. User selects dates → Check availability
2. Create booking (status: PENDING)
3. Create Stripe Payment Intent
4. User enters card details (Stripe.js)
5. Payment processed
6. Webhook received (payment_intent.succeeded)
7. Update booking (status: CONFIRMED)
8. Send confirmation notifications
```

---

## 🔐 Environment Variables

Required services:

1. **Database** - PostgreSQL (Neon, Supabase, or local)
2. **Email** - Resend (3,000 free emails/month)
3. **WhatsApp** - Twilio ($15.50 free credit)
4. **Payments** - Stripe (test mode free)

See [`.env.example`](./.env.example) for complete list.

---

## 🧪 Testing

### Test Booking Flow

```javascript
// 1. Check availability
GET /api/properties/{id}/availability?checkIn=2025-12-01&checkOut=2025-12-05

// 2. Create booking
POST /api/bookings
{
  "propertyId": "...",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-05",
  "adults": 2
}

// ✅ Confirmation email sent
// ✅ WhatsApp message sent

// 3. Create payment
POST /api/payments/create-intent
{
  "bookingId": "..."
}

// 4. Complete payment with Stripe test card
// Card: 4242 4242 4242 4242
```

### Test Cards (Stripe)

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`

---

## 📊 Features Implemented

### Backend ✅

- [x] Prisma ORM with PostgreSQL
- [x] Complete database schema
- [x] Booking engine with availability checking
- [x] Email notifications (Resend)
- [x] WhatsApp notifications (Twilio)
- [x] Stripe payment processing
- [x] Webhook handlers
- [x] Cancellation policy logic
- [x] Automated reminders cron job
- [x] API routes for all operations

### Frontend (To Be Enhanced)

- [ ] Booking form integration
- [ ] Stripe payment UI
- [ ] Booking management dashboard
- [ ] Real-time availability calendar
- [ ] User profile with booking history
- [ ] Review submission

---

## 🌟 Next Steps

See the remaining todos for frontend enhancements:

1. **Integrate Booking API with UI** - Connect existing checkout form to backend
2. **Add Stripe Payment Component** - Use @stripe/stripe-js for payment UI
3. **Create Availability Calendar** - Show blocked/booked dates visually
4. **Build User Dashboard** - Display bookings, history, reviews
5. **Add Review System** - Allow guests to submit reviews
6. **Admin Panel** - Manage bookings, properties, users

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# - Connect repository
# - Add environment variables
# - Deploy

# 3. Set up Stripe webhook
# https://yourdomain.com/api/webhooks/stripe

# 4. Configure cron job (automatic on Vercel)
```

### Other Platforms

- Railway
- Render
- AWS
- Google Cloud

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

---

## 📞 Support

- 📖 [Setup Guide](./SETUP_GUIDE.md)
- 📚 [API Documentation](./API_DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/yourusername/hotel-booking/issues)

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Resend for free email service
- Twilio for WhatsApp integration
- Stripe for payment processing

---

<div align="center">

**Built with ❤️ using Next.js, Prisma, and TypeScript**

⭐ Star this repo if you find it helpful!

</div>
