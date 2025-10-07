import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getServerConfig } from "@/lib/config";
import { S3_PATH_PREFIX } from "../../const";

const config = getServerConfig();
const s3Client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: config.s3.bucketName,
      Prefix: S3_PATH_PREFIX,
    });

    const response = await s3Client.send(command);

    const files = response.Contents?.map((item) => ({
      key: item.Key,
      size: item.Size,
      lastModified: item.LastModified,
    })) || [];

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error listing S3 files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}