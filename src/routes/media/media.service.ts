import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { generateRandomFileName } from 'src/shared/helpers';
import { S3Service } from 'src/shared/services/s3.service';

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Express.Multer.File[]) {
    const result = await Promise.all(
      files.map((file) => {
        return this.s3Service
          .uploadFile({
            fileName: `images/${file.filename}`,
            filePath: file.path,
            contentType: file.mimetype,
          })
          .then((res) => {
            return {
              url: res.Location,
              key: res.Key,
              bucket: res.Bucket,
            };
          });
      }),
    );
    await Promise.all(
      files.map((file) => {
        return unlink(file.path);
      }),
    );
    return {
      message: 'Files uploaded successfully!',
      files: result,
    };
  }

  async getPresignedUrl(body: { fileName: string }) {
    const randomFileName = generateRandomFileName(body.fileName);
    const presignedUrl =
      await this.s3Service.createPresignedUrl(randomFileName);
    return {
      presignedUrl,
      url: presignedUrl.split('?')[0],
    };
  }
}
