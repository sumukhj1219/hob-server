import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middlewares/error.middleware.js";
import { prisma } from "../../../config/db.js"
import { sendResponse } from "../../../utils/response.js";
import { bulkCreateProductSchema, bulkDeleteProductSchema, deleteProductSchema, productSchema, updateProductSchema } from "../../../validators/products.validators.js";

export async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = productSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const productData = parsed.data as any

        const product = await prisma.product.create({
            data:productData
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

export async function bulkDeleteProducts(req: Request, res: Response, next: NextFunction){
    try {
        const parsed = bulkDeleteProductSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { productIds } = parsed.data;

        const deleted = await prisma.product.deleteMany({
            where: {
                id: { in: productIds }
            }
        });

        return sendResponse(res, `${deleted.count} products deleted successfully`, 200);
    } catch (error) {
        next(error)
    }
}
