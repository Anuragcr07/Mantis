"use server"

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUploadUrl(fileName: string, fileType: string, role: string) {
  // 1. Logic: Determine path based on role
  // Manufacturer uploads to 'knowledge/', Customers to 'reports/'
  const folder = role === "company" ? "knowledge" : "reports";
  const fileKey = `${folder}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType,
  });

  try {
    // URL expires in 60 seconds for high security
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return { url, fileKey };
  } catch (error) {
    console.error("S3 Presign Error:", error);
    throw new Error("Failed to generate upload URL");
  }
}