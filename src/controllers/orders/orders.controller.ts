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

        const parsed = createOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError("Invalid inputs", 400);
        }

        const items = parsed.data.items;

        const result = await prisma.$transaction(async (tx) => {
            let totalPayableAmount = 0;

            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                });

                if (!product) {
                    throw new AppError("Product not found", 404);
                }

                if ((product.stockQty ?? 0) < item.quantity) {
                    throw new AppError(`Not enough stock for ${product.name}`, 400);
                }

                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        stockQty: { decrement: item.quantity }
                    }
                });

                await tx.inventoryLog.create({
                    data: {
                        productId: product.id,
                        delta: -item.quantity,
                        type: "ORDER"
                    }
                });

                const price = product.price;
                totalPayableAmount += Number(price) * item.quantity;

                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price
                });
            }

            const order = await tx.order.create({
                data: {
                    userId,
                    total: totalPayableAmount,
                    items: {
                        create: orderItemsData
                    },
                    status: "PENDING"
                },
                include: {
                    items: true
                }
            });

            await tx.cartItem.deleteMany({
                where: { cartId: user.cartId }
            });

            return order;
        });

        return sendResponse(res, "Order created successfully", 200, result);
    } catch (error) {
        next(error);
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

export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user;
        if (!user) throw new AppError("User not found", 404);

        const userId = user.id as string;
        const orderId = req.params.id;

        if (!orderId) {
            throw new AppError("Order ID not found", 400);
        }

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.findFirst({
                where: {
                    id: orderId,
                    userId
                },
                include: {
                    items: true
                }
            });

            if (!order) {
                throw new AppError("Order not found", 404);
            }

            if (order.status === "CANCELLED") {
                throw new AppError("Order already cancelled", 400);
            }

            if (order.status === "DELIVERED") {
                throw new AppError("Delivered orders cannot be cancelled", 400);
            }

            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQty: { increment: item.quantity }
                    }
                });

                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        delta: item.quantity,
                        type: "ORDER_CANCELLED"
                    }
                });
            }

            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: "CANCELLED"
                }
            });

            return updatedOrder;
        });

        return sendResponse(res, "Order cancelled successfully", 200, result);

    } catch (error) {
        next(error);
    }
}
