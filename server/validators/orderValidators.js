const { z } = require('zod');

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});

module.exports = { updateOrderStatusSchema, ORDER_STATUSES };
