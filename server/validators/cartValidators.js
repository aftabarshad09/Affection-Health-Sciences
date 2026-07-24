const { z } = require('zod');

const addCartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().max(50),
});

const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(50),
});

module.exports = { addCartItemSchema, updateCartItemSchema };
