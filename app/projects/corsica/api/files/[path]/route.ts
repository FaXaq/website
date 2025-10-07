import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { getServerConfig } from '../../../../../../lib/config';
import { S3_PATH_PREFIX } from '@/projects/corsica/const';

const config = getServerConfig();
const s3Client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path } = await params;

    const command = new GetObjectCommand({
      Bucket: config.s3.bucketName,
      Key: S3_PATH_PREFIX + decodeURIComponent(path),
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const fileStream = response.Body.transformToWebStream();
    return new Response(fileStream, {
      headers: {
        'Content-Type': response.ContentType || 'application/octet-stream',
        'Content-Length': response.ContentLength?.toString() || '',
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Error downloading file' },
      { status: 500 }
    );
  }
}