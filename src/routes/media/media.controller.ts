import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        // VALIDATOR: Limit file size to 5 MB
        fileSize: 5 * 1024 * 1024, // 5 MB
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
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file);
  }
}
