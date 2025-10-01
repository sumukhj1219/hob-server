import dotenv from "dotenv"

dotenv.config()

export const ENV = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL!,
    FRONTEND_URL:process.env.FRONTEND_URL!,
    SUPABASE_URL:process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY:process.env.SUPABASE_SERVICE_ROLE_KEY!,
}