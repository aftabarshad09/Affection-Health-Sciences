const { z } = require('zod');

const productCommerceSchema = z.object({
  sku: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  retailPrice: z.coerce.number().nonnegative().optional(),
  salePrice: z.coerce.number().nonnegative().nullable().optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  featured: z.boolean().optional(),
  commerceStatus: z.enum(['draft', 'active', 'archived']).optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

const stockUpdateSchema = z.object({
  stock: z.coerce.number().int().nonnegative(),
});

module.exports = { productCommerceSchema, stockUpdateSchema };
