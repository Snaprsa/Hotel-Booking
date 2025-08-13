import { PricingMode, PricingRule, RoomType } from '@prisma/client';
import dayjs from 'dayjs';

export interface PriceBreakdown {
  base: number;
  monthlyDiscount: number;
  seasonalAdjustments: { title: string; amount: number }[];
  promoDiscount: number;
  loyaltyDiscount: number;
  total: number;
}

export function calculatePrice(params: {
  roomType: RoomType & { pricingRules: PricingRule[] };
  checkIn: Date;
  checkOut: Date;
  promo?: { mode: PricingMode; value: number } | null;
  loyalty?: boolean;
}): PriceBreakdown {
  const nights = dayjs(params.checkOut).diff(dayjs(params.checkIn), 'day');
  const base = nights * params.roomType.baseNightlySar;
  let total = base;
  let monthlyDiscount = 0;
  if (nights >= 30) {
    const monthlyRate = params.roomType.baseMonthlySar / 30;
    total = nights * monthlyRate;
    monthlyDiscount = base - total;
  }

  const seasonalAdjustments: { title: string; amount: number }[] = [];
  for (const rule of params.roomType.pricingRules) {
    const start = dayjs(rule.startDate);
    const end = dayjs(rule.endDate);
    if (dayjs(params.checkIn).isBefore(end) && dayjs(params.checkOut).isAfter(start)) {
      const adj =
        rule.mode === 'PERCENT'
          ? (total * rule.value) / 100
          : rule.value * nights;
      total += adj;
      seasonalAdjustments.push({ title: rule.title, amount: adj });
    }
  }

  let promoDiscount = 0;
  if (params.promo) {
    promoDiscount =
      params.promo.mode === 'PERCENT'
        ? (total * params.promo.value) / 100
        : params.promo.value * nights;
    total -= promoDiscount;
  }

  let loyaltyDiscount = 0;
  if (params.loyalty) {
    loyaltyDiscount = total * 0.5;
    total -= loyaltyDiscount;
  }

  return {
    base,
    monthlyDiscount,
    seasonalAdjustments,
    promoDiscount,
    loyaltyDiscount,
    total,
  };
}
