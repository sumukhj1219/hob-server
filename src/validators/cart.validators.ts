import z from "zod";

export const addToCartSchema = z.object({
    userId: z.string(),
    productId: z.string(),
    quantity: z.number()
})