# 🔌 API Documentation

Complete API reference for the Hotel Booking System.

---

## 📋 Table of Contents

- [Bookings API](#bookings-api)
- [Payments API](#payments-api)
- [Properties API](#properties-api)
- [Webhooks](#webhooks)
- [Cron Jobs](#cron-jobs)

---

## 🏨 Bookings API

### Create a Booking

**Endpoint:** `POST /api/bookings`

**Description:** Create a new booking and send confirmation notifications via email and WhatsApp.

**Request Body:**
```json
{
  "propertyId": "clxx123...",
  "guestId": "clxx456...",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "guestPhone": "+1234567890",
  "checkIn": "2025-12-01",
  "checkOut": "2025-12-05",
  "adults": 2,
  "children": 1,
  "infants": 0,
  "specialRequests": "Late check-in please"
}
```

**Response:**
```json
{
  "booking": {
    "id": "clxx789...",
    "status": "PENDING",
    "totalPrice": 450.00,
    "nights": 4,
    "checkIn": "2025-12-01T00:00:00.000Z",
    "checkOut": "2025-12-05T00:00:00.000Z",
    "property": { ... },
    "guest": { ... }
  },
  "message": "Booking created successfully. Confirmation sent to your email and WhatsApp!"
}
```

**Status Codes:**
- `201` - Booking created successfully
- `400` - Invalid input or property unavailable
- `404` - Property not found
- `500` - Server error

---

### Get User Bookings

**Endpoint:** `GET /api/bookings?userId={userId}&status={status}`

**Description:** Retrieve all bookings for a specific user.

**Query Parameters:**
- `userId` (required) - User ID
- `status` (optional) - Filter by status: `PENDING`, `CONFIRMED`, `CANCELLED`, etc.

**Response:**
```json
{
  "bookings": [
    {
      "id": "clxx789...",
      "status": "CONFIRMED",
      "checkIn": "2025-12-01T00:00:00.000Z",
      "checkOut": "2025-12-05T00:00:00.000Z",
      "totalPrice": 450.00,
      "property": {
        "title": "Luxury Beach Villa",
        "images": [...]
      },
      "payment": { ... }
    }
  ]
}
```

---

### Get Booking Details

**Endpoint:** `GET /api/bookings/{bookingId}`

**Description:** Get detailed information about a specific booking.

**Response:**
```json
{
  "booking": {
    "id": "clxx789...",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "checkIn": "2025-12-01T00:00:00.000Z",
    "checkOut": "2025-12-05T00:00:00.000Z",
    "nights": 4,
    "adults": 2,
    "totalPrice": 450.00,
    "status": "CONFIRMED",
    "property": {
      "title": "Luxury Beach Villa",
      "address": "123 Beach Road",
      "amenities": [...],
      "host": {
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    },
    "payment": {
      "status": "SUCCEEDED",
      "amount": 450.00
    },
    "notifications": [...]
  }
}
```

---

### Update Booking Status

**Endpoint:** `PATCH /api/bookings/{bookingId}`

**Description:** Update the status of a booking.

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valid Statuses:**
- `PENDING`
- `CONFIRMED`
- `CHECKED_IN`
- `CHECKED_OUT`
- `CANCELLED`
- `COMPLETED`

**Response:**
```json
{
  "booking": { ... },
  "message": "Booking confirmed successfully"
}
```

---

### Cancel Booking

**Endpoint:** `DELETE /api/bookings/{bookingId}?reason={reason}`

**Description:** Cancel a booking and process refund based on cancellation policy.

**Query Parameters:**
- `reason` (optional) - Reason for cancellation

**Cancellation Policy:**
- **>24 hours before check-in:** 100% refund
- **0-24 hours before:** 50% refund
- **After check-in:** No refund

**Response:**
```json
{
  "booking": { ... },
  "refundAmount": 450.00,
  "message": "Booking cancelled successfully. Cancellation confirmation sent to your email and WhatsApp."
}
```

**Notifications Sent:**
- ✅ Email confirmation to guest
- ✅ WhatsApp message to guest
- ✅ Email notification to host

---

## 💳 Payments API

### Create Payment Intent

**Endpoint:** `POST /api/payments/create-intent`

**Description:** Create a Stripe payment intent for a booking.

**Request Body:**
```json
{
  "bookingId": "clxx789..."
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "payment": {
    "id": "clxx123...",
    "bookingId": "clxx789...",
    "amount": 450.00,
    "currency": "USD",
    "status": "PENDING",
    "stripePaymentId": "pi_xxx..."
  }
}
```

**Usage:**
Use the `clientSecret` with Stripe.js to complete payment on the frontend.

---

## 🏠 Properties API

### Check Property Availability

**Endpoint:** `GET /api/properties/{propertyId}/availability?checkIn={date}&checkOut={date}`

**Description:** Check if a property is available for booking on specific dates.

**Query Parameters:**
- `checkIn` (optional) - Check-in date (ISO format)
- `checkOut` (optional) - Check-out date (ISO format)

**Without dates (get all booked dates):**
```http
GET /api/properties/clxx123/availability
```

**Response:**
```json
{
  "bookedDates": [
    "2025-12-01",
    "2025-12-02",
    "2025-12-03"
  ]
}
```

**With dates (check specific range):**
```http
GET /api/properties/clxx123/availability?checkIn=2025-12-01&checkOut=2025-12-05
```

**Response:**
```json
{
  "available": false,
  "reason": "Property is already booked for these dates"
}
```

---

## 🔔 Webhooks

### Stripe Webhook

**Endpoint:** `POST /api/webhooks/stripe`

**Description:** Handle Stripe webhook events for payment processing.

**Headers Required:**
```
stripe-signature: t=xxx,v1=xxx
```

**Events Handled:**
- `payment_intent.succeeded` - Updates booking to CONFIRMED
- `payment_intent.payment_failed` - Updates payment status to FAILED
- `charge.refunded` - Updates payment status to REFUNDED

**Setup:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
4. Copy webhook secret to `.env`

---

## ⏰ Cron Jobs

### Send Check-in Reminders

**Endpoint:** `GET /api/cron/send-reminders`

**Description:** Send reminder emails and WhatsApp messages to guests checking in tomorrow.

**Authentication:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Response:**
```json
{
  "success": true,
  "remindersSent": 5,
  "message": "Successfully sent 5 check-in reminders"
}
```

**Setup:**

1. **Add cron secret to `.env`:**
   ```env
   CRON_SECRET="your-random-secret"
   ```

2. **Configure cron service:**
   - **URL:** `https://yourdomain.com/api/cron/send-reminders`
   - **Schedule:** `0 9 * * *` (daily at 9 AM)
   - **Headers:** `Authorization: Bearer YOUR_CRON_SECRET`

3. **Recommended services:**
   - Vercel Cron (if deployed on Vercel)
   - cron-job.org (free)
   - EasyCron (free tier)

**What it does:**
- Finds all bookings with check-in tomorrow
- Sends email reminder with:
  - Property details
  - Check-in instructions
  - Host contact info
- Sends WhatsApp reminder
- Logs all sent notifications

---

## 🔐 Authentication

Most endpoints require authentication (to be implemented with NextAuth):

```javascript
// Example with session
const session = await getSession({ req })
if (!session) {
  return res.status(401).json({ error: 'Unauthorized' })
}
```

---

## 📊 Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "errors": ["Validation error 1", "Validation error 2"]
}
```

---

## 🚀 Example Usage

### Complete Booking Flow

```javascript
// 1. Check availability
const availability = await fetch(
  `/api/properties/${propertyId}/availability?checkIn=2025-12-01&checkOut=2025-12-05`
)

if (!availability.available) {
  console.log('Property not available')
  return
}

// 2. Create booking
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId,
    guestId: user.id,
    guestName: user.name,
    guestEmail: user.email,
    guestPhone: user.phone,
    checkIn: '2025-12-01',
    checkOut: '2025-12-05',
    adults: 2
  })
})

