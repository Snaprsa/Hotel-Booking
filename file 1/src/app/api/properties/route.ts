import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category');

    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
        ...(categorySlug && {
          category: {
            slug: categorySlug
          }
        })
      },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average rating for each property
    const propertiesWithRatings = properties.map(property => {
      const avgRating = property.reviews.length > 0
        ? property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length
        : 0;

      return {
        ...property,
        galleryImages: JSON.parse(property.galleryImages || '[]'),
        amenities: JSON.parse(property.amenities || '[]'),
        reviewStart: Math.round(avgRating),
        reviewCount: property.reviews.length,
      };
    });

    return NextResponse.json(propertiesWithRatings);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const property = await prisma.property.create({
      data: {
        title: body.title,
        description: body.description,
        address: body.address,
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        price: parseFloat(body.price),
        maxGuests: parseInt(body.maxGuests),
        bedrooms: parseInt(body.bedrooms),
        bathrooms: parseInt(body.bathrooms),
        featuredImage: body.featuredImage,
        galleryImages: JSON.stringify(body.galleryImages || []),
        amenities: JSON.stringify(body.amenities || []),
        categoryId: body.categoryId,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
