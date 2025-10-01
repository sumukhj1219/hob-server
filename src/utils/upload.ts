import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase.js";

export async function uploadImage(file: Express.Multer.File, bucket: string = "image-bucket") {
    try {
        const fileExt = file.originalname.split(".").pop()
        const fileName = `${uuidv4()}.${fileExt}`

        const { data, error } = await supabase.storage.from(bucket).upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        })
        if (error) {
            throw new Error(`Supabase upload error: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName)

        return publicUrlData.publicUrl
    } catch (error) {
        throw new Error("Upload failed");
    }
}