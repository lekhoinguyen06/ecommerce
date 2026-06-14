import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import envConfig from 'src/shared/config';

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        // VALIDATOR: Limit file size to 2 MB
        fileSize: 2 * 1024 * 1024, // 2 MB
      },
      fileFilter(req, file, callback) {
        // VALIDATOR: Is the file an image?
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }

        // VALIDATOR: Does the file have an allowed extension?
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        if (
          !allowedExtensions.some((ext) =>
            file.originalname.toLowerCase().endsWith(ext),
          )
        ) {
          return callback(
            new BadRequestException(
              'Only jpg, jpeg, png, and gif files are allowed!',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return {
      message: 'Files uploaded successfully!',
      files: files.map((file) => ({
        originalname: file.originalname,
        url: `${envConfig.STATIC_ENDPOINT}/${file.filename}`,
      })),
    };
  }
}
