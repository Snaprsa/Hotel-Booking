import { prisma } from './prisma'
import { addDays, differenceInDays, isAfter, isBefore, isEqual, parseISO } from 'date-fns'

/**
 * Check if a property is available for the given date range
 */
export async function checkAvailability(
  propertyId: string,
  checkIn: Date,
  checkOut: Date
): Promise<{ available: boolean; reason?: string }> {
  // Validate dates
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  if (isBefore(checkIn, now)) {
    return { available: false, reason: 'Check-in date cannot be in the past' }
  }

  if (!isAfter(checkOut, checkIn)) {
    return { available: false, reason: 'Check-out date must be after check-in date' }
  }

  // Get property details
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      minNights: true,
      maxNights: true,
      isActive: true,
    },
  })

  if (!property) {
    return { available: false, reason: 'Property not found' }
  }

  if (!property.isActive) {
    return { available: false, reason: 'Property is not available for booking' }
  }

  // Check min/max nights requirement
  const nights = differenceInDays(checkOut, checkIn)

  if (nights < property.minNights) {
    return {
      available: false,
      reason: `Minimum stay is ${property.minNights} night(s)`
    }
  }

  if (property.maxNights && nights > property.maxNights) {
    return {
      available: false,
      reason: `Maximum stay is ${property.maxNights} night(s)`
    }
  }

  // Check for blocked dates
  const blockedDates = await prisma.blockedDate.findMany({
    where: {
      propertyId,
      date: {
        gte: checkIn,
        lt: checkOut,
      },
    },
  })

  if (blockedDates.length > 0) {
    return {
      available: false,
      reason: 'Some dates in your range are blocked'
    }
  }

  // Check for overlapping bookings
  const existingBookings = await prisma.booking.findMany({
    where: {
      propertyId,
      status: {
        in: ['PENDING', 'CONFIRMED', 'CHECKED_IN'],
      },
      OR: [
        // New booking starts during existing booking
        {
          AND: [
            { checkIn: { lte: checkIn } },
            { checkOut: { gt: checkIn } },
          ],
        },
        // New booking ends during existing booking
        {
          AND: [
            { checkIn: { lt: checkOut } },
            { checkOut: { gte: checkOut } },
          ],
        },
        // New booking completely contains existing booking
        {
          AND: [
            { checkIn: { gte: checkIn } },
            { checkOut: { lte: checkOut } },
          ],
        },
      ],
    },
  })

  if (existingBookings.length > 0) {
    return {
      available: false,
      reason: 'Property is already booked for these dates'
    }
  }

  return { available: true }
}

/**
 * Calculate total price for a booking
 */
export function calculateBookingPrice(
  pricePerNight: number,
  nights: number,
  cleaningFee: number = 0,
  serviceFee: number = 0
): {
  totalNights: number
  cleaningFee: number
  serviceFee: number
  totalPrice: number
} {
  const totalNights = pricePerNight * nights
  const totalPrice = totalNights + cleaningFee + serviceFee

  return {
    totalNights,
    cleaningFee,
    serviceFee,
    totalPrice,
  }
}

/**
 * Get all booked dates for a property
 */
export async function getBookedDates(propertyId: string): Promise<Date[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      propertyId,
      status: {
        in: ['CONFIRMED', 'CHECKED_IN', 'PENDING'],
      },
    },
    select: {
      checkIn: true,
      checkOut: true,
    },
  })

  const bookedDates: Date[] = []

  for (const booking of bookings) {
    let currentDate = new Date(booking.checkIn)
    const endDate = new Date(booking.checkOut)

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
      bookedDates.push(new Date(currentDate))
      currentDate = addDays(currentDate, 1)
    }
  }

  return bookedDates
}

/**
 * Validate booking input
 */
export function validateBookingInput(input: {
  checkIn: string | Date
  checkOut: string | Date
  adults: number
  children?: number
  infants?: number
  maxGuests: number
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate guest count
  const totalGuests = input.adults + (input.children || 0) + (input.infants || 0)

  if (input.adults < 1) {
    errors.push('At least 1 adult is required')
  }

  if (totalGuests > input.maxGuests) {
    errors.push(`Maximum ${input.maxGuests} guests allowed`)
  }

  // Validate dates
  const checkIn = typeof input.checkIn === 'string' ? parseISO(input.checkIn) : input.checkIn
  const checkOut = typeof input.checkOut === 'string' ? parseISO(input.checkOut) : input.checkOut

  if (isNaN(checkIn.getTime())) {
    errors.push('Invalid check-in date')
  }

  if (isNaN(checkOut.getTime())) {
    errors.push('Invalid check-out date')
  }

  if (!isAfter(checkOut, checkIn)) {
    errors.push('Check-out must be after check-in')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
