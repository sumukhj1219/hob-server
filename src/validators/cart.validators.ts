import z from "zod";

export const addToCartSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string(),
    })
  ).min(1)
});


export const deleteFromCartSchema = z.object({
  products: z.array(
    z.object({
      cartId: z.string(),
      productId: z.string(),
    })
  ).min(1)
})


export const increaseCartItemQuantitySchema = z.object({
  cartId: z.string(),
  productId: z.string(),
})

export const decreaseCartItemQuantitySchema = z.object({
  cartId: z.string(),
  productId: z.string(),
})