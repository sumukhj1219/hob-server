import { supabase } from "../../config/supabase.js";
import { prisma } from "../../config/db.js"
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware.js";
import bcrypt from "bcrypt";

export async function signup(req: Request, res: Response, next:NextFunction) {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new AppError("All credentials are required", 400)
        }

        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        })

        if (error) throw new AppError(error.message, 400)

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                id: data?.user?.id ?? undefined,
                email,
                password:hashedPassword,
                name
            }
        })

        res.json({user})
    } catch (error) {
        next(error)
    }
}