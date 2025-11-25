import z from "zod";

export const createOrderSchema = z.object({
    items:z.array(
        z.object({
            productId: z.string(),
            quantity: z.number()
        })
    )
})