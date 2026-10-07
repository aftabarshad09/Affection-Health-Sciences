const { z } = require('zod');

// Guest checkout form — no account. All server-side validated before an order
// is created; the server computes every total itself (never trusts the client).
const guestCheckoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2, 'Enter your full name'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    phone: z.string().trim().min(7, 'Enter a valid phone number'),
  }),
  address: z.object({
    apartment: z.string().trim().max(120).optional().or(z.literal('')),
    addressLine: z.string().trim().min(5, 'Enter the full street address'),
    area: z.string().trim().max(120).optional().or(z.literal('')),
    city: z.string().trim().min(2, 'City is required'),
    province: z.string().trim().min(2, 'Province is required'),
    postalCode: z.string().trim().max(15).optional().or(z.literal('')),
  }),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().max(99),
      })
    )
    .min(1, 'Your cart is empty'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});

module.exports = { guestCheckoutSchema };
