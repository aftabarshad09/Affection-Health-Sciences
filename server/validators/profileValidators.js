const { z } = require('zod');

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').optional(),
  phone: z.string().trim().min(7, 'Enter a valid phone number').optional().or(z.literal('')),
});

module.exports = { updateProfileSchema };
