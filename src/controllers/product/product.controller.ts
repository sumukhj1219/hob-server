import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { sendResponse } from "../../utils/response.js";
import { AppError } from "../../middlewares/error.middleware.js";

export async function getProducts(req: Request, res: Response, next: NextFunction){
    try {
        const products = await prisma.product.findMany()
        if(!products){
            throw new AppError("No products found", 404)
        }

        return sendResponse(res, "Products", 200, products)
    } catch (error) {
        next(error)
    }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        if (!id) {
            throw new AppError("Product ID is required", 400);
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        return sendResponse(res, "Product fetched successfully", 200, product);
    } catch (error) {
        next(error);
    }
}