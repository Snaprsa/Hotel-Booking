import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability, getBookedDates } from '@/lib/booking-utils'

/**
 * GET /api/properties/[id]/availability - Check property availability
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')

    if (!checkIn || !checkOut) {
      // Return all booked dates if no specific dates provided
      const bookedDates = await getBookedDates(params.id)
      return NextResponse.json({
        bookedDates: bookedDates.map(d => d.toISOString().split('T')[0]),
      })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)

    const availability = await checkAvailability(params.id, checkInDate, checkOutDate)

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    )
  }
}
