import z from "zod";

export const categoryProductsSchema = z.object({
    name:z.string()
})

export const addCategorySchema = z.object({
    name: z.string()
})

export const deleteCategorySchema = z.object({
    id: z.string()
})

export const updateCategorySchema = z.object({
    id: z.string(),
    name: z.string()
})