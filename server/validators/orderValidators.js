const { z } = require('zod');

const ORDER_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  notes: z.string().trim().max(500).optional().or(z.literal('')),
});

const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['pending', 'paid']),
});

const addNoteSchema = z.object({
  notes: z.string().trim().min(1, 'Note cannot be empty').max(500),
});

module.exports = { updateOrderStatusSchema, updatePaymentStatusSchema, addNoteSchema, ORDER_STATUSES };
