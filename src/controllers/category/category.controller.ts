import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";
import { categoryProductsSchema } from "../../validators/category.validators.js";

export async function categories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await prisma.category.findMany()
        if (!categories) {
            throw new AppError("Unable to fetch categories", 404)
        }

        return sendResponse(res, "All categories", 200, categories)
    } catch (error) {
        next(error)
    }
}

export async function categoryProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.params
        const parse = categoryProductsSchema.safeParse(query)
        if (!parse.success) {
            throw new AppError(parse.error.message, 400)
        }

        const products = await prisma.category.findMany({
            where: {
                name: parse.data.name
            },
            include: {
                products: true
            }
        })

        return sendResponse(res, "Product of a category", 200, products)
    } catch (error) {
        next(error)
    }
}

export async function categoryWiseTotalProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: true,
            },
        });

        const categoryWiseProducts = categories.map(category => ({
            category: category.name,
            totalProducts: category.products.length,
        }));

        return sendResponse(res, "Category wise products", 200, categoryWiseProducts)
    } catch (error) {
        next(error);
    }
}