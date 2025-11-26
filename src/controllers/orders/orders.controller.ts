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

export async function getPendingOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;

        const orderItems = await prisma.order.findMany({
            where: {
                userId: userId,
                status: "PENDING"
            },
            include: {
                items: {
                    select: {
                        product: true,
                    }
                }
            }
        })
        return sendResponse(res, "Found pending orders", 200, orderItems)
    } catch (error) {
        next(error)
    }
}

export async function getDeliveredOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;

        const orderItems = await prisma.order.findMany({
            where: {
                userId: userId,
                status: "DELIVERED"
            },
            include: {
                items: {
                    select: {
                        product: true,
                    }
                }
            }
        })
        return sendResponse(res, "Found delivered orders", 200, orderItems)
    } catch (error) {
        next(error)
    }
}

export async function getOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;
        const orderId = req.params.id
        if (!orderId) {
            throw new AppError("Order Id not found", 400)
        }

        const orderStatus = await prisma.order.findUnique({
            where: {
                userId: userId,
                id: orderId
            },
            select: {
                status: true
            }
        })

        return sendResponse(res, "Order status", 200, orderStatus)
    } catch (error) {
        next(error)
    }
}

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;

        const orderItems = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    select: {
                        product: true,
                    }
                }
            }
        })
        return sendResponse(res, "Found all orders", 200, orderItems)
    } catch (error) {
        next(error)
    }
}

export async function cancelOrder(req: Request, res: Response, next: NextFunction){
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;
        const orderId = req.params.id;

        if(!orderId){
            throw new AppError("Order Id not found", 400)
        }

        const cancelledOrder = await prisma.order.update({
            where:{
                userId:userId,
                id: orderId
            },
            data:{
                status:"CANCELLED"
            }
        })

        return sendResponse(res, "Order cancelled", 200, cancelledOrder)
    } catch (error) {
        next(error)
    }
}