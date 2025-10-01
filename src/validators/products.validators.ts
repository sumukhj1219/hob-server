import { z } from "zod"

export const specificationsSchema = z.object({
    fabric: z.string().optional(),
    technique: z.string().optional(),
    occasion: z.string().optional(),
    pattern: z.string().optional(),
    color: z.string().optional(),
})

export const deleteProductSchema = z.object({
  productId: z.string(),
});

export const productSchema = z.object({
  name: z.string().optional(),
  price: z.number(),
  currency: z.string().optional(),
  description: z.string().optional().optional(),
  images: z.array(z.string().optional()),
  sizes: z.array(z.enum(["XS","S","M","L","XL","XXL","XXXL"]).optional()),
  specifications: specificationsSchema,
});