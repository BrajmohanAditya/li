import { Injectable, BadRequestException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private region: string;
  constructor(private readonly config: ConfigService) {
    this.region = this.config.get<string>('AWS_REGION') as string;

    this.bucket = this.config.get<string>('AWS_BUCKET_NAME') as string;

    this.s3 = new S3Client({
      region: this.region,

      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') as string,

        secretAccessKey: this.config.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files allowed');
    }

    const fileName = `${uuid()}-${file.originalname}`;

    const key = `${folder}/${fileName}`;

   await this.s3.send(
  new PutObjectCommand({
    Bucket: this.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  }),
);

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async deleteFile(key: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,

        Key: key,
      }),
    );

    return {
      message: 'File deleted successfully',
    };
  }
}
