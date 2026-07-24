const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['customer', 'admin', 'super_admin']),
});

const updateStatusSchema = z.object({
  status: z.enum(['active', 'suspended']),
});

module.exports = { updateRoleSchema, updateStatusSchema };
