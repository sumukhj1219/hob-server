import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";
import { createOrderSchema } from "../../validators/order.validators.js";

export async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;

        const parsed = createOrderSchema.safeParse(req.body)
        if (!parsed.success) {
            throw new AppError("Invalid inputs", 400)
        }

        let totalPayableAmount = 0;
        const items = parsed.data.items

        const orderItemsData = await Promise.all(
            items.map((async (item) => {
                const product = await prisma.product.findUnique({
                    where: {
                        id: item.productId
                    }
                })

                if (!product) {
                    throw new AppError("Product with this Id not found", 404)
                }

                const price = product.price
                totalPayableAmount += Number(price) * item.quantity

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price
                }
            }))
        )

        const order = await prisma.order.create({
            data: {
                userId,
                total: totalPayableAmount,
                items: {
                    create: orderItemsData,
                },
                status: "PENDING",
            },
            include: {
                items: true,
            },
        });

        await prisma.cartItem.deleteMany({
            where: { cartId: user.cartId },
        });

        return sendResponse(res, "Order created successfully", 200, order)
    } catch (error) {
        next(error)
    }
}