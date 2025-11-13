# 🏨 Complete Hotel Booking System

A full-featured hotel booking system built with Next.js 13, Prisma, and multi-channel notifications (Email, SMS, WhatsApp).

## ✨ Features

### Core Functionality
- ✅ **Complete Booking Flow** - Search rooms, select dates, book instantly
- ✅ **Multi-Channel Notifications** - Email + SMS + WhatsApp confirmations
- ✅ **Real-Time Availability** - Check room availability for specific dates
- ✅ **User Dashboard** - View and manage bookings
- ✅ **Admin Panel** - Manage rooms and bookings
- ✅ **No Payment Required** - Free booking system (no Stripe/PayPal)

### Notification System
- 📧 **Email** - Beautiful HTML confirmation emails via Resend
- 📱 **SMS** - Text message confirmations via Twilio
- 💬 **WhatsApp** - WhatsApp message confirmations via Twilio
- 🎯 **Demo Mode** - All notifications work without API keys for testing

### Database
- 🗄️ SQLite database with Prisma ORM
- 📊 Models: Users, Rooms, Bookings, Reviews, Settings
- 🌱 Pre-seeded with 6 sample rooms and admin user

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Database is Already Set Up!
The database is already initialized with sample data. If you need to reset it:
\`\`\`bash
npx prisma migrate reset
npm run seed
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit **http://localhost:3000** to see the application!

## 📱 Testing the Booking Flow

### Quick Test URLs

#### 1. Browse Available Rooms
\`\`\`
http://localhost:3000/listing-stay
\`\`\`

#### 2. Make a Booking (Example)
Get a room ID from the database first, then:
\`\`\`
http://localhost:3000/book?roomId=<room-id>&checkIn=2024-12-20&checkOut=2024-12-25&guests=2
\`\`\`

#### 3. View All Your Bookings
\`\`\`
http://localhost:3000/my-bookings
\`\`\`

#### 4. Admin Dashboard
\`\`\`
http://localhost:3000/admin
\`\`\`

### Complete Booking Flow Test

1. **Start the server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Open your browser** and go to the booking page with test parameters:
   \`\`\`
   http://localhost:3000/book?roomId=<any-room-id>&checkIn=2024-12-20&checkOut=2024-12-25&guests=2
   \`\`\`

3. **Fill in guest details**:
   - Name: John Doe
   - Email: test@example.com
   - Phone: +1234567890 (optional, for SMS)
   - WhatsApp: +1234567890 (optional, for WhatsApp)

4. **Click "Confirm Booking"**

5. **Check the terminal** for notification logs (they run in demo mode):
   \`\`\`
   📧 [DEMO MODE] Booking confirmation email would be sent to: test@example.com
   Confirmation Code: ABC12345
   📱 [DEMO MODE] SMS would be sent to: +1234567890
   💬 [DEMO MODE] WhatsApp message would be sent to: +1234567890
   \`\`\`

6. **You'll be redirected** to the confirmation page showing:
   - Your unique confirmation code
   - Full booking details
   - Notification status

7. **View your booking** by going to:
   \`\`\`
   http://localhost:3000/my-bookings?email=test@example.com
   \`\`\`

## 📧 Notifications Setup

The system works in **DEMO MODE** by default (no API keys needed). Notifications are logged to console.

### To Enable Real Notifications

#### Email (Resend) - FREE
1. Sign up at [resend.com](https://resend.com)
   - Free tier: 100 emails/day
   - No credit card required
2. Get your API key from the dashboard
3. Update `.env`:
\`\`\`env
RESEND_API_KEY=re_your_actual_key_here
\`\`\`

#### SMS & WhatsApp (Twilio) - FREE TRIAL
1. Sign up at [twilio.com](https://twilio.com)
   - Free trial: $15 credits
   - No credit card required initially
2. Get your credentials from the console
3. For WhatsApp, use Twilio Sandbox: `whatsapp:+14155238886`
4. Update `.env`:
\`\`\`env
TWILIO_ACCOUNT_SID=ACyour_actual_sid_here
TWILIO_AUTH_TOKEN=your_actual_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
\`\`\`

## 💾 Pre-Loaded Sample Data

### Admin User
- **Email**: `admin@hotel.com`
- **Password**: `admin123`
- **Role**: Admin

### 6 Sample Rooms

1. **Deluxe Ocean View Suite** - $299.99/night
   - 4 guests, 2 bedrooms, 2 bathrooms
   - Ocean view, private balcony, mini bar

2. **Executive Suite with City View** - $199.99/night
   - 2 guests, 1 bedroom, 1 bathroom
   - City view, workspace, premium amenities

3. **Family Garden Room** - $149.99/night
   - 5 guests, 2 bedrooms, 1 bathroom
   - Garden view, family-friendly, pool access

4. **Luxury Penthouse Suite** - $599.99/night
   - 6 guests, 3 bedrooms, 3 bathrooms
   - Panoramic view, jacuzzi, butler service

5. **Standard Double Room** - $89.99/night
   - 2 guests, 1 bedroom, 1 bathroom
   - Budget-friendly, comfortable

6. **Romantic Honeymoon Suite** - $349.99/night
   - 2 guests, 1 bedroom, 1 bathroom
   - Ocean view, jacuzzi, romantic decor

## 🛠️ API Routes

### Rooms API
\`\`\`
GET /api/rooms
\`\`\`
Query parameters:
- `checkIn` - Check-in date (YYYY-MM-DD)
- `checkOut` - Check-out date (YYYY-MM-DD)
- `guests` - Number of guests
- `category` - Room category filter

Example:
\`\`\`
GET /api/rooms?checkIn=2024-12-20&checkOut=2024-12-25&guests=2
\`\`\`

### Bookings API

**Create Booking**
\`\`\`
POST /api/bookings
Body: {
  roomId, checkIn, checkOut,
  guestName, guestEmail, guestPhone, guestWhatsapp,
  guestAdults, guestChildren, guestInfants,
  specialRequests
}
\`\`\`

**Get Bookings**
\`\`\`
GET /api/bookings?email=user@example.com
GET /api/bookings?confirmationCode=ABC12345
\`\`\`

**Get Specific Booking**
\`\`\`
GET /api/bookings/[id]
\`\`\`

**Update Booking Status**
\`\`\`
PATCH /api/bookings/[id]
Body: { status: "confirmed" | "cancelled" | "completed" }
\`\`\`

**Cancel Booking**
\`\`\`
DELETE /api/bookings/[id]
\`\`\`

## 📊 Database Schema

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `firstName`, `lastName` - User name
- `phone`, `whatsapp` - Contact numbers
- `role` - "user" or "admin"
- `emailVerified` - Email verification timestamp
- `createdAt`, `updatedAt` - Timestamps

### Rooms Table
- `id` - UUID primary key
- `title` - Room name
- `description` - Detailed description
- `address` - Physical address
- `price` - Price per night
- `maxGuests` - Maximum capacity
- `bedrooms`, `bathrooms`, `beds` - Room details
- `amenities` - JSON array of amenities
- `images` - JSON array of image URLs
- `featuredImage` - Main display image
- `category` - Room category (Deluxe, Suite, etc.)
- `available` - Availability status
- `lat`, `lng` - Geolocation coordinates
- `createdAt`, `updatedAt` - Timestamps

### Bookings Table
- `id` - UUID primary key
- `userId` - Reference to user
- `roomId` - Reference to room
- `checkIn`, `checkOut` - Stay dates
- `guests`, `guestAdults`, `guestChildren`, `guestInfants` - Guest counts
- `totalPrice` - Total booking amount
- `status` - "pending", "confirmed", "cancelled", "completed"
- `guestName`, `guestEmail`, `guestPhone`, `guestWhatsapp` - Guest contact
- `specialRequests` - Additional requests
- `confirmationCode` - Unique 8-character code
- `createdAt`, `updatedAt` - Timestamps

## 🎨 Key Pages

### Public Pages
- `/` - Homepage with hero and featured rooms
- `/listing-stay` - Browse all available rooms
- `/book` - Complete booking form
- `/booking-confirmation` - View booking confirmation
- `/my-bookings` - User dashboard to manage bookings

### Admin Pages
- `/admin` - Admin dashboard
  - View all rooms
  - Manage room availability
  - View bookings (with authentication)

## 🔧 Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, HeadlessUI
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Notifications**:
  - Email: Resend
  - SMS: Twilio
  - WhatsApp: Twilio
- **Utils**: date-fns, bcryptjs, uuid

## 🌟 Key Features Explained

### 1. Real-Time Availability Checking
\`\`\`typescript
// Prevents double bookings by checking date overlaps
isDateRangeAvailable(existingBookings, newCheckIn, newCheckOut)
\`\`\`

### 2. Unique Confirmation Codes
\`\`\`typescript
// Generates codes like: AB12CD34, XY89QW56
generateConfirmationCode() // Returns 8-character code
\`\`\`

### 3. Multi-Channel Notifications
\`\`\`typescript
// Sends to all available channels simultaneously
await sendAllNotifications({
  email: "user@example.com",
  phone: "+1234567890",
  whatsapp: "+1234567890",
  // ... booking details
})
\`\`\`

### 4. Price Calculation
\`\`\`typescript
// Automatically calculates based on number of nights
const nights = calculateNights(checkIn, checkOut);
const total = room.price * nights;
\`\`\`

## 📝 Environment Variables

The `.env` file is already set up. Here's what each variable does:

\`\`\`env
# Database
DATABASE_URL="file:./dev.db"  # SQLite database location

# NextAuth (for future authentication)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Notifications (Resend)
RESEND_API_KEY="re_demo_key"  # Replace with real key

# SMS & WhatsApp (Twilio)
TWILIO_ACCOUNT_SID="ACxxxx"  # Replace with real SID
TWILIO_AUTH_TOKEN="xxx"      # Replace with real token
TWILIO_PHONE_NUMBER="+1234567890"  # Your Twilio number
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"  # Twilio sandbox

# Admin Credentials
ADMIN_EMAIL="admin@hotel.com"
ADMIN_PASSWORD="admin123"
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Hotel booking system"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env`

