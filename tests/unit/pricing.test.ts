import { calculatePrice } from '@/lib/pricing';

const roomType: any = {
  id: '1',
  slug: 'studio',
  titleAR: '',
  titleEN: '',
  descAR: '',
  descEN: '',
  capacityAdults: 2,
  capacityChildren: 0,
  baseNightlySar: 100,
  baseMonthlySar: 2400,
  amenities: [],
  images: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  pricingRules: [],
};

test('monthly pricing applied for >=30 nights', () => {
  const result = calculatePrice({
    roomType,
    checkIn: new Date('2024-01-01'),
    checkOut: new Date('2024-01-31'),
  });
  expect(result.total).toBe(2400);
});
