import { supabase } from "../../config/supabase.js";
import { prisma } from "../../config/db.js"
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/error.middleware.js";
import bcrypt from "bcrypt";
import { ENV } from "../../config/env.js";

export async function signup(req: Request, res: Response, next: NextFunction) {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new AppError("All credentials are required", 400)
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser) {
            throw new AppError("User already exists", 400)
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
                password: hashedPassword,
                name
            }
        })

        res.json({ user })
    } catch (error) {
        next(error)
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            throw new AppError("All credentials are required", 400)
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw new AppError(error.message, 401)
        }

        return res.status(200).json({
            user: data.user,
            access_token: data.session?.access_token,
            refresh_token: data.session?.refresh_token,
        });
    } catch (error) {
        next(error)
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    try {
        const { access_token } = req.body

        if (!access_token) {
            throw new AppError("Refresh token is required", 400)
        }

        const { error } = await supabase.auth.admin.signOut(access_token)

        if (error) {
            throw new AppError(error.message, 400)
        }

        res.json({
            message: "User logged out successfully"
        })
    } catch (error) {
        next(error)
    }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body
    try {
        if (!email) {
            throw new AppError("Email is required", 400)
        }

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${ENV.FRONTEND_URL}/reset-password`
        })

        if (error) {
            throw new AppError(error.message, 400);
        }

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        next(error)
    }
}