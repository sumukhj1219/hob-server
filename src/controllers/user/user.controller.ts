import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../config/db.js"
import { sendResponse } from "../../utils/response.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { addAddressSchema } from "../../validators/user.validators.js";

export async function profile(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user

        if (!user) {
            throw new AppError("User is not authenticated", 400)
        }

        const userProfile = await prisma.user.findUnique({
            where: {
                id: user.id
            }
        })

        return sendResponse(res, "User Profile", 200, userProfile)
    } catch (error) {
        next(error)
    }
}

export async function addAddress(req: Request, res: Response, next: NextFunction) {
    try {
        const parse = addAddressSchema.safeParse(req.body)
        if (!parse.success) {
            throw new AppError(parse.error.message, 400)
        }

        const user = (req as any).user
        if (!user) {
            throw new AppError("User is not authenticated", 400)
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                address: parse.data
            }
        })

        return sendResponse(res, "Address updated successfully", 200, updatedUser)
    } catch (error) {
        next(error)
    }
}

