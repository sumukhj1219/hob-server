import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";
import { addToCartSchema } from "../../validators/cart.validators.js";

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const userId = user.id as string;

    const parsed = addToCartSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const products = parsed.data.products;
    // @ts-ignore
    let cart = await prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const updatedItems = [];

    for (const { productId, quantity } of products) {

      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });

      let item;

      if (existingItem) {
        item = await prisma.cartItem.update({
          where: { cartId_productId: { cartId: cart.id, productId } },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        item = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      updatedItems.push(item);
    }

    return sendResponse(res, "Cart updated", 200, updatedItems);

  } catch (error) {
    next(error);
  }
}
