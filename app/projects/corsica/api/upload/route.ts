import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getServerConfig } from '../../../../../lib/config';
import { getFilesFromRequest } from '../helpers/getFilesFromRequest';
import { S3_PATH_PREFIX } from '../../const';

const config = getServerConfig();
const s3Client = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
});

export async function POST(
  request: NextRequest
) {
  try {
    const formData = await request.formData();
    const files = await getFilesFromRequest(formData);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file: any) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const command = new PutObjectCommand({
        Bucket: config.s3.bucketName,
        Key: `${S3_PATH_PREFIX}${file.name}`,
        Body: buffer,
        ContentType: file.type,
      });

      return s3Client.send(command);
    });

    await Promise.all(uploadPromises);

    return NextResponse.json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
