import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js";
import { sendResponse } from "../../utils/response.js";

export async function allCollections(req: Request, res: Response, next: NextFunction) {
    try {
        const collections = await prisma.collections.findMany({
            select: {
                name: true,
                id: true
            }
        })

        if (!collections) {
            throw new AppError("Unable to find colections", 404)
        }

        return sendResponse(res, "Available collections", 200, collections)
    } catch (error) {
        next(error)
    }
}


export async function collectionsProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { collectionName } = req.params;

        if (!collectionName) {
            throw new AppError("No collection name was found", 400);
        }

        const collectionProducts = await prisma.collections.findMany({
            where: {
                name: collectionName
            },
            include: {
                products: true
            }
        });

        return sendResponse(res, "Collections Products", 200, collectionProducts);
    } catch (error) {
        next(error);
    }
}
