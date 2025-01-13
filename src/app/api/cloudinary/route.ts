import { uploadImage } from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Create an API route handler
    export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as Blob;
    const folder = formData.get("folder") as string;

    try {
        const imageUrl = await uploadImage(file, folder);
        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        });
    }
}

