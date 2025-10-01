import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware.js";
import { supabase } from "../config/supabase.js";

export async function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("No token provided", 401);
        }

        const token = authHeader.split(" ")[1]

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            throw new AppError("Invalid or expired token", 401);
        }

        (req as any).user = user;
        next();
    } catch (error) {
        next(error)
    }
}