// ✅ Email sent automatically
// ✅ WhatsApp sent automatically

// 3. Create payment intent
const payment = await fetch('/api/payments/create-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookingId: booking.id
  })
})

// 4. Process payment with Stripe.js
const stripe = await loadStripe(publishableKey)
const { error } = await stripe.confirmCardPayment(
  payment.clientSecret,
  {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: user.name,
        email: user.email
      }
    }
  }
)

// 5. Webhook updates booking to CONFIRMED
// ✅ Booking confirmed
// ✅ Guest receives confirmation
```

---

## 📝 Testing with cURL

### Create a booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "clxx123",
    "guestId": "clxx456",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+1234567890",
    "checkIn": "2025-12-01",
    "checkOut": "2025-12-05",
    "adults": 2
  }'
```

### Check availability
```bash
curl "http://localhost:3000/api/properties/clxx123/availability?checkIn=2025-12-01&checkOut=2025-12-05"
```

### Cancel booking
```bash
curl -X DELETE "http://localhost:3000/api/bookings/clxx789?reason=Change%20of%20plans"
```

---

## 🔍 Rate Limits

- **Resend:** 100 emails/day (free tier)
- **Twilio:** Rate limits vary by plan
- **Stripe:** Test mode has no limits

---

## 📞 Support

For issues or questions:
- Check the [Setup Guide](./SETUP_GUIDE.md)
- Review Prisma schema in `/prisma/schema.prisma`
- Check logs in browser console and server logs
