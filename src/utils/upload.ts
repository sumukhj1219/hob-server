import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase.js";

export async function uploadImage(
    file: Express.Multer.File,
    bucket: string = "image-bucket"
) {
    try {
        if (!file) {
            throw new Error("No file provided");
        }

        if (!file.mimetype.startsWith("image/")) {
            throw new Error("Only image files are allowed");
        }

        const fileExt = file.originalname.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;

        const { error } = await supabase.storage
            .from("image-bucket")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return data.publicUrl;
    } catch (error: any) {
        throw new Error(`Upload failed: ${error.message}`);
    }
}
