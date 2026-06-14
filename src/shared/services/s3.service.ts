import { Injectable } from '@nestjs/common';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import envConfig from '../config';

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

    this.s3
      .send(new ListBucketsCommand({}))
      .then((data) => {
        console.log('S3 Connection Successful. Buckets:', data.Buckets);
      })
      .catch((err) => {
        console.error('S3 Connection Failed:', err);
      });
  }
}
