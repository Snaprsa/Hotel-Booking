import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Hotels',
        slug: 'hotels',
        description: 'Comfortable hotels with modern amenities',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Apartments',
        slug: 'apartments',
        description: 'Spacious apartments for extended stays',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Villas',
        slug: 'villas',
        description: 'Luxurious villas with private pools',
      },
    }),
  ])

  console.log('Created categories:', categories.map(c => c.name).join(', '))

  // Create sample properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Luxury Beachfront Villa',
        description: 'A stunning beachfront villa with panoramic ocean views. This luxurious property features modern amenities, a private pool, and direct beach access.',
        address: 'Malibu, California, USA',
        latitude: 34.0259,
        longitude: -118.7798,
        price: 450,
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        featuredImage: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
        galleryImages: JSON.stringify([
          'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        amenities: JSON.stringify(['WiFi', 'Pool', 'Kitchen', 'Air Conditioning', 'Parking', 'Ocean View']),
        categoryId: categories[2].id, // Villas
      },
    }),
    prisma.property.create({
      data: {
        title: 'Modern Downtown Apartment',
        description: 'Sleek and stylish apartment in the heart of downtown. Perfect for business travelers and city explorers. Walking distance to major attractions.',
        address: 'New York City, New York, USA',
        latitude: 40.7128,
        longitude: -74.0060,
        price: 180,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        featuredImage: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
        galleryImages: JSON.stringify([
          'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        amenities: JSON.stringify(['WiFi', 'Kitchen', 'Air Conditioning', 'Washer', 'TV', 'Gym']),
        categoryId: categories[1].id, // Apartments
      },
    }),
    prisma.property.create({
      data: {
        title: 'Boutique Hotel Suite',
        description: 'Elegant boutique hotel suite with premium amenities. Experience luxury and comfort in this beautifully designed space with exceptional service.',
        address: 'Paris, France',
        latitude: 48.8566,
        longitude: 2.3522,
        price: 280,
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        featuredImage: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
        galleryImages: JSON.stringify([
          'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        amenities: JSON.stringify(['WiFi', 'Air Conditioning', 'Room Service', 'TV', 'Mini Bar', 'City View']),
        categoryId: categories[0].id, // Hotels
      },
    }),
    prisma.property.create({
      data: {
        title: 'Cozy Mountain Cabin',
        description: 'Rustic mountain cabin surrounded by nature. Perfect for a peaceful retreat with hiking trails nearby and stunning mountain views.',
        address: 'Aspen, Colorado, USA',
        latitude: 39.1911,
        longitude: -106.8175,
        price: 220,
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        featuredImage: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
        galleryImages: JSON.stringify([
          'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/462235/pexels-photo-462235.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        amenities: JSON.stringify(['WiFi', 'Fireplace', 'Kitchen', 'Heating', 'Parking', 'Mountain View']),
        categoryId: categories[1].id, // Apartments
      },
    }),
    prisma.property.create({
      data: {
        title: 'Tropical Beach Resort',
        description: 'All-inclusive beach resort with pristine white sand beaches. Enjoy water sports, spa services, and world-class dining.',
        address: 'Bali, Indonesia',
        latitude: -8.3405,
        longitude: 115.0920,
        price: 350,
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        featuredImage: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
        galleryImages: JSON.stringify([
          'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800'
        ]),
        amenities: JSON.stringify(['WiFi', 'Pool', 'Beach Access', 'Air Conditioning', 'Restaurant', 'Spa']),
        categoryId: categories[0].id, // Hotels
      },
    }),
  ])

  console.log('Created properties:', properties.map(p => p.title).join(', '))

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
