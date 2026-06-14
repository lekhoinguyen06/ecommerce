import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import envConfig from '../config';
import { readFileSync } from 'fs';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: envConfig.S3_REGION,
      credentials: {
        accessKeyId: envConfig.S3_ACCESS_KEY_ID,
        secretAccessKey: envConfig.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  uploadFile({
    fileName,
    filePath,
    contentType,
  }: {
    fileName: string;
    filePath: string;
    contentType: string;
  }) {
    const parallelUploads3 = new Upload({
      client: this.s3,
      params: {
        Bucket: envConfig.S3_BUCKET_NAME,
        Key: fileName,
        Body: readFileSync(filePath),
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    // parallelUploads3.on('httpUploadProgress', (progress) => {
    //   console.log(progress);
    // });

    return parallelUploads3.done();
  }
}
