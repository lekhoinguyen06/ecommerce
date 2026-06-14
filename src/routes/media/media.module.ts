import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import path from 'path';
import multer from 'multer';
import { generateRandomFileName } from 'src/shared/helpers';

const UPLOAD_PATH = path.resolve('upload');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    const newFileName = generateRandomFileName(file.originalname);
    cb(null, newFileName);
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  controllers: [MediaController],
})
export class MediaModule {}
