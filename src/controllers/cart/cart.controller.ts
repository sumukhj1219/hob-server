import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";
import { addToCartSchema } from "../../validators/cart.validators.js";

export async function addToCart(req: Request, res: Response, next: NextFunction){
    try {
        const userId = (req as any).user.id
        const parsed = addToCartSchema.safeParse(req.body)
    } catch (error) {
        next(error)
    }
}