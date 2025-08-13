import { z } from 'zod';

export const availabilitySchema = z.object({
  checkIn: z.string().transform((s) => new Date(s)),
  checkOut: z.string().transform((s) => new Date(s)),
  adults: z.number().min(1),
  children: z.number().min(0),
});

export const bookingSchema = z.object({
  roomTypeId: z.string().cuid(),
  checkIn: z.string().transform((s) => new Date(s)),
  checkOut: z.string().transform((s) => new Date(s)),
  adults: z.number().min(1),
  children: z.number().min(0),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  paymentMethod: z.enum(['PAY_AT_PROPERTY', 'ONLINE']),
  promoCode: z.string().optional(),
});
