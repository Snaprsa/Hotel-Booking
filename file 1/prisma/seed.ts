import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@hotel.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@hotel.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample rooms
  const rooms = [
    {
      title: 'Deluxe Ocean View Suite',
      description: 'Experience luxury with breathtaking ocean views. This spacious suite features a king-size bed, modern amenities, and a private balcony perfect for watching sunsets.',
      address: '123 Beachfront Ave, Miami Beach, FL 33139',
      price: 299.99,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 2,
      beds: 2,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Ocean View', 'Private Balcony', 'Mini Bar', 'Room Service', 'TV', 'Safe']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
        'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
      category: 'Deluxe',
      lat: 25.7907,
      lng: -80.1300,
    },
    {
      title: 'Executive Suite with City View',
      description: 'Perfect for business travelers. This elegant suite offers panoramic city views, a dedicated workspace, and premium comfort for your stay.',
      address: '456 Downtown Blvd, Miami, FL 33132',
      price: 199.99,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'City View', 'Desk', 'Coffee Maker', 'TV', 'Safe', 'Minibar']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg',
        'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
        'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg',
      category: 'Executive',
      lat: 25.7743,
      lng: -80.1937,
    },
    {
      title: 'Family Garden Room',
      description: 'Ideal for families! This spacious room features garden views, multiple beds, and is located near our pool and kids play area.',
      address: '789 Garden Way, Coral Gables, FL 33134',
      price: 149.99,
      maxGuests: 5,
      bedrooms: 2,
      bathrooms: 1,
      beds: 3,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Garden View', 'Family Friendly', 'Pool Access', 'TV', 'Parking']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
        'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
      category: 'Family',
      lat: 25.7211,
      lng: -80.2684,
    },
    {
      title: 'Luxury Penthouse Suite',
      description: 'The ultimate in luxury living. This stunning penthouse features 360-degree views, premium furnishings, and exclusive access to VIP amenities.',
      address: '101 Luxury Lane, Brickell, FL 33131',
      price: 599.99,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 3,
      beds: 3,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Panoramic View', 'Private Terrace', 'Jacuzzi', 'Butler Service', 'Full Kitchen', 'TV', 'Safe', 'Bar']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
        'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      category: 'Penthouse',
      lat: 25.7663,
      lng: -80.1917,
    },
    {
      title: 'Standard Double Room',
      description: 'Comfortable and affordable. Perfect for budget-conscious travelers seeking quality accommodation in a prime location.',
      address: '234 Main Street, Miami, FL 33130',
      price: 89.99,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'TV', 'Daily Housekeeping', 'Desk']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg',
      category: 'Standard',
      lat: 25.7753,
      lng: -80.1879,
    },
    {
      title: 'Romantic Honeymoon Suite',
      description: 'Perfect for newlyweds and couples. Featuring a king bed, champagne on arrival, rose petals, and candlelit dinners available.',
      address: '567 Romance Road, South Beach, FL 33139',
      price: 349.99,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Ocean View', 'King Bed', 'Jacuzzi Tub', 'Champagne', 'Rose Petals', 'Romantic Decor', 'TV', 'Safe']),
      images: JSON.stringify([
        'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg',
        'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg',
      ]),
      featuredImage: 'https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg',
      category: 'Honeymoon',
      lat: 25.7813,
      lng: -80.1300,
    },
  ]

  for (const room of rooms) {
    await prisma.room.create({
      data: room,
    })
  }

  console.log(`Created ${rooms.length} rooms`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
