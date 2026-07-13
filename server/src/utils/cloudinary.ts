import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

const isConfigured = !!(
  env.cloudinary.cloudName &&
  env.cloudinary.apiKey &&
  env.cloudinary.apiSecret
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
} else {
  console.log("Cloudinary is not configured. File uploads will fall back to data URLs.");
}

export async function uploadToCloudinary(fileBuffer: Buffer, folder: string = "resumes"): Promise<string> {
  if (!isConfigured) {
    // If not configured, fall back to converting buffer to a base64 Data URL
    // so it can be previewed/stored locally in memory/DB.
    return `data:application/pdf;base64,${fileBuffer.toString("base64")}`;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload result was empty"));
        resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
}
