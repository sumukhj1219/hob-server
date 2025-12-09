import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { sendResponse } from "../../utils/response.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { filterProductsByQuerySchema, getAllProductsQuerySchema, searchProductByQuerySchema } from "../../validators/products.validators.js";

export async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const sortBy = getAllProductsQuerySchema.safeParse(req.query)

        const products = await prisma.product.findMany({
            select: { id: true, name: true, price: true, images: true, description: true, stockQty: true },
            orderBy: [
                {price: sortBy.data?.sortBy.price ? "asc" : "desc"},
                {createdAt: sortBy.data?.sortBy.popularity ? "asc" : "desc"}
            ]
        })
        if (!products) {
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
            select: { id: true, name: true, price: true, images: true, specifications: true, stockQty: true, description:true }
        });

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        return sendResponse(res, "Product fetched successfully", 200, product);
    } catch (error) {
        next(error);
    }
}

export async function searchProductsByQuery(req: Request, res: Response, next: NextFunction) {
    try {
        const parse = searchProductByQuerySchema.safeParse(req.query)
        if (!parse.success) {
            throw new AppError(parse.error.message, 400)
        }

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: parse.data.query,
                            mode: "insensitive"
                        }
                    },
                    {
                        description: {
                            contains: parse.data.query,
                            mode: "insensitive"
                        }
                    },
                    {
                        keywords: {
                            has: parse.data.query,
                        }
                    }
                ]
            }
        });


        return sendResponse(res, "Product queried successfully", 200, products)

    } catch (error) {
        next(error)
    }
}

export async function filterProductsByQuery(req: Request, res: Response, next: NextFunction) {
    try {
        const parse = filterProductsByQuerySchema.safeParse(req.query)
        if (!parse.success) {
            throw new AppError(parse.error.message, 400)
        }

        const { minPrice, maxPrice, size, keyword, colour, collectionId } = parse.data;

        const products = await prisma.product.findMany({
            where: {
                AND: [
                    collectionId ? { collectionId } : {},
                    minPrice ? { price: { gte: Number(minPrice) } } : {},
                    maxPrice ? { price: { lte: Number(maxPrice) } } : {},
                    size ? { sizes: { has: size } } : {},
                    colour ? { specifications: { path: ["colour"], string_contains: colour } } : {},
                    keyword
                        ? {
                            OR: [
                                { name: { contains: keyword, mode: "insensitive" } },
                                { description: { contains: keyword, mode: "insensitive" } },
                                { keywords: { has: keyword } }
                            ]
                        }
                        : {}
                ]
            }
        })

        return sendResponse(res, "Filtered Products", 200, products)
    } catch (error) {
        next(error)
    }
}

export async function newProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const newProducts = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            },
            take: 10
        })

        return sendResponse(res, "New Products", 200, newProducts)
    } catch (error) {
        next(error)
    }
}
