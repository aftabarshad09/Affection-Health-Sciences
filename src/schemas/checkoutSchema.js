import { z } from 'zod';

// Guest checkout form validation (mirrors server/validators/guestCheckoutValidators.js).
export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  province: z.string().trim().min(2, 'Select your province'),
  city: z.string().trim().min(2, 'City is required'),
  area: z.string().trim().optional().or(z.literal('')),
  apartment: z.string().trim().optional().or(z.literal('')),
  postalCode: z.string().trim().optional().or(z.literal('')),
  addressLine: z.string().trim().min(5, 'Enter the full street address'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});
