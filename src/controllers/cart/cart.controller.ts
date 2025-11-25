import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";
import { addToCartSchema, decreaseCartItemQuantitySchema, deleteFromCartSchema, increaseCartItemQuantitySchema } from "../../validators/cart.validators.js";

export async function addToCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const userId = user.id as string;

    const parsed = addToCartSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const products = parsed.data.products;

    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    for (const item of products) {
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          }
        }
      });

      if (existing) {
        await prisma.cartItem.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: item.productId
            }
          },
          data: {
            quantity: { increment: 1 }
          }
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: 1
          }
        });
      }
    }

    return sendResponse(res, "Added to cart", 200);
  } catch (error) {
    next(error);
  }
}


export async function deleteFromCart(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const parsed = deleteFromCartSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError("Invalid inputs", 400);
    }

    const deleteFilters = parsed.data.products.map(p => ({
      AND: [
        { cartId: p.cartId },
        { productId: p.productId }
      ]
    }));

    await prisma.cartItem.deleteMany({
      where: {
        OR: deleteFilters
      }
    });

    res.status(200).json({ message: "Items deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getCartProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const cartProducts = await prisma.cart.findMany({
      where: {
        userId: user.id
      },
      select: {
        items: true
      }
    })

    return sendResponse(res, "Cart Products", 200, cartProducts)
  } catch (error) {
    next(error)
  }
}

export async function increaseCartItemQuantity(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const parsed = increaseCartItemQuantitySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError("Invalid inputs", 400)
    }

    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: parsed.data?.cartId,
          productId: parsed.data?.productId
        },
      },
      data: {
        quantity: {
          increment: 1
        }
      }
    })

    return sendResponse(res, "Cart item incremented", 200)
  } catch (error) {
    next(error)
  }
}

export async function decreaseCartItemQuantity(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    if (!user) throw new AppError("User not found", 404);

    const parsed = decreaseCartItemQuantitySchema.safeParse(req.body)
    if (!parsed.success) {
      throw new AppError("Invalid inputs", 400)
    }

    await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: parsed.data?.cartId,
          productId: parsed.data?.productId
        },
      },
      data: {
        quantity: {
          decrement: 1
        }
      }
    })

    return sendResponse(res, "Cart item decremented", 200)
  } catch (error) {
    next(error)
  }
}