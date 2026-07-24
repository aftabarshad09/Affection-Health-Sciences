import { z } from 'zod';

export const addressSchema = z.object({
  receiverName: z.string().trim().min(2, 'Enter the receiver name'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  province: z.string().trim().min(2, 'Province is required'),
  city: z.string().trim().min(2, 'City is required'),
  area: z.string().trim().optional().or(z.literal('')),
  postalCode: z.string().trim().optional().or(z.literal('')),
  addressLine: z.string().trim().min(5, 'Enter the full address'),
});
