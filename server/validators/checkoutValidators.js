const { z } = require('zod');
const { addressSchema } = require('./addressValidators');

const checkoutSchema = z.object({
  addressId: z.coerce.number().int().positive().optional(),
  address: addressSchema.optional(),
  saveAddress: z.boolean().optional(),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().max(50),
      })
    )
    .min(1, 'Your cart is empty'),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
}).refine((data) => data.addressId || data.address, {
  message: 'An address is required',
  path: ['address'],
});

module.exports = { checkoutSchema };
