import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: Blob, folder: string = ""): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        {
            folder,
            resource_type: "image",
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "",
        },
        (error, result) => {
            if (error) {
            reject(error);
            } else {
            resolve(result?.secure_url || "");
            }
        }
        );

        const reader = file.stream().getReader();
        const read = () => {
        reader.read().then(({ done, value }) => {
            if (done) {
            stream.end();
            return;
            }
            stream.write(value);
            read();
        });
        };
        read();
    });
}