4. **Update Database for Production**

   Switch to PostgreSQL:

   a. Get a PostgreSQL database (free options):
      - [Neon](https://neon.tech) - Free PostgreSQL
      - [Supabase](https://supabase.com) - Free PostgreSQL
      - [Railway](https://railway.app) - Free tier

   b. Update `prisma/schema.prisma`:
   \`\`\`prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   \`\`\`

   c. Update `DATABASE_URL` in Vercel environment variables:
   \`\`\`
   DATABASE_URL="postgresql://user:password@host:5432/database"
   \`\`\`

   d. Run migrations in production:
   \`\`\`bash
   npx prisma migrate deploy
   npm run seed
   \`\`\`

5. **Deploy!**
   - Vercel will automatically build and deploy
   - Your site will be live at `https://your-project.vercel.app`

## 🧪 Testing Checklist

- [ ] Browse rooms on `/listing-stay`
- [ ] Click on a room to see details
- [ ] Go to booking page with valid parameters
- [ ] Fill in guest information
- [ ] Submit booking
- [ ] See confirmation page
- [ ] Check console for notification logs
- [ ] View booking in "My Bookings"
- [ ] Cancel a booking
- [ ] Check admin dashboard
- [ ] Verify room availability checking

## 📖 Usage Examples

### Example: Book a Room Programmatically
\`\`\`javascript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roomId: 'room-uuid-here',
    checkIn: '2024-12-20',
    checkOut: '2024-12-25',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    guestPhone: '+1234567890',
    guestAdults: 2,
    guestChildren: 1,
  })
});

const data = await response.json();
console.log('Confirmation Code:', data.booking.confirmationCode);
\`\`\`

### Example: Check Room Availability
\`\`\`javascript
const response = await fetch(
  '/api/rooms?checkIn=2024-12-20&checkOut=2024-12-25&guests=2'
);
const availableRooms = await response.json();
\`\`\`

### Example: Get User's Bookings
\`\`\`javascript
const response = await fetch('/api/bookings?email=user@example.com');
const bookings = await response.json();
\`\`\`

## 🤝 Support

If you have questions or need help:
1. Check this documentation
2. Look at the code examples
3. Test in demo mode first
4. Check the console for logs

## 🎉 You're All Set!

The system is fully functional and ready to use!

### Quick Links
- **Homepage**: http://localhost:3000
- **Browse Rooms**: http://localhost:3000/listing-stay
- **My Bookings**: http://localhost:3000/my-bookings
- **Admin**: http://localhost:3000/admin

### Next Steps
1. Test the booking flow
2. Set up real notification API keys (optional)
3. Customize the rooms and pricing
4. Add your own branding
5. Deploy to production!

Happy booking! 🏨✨
