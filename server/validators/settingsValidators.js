const { z } = require('zod');

const updateSettingsSchema = z.object({
  flatShippingRate: z.coerce.number().nonnegative().optional(),
  freeShippingThreshold: z.coerce.number().nonnegative().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional(),
});

module.exports = { updateSettingsSchema };
