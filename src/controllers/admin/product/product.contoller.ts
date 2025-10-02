import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middlewares/error.middleware.js";
import { prisma } from "../../../config/db.js"
import { bulkCreateProductSchema, deleteProductSchema, productSchema, updateProductSchema } from "../../../validators/products.validators.js";
import { sendResponse } from "../../../utils/response.js";

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = productSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const productData = parsed.data as any

        const product = await prisma.product.create({
            data: productData
        })

        return sendResponse(res, "Created new product", 200, product)
    } catch (error) {
        next(error)
    }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = deleteProductSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { productId } = parsed.data;

        await prisma.product.delete({
            where: { id: productId },
        });

        return sendResponse(res, "Product deleted successfully", 200)
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateProductSchema.safeParse(req.body)
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400)
        }

        const updatedData = parsed.data as any
        const updatedProduct = await prisma.product.update({
            where: {
                id: parsed.data.id
            },
            data: updatedData
        })

        return sendResponse(res, "Product Updated", 200, updatedProduct)
        
    } catch (error) {
        next(error)
    }
}

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

export async function bulkCreateProducts(req: Request, res: Response, next: NextFunction){
    try {
        const parsed = bulkCreateProductSchema.safeParse(req.body)
        if(!parsed.success){
            throw new AppError(parsed.error.message, 400)
        }

        const bulkProductsData = parsed.data as any
        const bulkProducts = await prisma.product.createManyAndReturn({
            data:bulkProductsData
        })

        return sendResponse(res, "Bulk products added", 200, bulkProducts)
    } catch (error) {
        next(error)
    }
}

