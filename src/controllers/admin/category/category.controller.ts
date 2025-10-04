import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../middlewares/error.middleware.js";
import { prisma } from "../../../config/db.js"
import { sendResponse } from "../../../utils/response.js";
import { addCategorySchema, deleteCategorySchema } from "../../../validators/category.validators.js";

export async function addCategory(req: Request, res: Response, next: NextFunction){
    try {
        const parse = addCategorySchema.safeParse(req.body)
        if(!parse.success){
            throw new AppError(parse.error.message, 400)
        }

        const category = await prisma.category.create({
            data:{
                name: parse.data.name
            }
        })

        return sendResponse(res, "Added new category", 200, category)
    } catch (error) {
        next(error)
    }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction){
    try {
        const parse = deleteCategorySchema.safeParse(req.params)
        if(!parse.success){
            throw new AppError(parse.error.message, 400)
        }

        const deletedCategory = await prisma.category.delete({
            where:{
                id: parse.data.id
            }
        })

        if(!deletedCategory){
            throw new AppError("Cannot find category", 404)
        }

        return sendResponse(res, "Deleted category", 200, deletedCategory)
    } catch (error) {
        next(error)
    }
}