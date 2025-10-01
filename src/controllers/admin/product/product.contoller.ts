import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middlewares/error.middleware.js";
import { prisma } from "../../../config/db.js"
import { deleteProductSchema, productSchema } from "../../../validators/products.validators.js";

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

        res.json({
            message: "Created new product",
            data: product
        })
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

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
}
