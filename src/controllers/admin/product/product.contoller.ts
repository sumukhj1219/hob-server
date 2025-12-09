import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middlewares/error.middleware.js";
import { prisma } from "../../../config/db.js"
import { sendResponse } from "../../../utils/response.js";
import { bulkCreateProductSchema, bulkDeleteProductSchema, deleteProductSchema, productSchema, updateProductSchema } from "../../../validators/products.validators.js";
import { uploadImage } from "../../../utils/upload.js";


export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const body = {
      ...req.body,
      price: Number(req.body.price),
      stockQty: Number(req.body.stockQty),
      sizes: Array.isArray(req.body.sizes)
        ? req.body.sizes
        : [req.body.sizes],
      specifications: req.body.specifications
        ? JSON.parse(req.body.specifications)
        : {}
    };

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    const files = req.files as Express.Multer.File[] | undefined;

    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => uploadImage(file, "product-images"))
      );
    }

    const productData = parsed.data;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        // @ts-ignore
        data: {
          ...productData,
          images: imageUrls
        }
      });

      await tx.inventoryLog.create({
        data: {
          productId: product.id,
          delta: product.stockQty ?? 0,
          type: "INITIAL"
        }
      });

      return product;
    });

    return sendResponse(res, "Created new product", 201, result);

  } catch (error) {
    next(error);
  }
}




export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = deleteProductSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { productId } = parsed.data;

        await prisma.$transaction([
            prisma.inventoryLog.deleteMany({ where: { productId: productId } }),
            prisma.cartItem.deleteMany({ where: { productId: productId } }),
            prisma.product.delete({ where: { id: productId } })
        ]);

        return sendResponse(res, "Product deleted successfully", 200)
    } catch (error) {
        next(error);
    }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = updateProductSchema.safeParse(req.body);

        if (!parsed.success) {
            throw new AppError(parsed.error.message, 400);
        }

        const { id, stockQty, ...rest } = parsed.data as any;

        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.product.findUnique({
                where: { id }
            });

            if (!existing) {
                throw new AppError("Product not found", 404);
            }

            const updated = await tx.product.update({
                where: { id },
                data: {
                    ...rest,
                    ...(typeof stockQty === "number" ? { stockQty } : {})
                }
            });

            if (typeof stockQty === "number" && stockQty !== existing.stockQty) {
                const delta = stockQty - (existing.stockQty ?? 0);

                await tx.inventoryLog.create({
                    data: {
                        productId: id,
                        delta,
                        type: "ADJUSTMENT"
                    }
                });
            }

            return updated;
        });

        return sendResponse(res, "Product Updated", 200, result);
    } catch (error) {
        next(error);
    }
}

export async function bulkCreateProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = bulkCreateProductSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(parsed.error.message, 400);
    }

    const productsData = parsed.data as any[];

    const result = await prisma.$transaction(async (tx) => {
      const createdProducts = [];

      for (const data of productsData) {
        const product = await tx.product.create({
          data
        });

        await tx.inventoryLog.create({
          data: {
            productId: product.id,
            delta: product.stockQty ?? 0,
            type: "INITIAL"
          }
        });

        createdProducts.push(product);
      }

      return createdProducts;
    });

    return sendResponse(res, "Bulk products added", 201, result);

  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteProducts(req: Request, res: Response, next: NextFunction) {
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
