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

export const updateProductSchema = z.object({
  id:z.string(),
  name: z.string().optional(),
  price: z.number().optional(),
  stock: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  global_discount: z.number().optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string().optional()),
  sizes: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]).optional()),
  specifications: specificationsSchema,
})

export const productSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number().optional(),
  currency: z.string(),
  keywords: z.array(z.string()).optional(),
  global_discount: z.number().optional(),
  description: z.string(),
  images: z.array(z.string().optional()),
  sizes: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]).optional()),
  specifications: specificationsSchema,
});

export const bulkCreateProductSchema = z.array(
  productSchema
)

export const bulkDeleteProductSchema = z.object({
  productIds: z.array(z.string()) 
});

export const searchProductByQuerySchema = z.object({
  query: z.string()
})

export const filterProductsByQuerySchema = z.object({
  minPrice: z.string().transform(Number).optional(),
  maxPrice: z.string().transform(Number).optional(),
  size: z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"]).optional(),
  keyword: z.string().optional()
});

