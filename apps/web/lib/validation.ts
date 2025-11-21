import { z } from 'zod';

export const SearchSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  adults: z.number().min(1).max(10),
});

export const BookingSchema = z.object({
  roomId: z.string().cuid(),
  ratePlanId: z.string().cuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  guestName: z.string().min(2),
  guestEmail: z.string().email().optional().or(z.literal('')),
  guestPhone: z.string().min(8).optional().or(z.literal('')),
  acceptTerms: z.literal(true),
}).refine(data => data.guestEmail || data.guestPhone, {
  message: "Email or Phone is required",
  path: ["guestEmail"],
});

export const CancelSchema = z.object({
  token: z.string().min(10),
});
