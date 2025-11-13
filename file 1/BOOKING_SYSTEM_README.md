# Hotel Booking System - User Guide

## Overview

This is a fully functional hotel/apartment booking system where customers can browse properties, make reservations, and manage their bookings **without any payment required**. The system includes availability checking to prevent double bookings.

## Features

### ✅ Completed Features

1. **Property Browsing**
   - View all available hotels, apartments, and villas
   - Filter properties by category
   - View detailed property information including photos, amenities, and reviews

2. **Booking System (No Payment Required)**
   - Select check-in and check-out dates
   - Specify number of guests
   - Automatic availability checking to prevent double bookings
   - Instant booking confirmation

3. **User Dashboard**
   - View all your bookings by email
   - Cancel upcoming reservations
   - Track booking status (Confirmed/Cancelled)

4. **Real-time Availability**
   - System checks for conflicting bookings
   - Prevents overlapping reservations
   - Shows available dates for properties

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install Dependencies**
   ```bash
   cd "file 1"
   npm install
   ```

2. **Database Setup**

   The database is already configured with SQLite. The schema includes:
   - Users (guest information)
   - Properties (hotels/apartments)
   - Bookings (reservations)
   - Categories (property types)
   - Reviews

3. **Seed the Database**

   Populate the database with sample properties:
   ```bash
   npm run seed
   ```

   This creates 5 sample properties:
   - Luxury Beachfront Villa (Malibu, CA)
   - Modern Downtown Apartment (NYC)
   - Boutique Hotel Suite (Paris)
   - Cozy Mountain Cabin (Aspen, CO)
   - Tropical Beach Resort (Bali)

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## How to Use

### For Customers

#### 1. Browse Properties

- Visit the homepage to see all available properties
- Click on any property to view details
- View photos, amenities, location, and pricing

#### 2. Make a Reservation

1. **Select Dates**: Choose your check-in and check-out dates
2. **Select Guests**: Specify the number of guests
3. **Click "Reserve"**: This will take you to the checkout page
4. **Fill Guest Information**:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (optional)
   - Special Requests (optional)
5. **Confirm Reservation**: Click "Confirm reservation (No payment required)"

#### 3. View Confirmation

After booking, you'll see a confirmation page with:
- Booking confirmation code
- Property details
- Reservation dates
- Guest information
- Total price (for reference, no payment needed)

#### 4. Manage Your Bookings

1. Go to `/account-bookings` or click "View my bookings" from the confirmation page
2. Enter your email address
3. View all your reservations
4. Cancel upcoming bookings if needed

### For Property Owners/Admins

#### Add New Properties via API

Use the POST endpoint to add new properties:

```javascript
POST /api/properties

{
  "title": "Amazing Penthouse",
  "description": "Luxurious penthouse with city views",
  "address": "123 Main St, City, State",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "price": 300,
  "maxGuests": 4,
  "bedrooms": 2,
  "bathrooms": 2,
  "featuredImage": "https://example.com/image.jpg",
  "galleryImages": ["url1", "url2", "url3"],
  "amenities": ["WiFi", "Pool", "Gym"],
  "categoryId": "category-uuid-here"
}
```

## API Endpoints

### Properties

- `GET /api/properties` - List all properties
- `GET /api/properties/[id]` - Get single property
- `POST /api/properties` - Create new property
- `POST /api/properties/[id]/availability` - Check availability

### Bookings

- `GET /api/bookings?email=[email]` - List user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get single booking
- `PATCH /api/bookings/[id]` - Update booking (cancel)
- `DELETE /api/bookings/[id]` - Delete booking

## Database Schema

### User
- id, email, name, phone, avatar
- Relations: bookings[], reviews[]

### Property
- id, title, description, address, latitude, longitude
- price, maxGuests, bedrooms, bathrooms
- featuredImage, galleryImages (JSON)
- amenities (JSON)
- Relations: bookings[], reviews[], category

### Booking
- id, propertyId, userId
- checkIn, checkOut, guests
- guestName, guestEmail, guestPhone
- specialRequests, totalPrice
- status (confirmed/cancelled)

### Category
- id, name, slug, description
- Relations: properties[]

### Review
- id, propertyId, userId
- rating (1-5), comment

## Key Features Explained

### Availability Checking

The system prevents double bookings by checking for overlapping reservations:

```typescript
// Checks for bookings where:
// 1. New booking starts during existing booking
// 2. New booking ends during existing booking
// 3. New booking completely contains existing booking
```

### No Payment Integration

- System creates confirmed reservations immediately
- No payment gateway integration needed
- Users can book without credit card information
- Total price is shown for reference only

### Email-Based Booking Management

- No login required
- Users can view bookings by entering their email
- Secure enough for demonstration purposes
- Can be upgraded to full authentication later

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── properties/       # Property endpoints
│   │   └── bookings/         # Booking endpoints
│   ├── checkout/             # Checkout page
│   ├── pay-done/             # Confirmation page
│   └── account-bookings/     # User bookings page
├── lib/
│   └── prisma.ts            # Prisma client
prisma/
├── schema.prisma            # Database schema
├── seed.ts                  # Sample data
└── migrations/              # Database migrations
```

## Customization

### Add More Properties

Edit `prisma/seed.ts` and run:
```bash
npm run seed
```

### Change Pricing

Properties are priced per night. Update the `price` field in the Property model.

### Add More Categories

Create new categories in `prisma/seed.ts`:
```typescript
prisma.category.create({
  data: {
    name: 'Hostels',
    slug: 'hostels',
    description: 'Budget-friendly hostels'
  }
})
```

### Customize Booking Rules

- Minimum nights: Add validation in `POST /api/bookings`
- Maximum guests: Already enforced via `maxGuests` field
- Booking window: Add date range validation

## Troubleshooting

### Database Issues

Reset the database:
```bash
rm prisma/dev.db
npx prisma migrate dev
npm run seed
```

### API Errors

Check the console for detailed error messages. Common issues:
- Invalid property ID
- Overlapping booking dates
- Missing required fields

### No Properties Showing

Make sure you've run the seed command:
```bash
npm run seed
```

## Future Enhancements

Potential features to add:

1. **User Authentication**
   - Full login system with NextAuth
   - Password-protected booking management

2. **Email Notifications**
   - Booking confirmations via email
   - Reminder emails before check-in

3. **Payment Integration**
   - Stripe or PayPal integration
   - Deposit or full payment options

4. **Advanced Search**
   - Filter by price range
   - Filter by amenities
   - Date-based availability search

5. **Reviews & Ratings**
   - Allow guests to leave reviews after check-out
   - Display average ratings

6. **Property Management**
   - Owner dashboard
   - Calendar view of bookings
   - Availability blocking

## Support

For issues or questions:
- Check the API endpoint documentation above
- Review the database schema
- Inspect browser console for errors
- Check server logs in terminal

## License

This booking system is built on top of the Chisfis Next.js template.

---

**Happy Booking!** 🏨✨
