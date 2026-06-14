import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { UPLOAD_PATH } from 'src/shared/constants/media.constant';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        // VALIDATOR: Limit file size to 2 MB
        fileSize: 2 * 1024 * 1024,
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
    return this.mediaService.uploadFile(files);
  }

  @Get('static/:filename')
  serveStaticFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: UPLOAD_PATH }, (err) => {
      if (err) {
        const FileNotFoundException = new NotFoundException('File not found');
        res.status(FileNotFoundException.getStatus()).json({
          statusCode: FileNotFoundException.getStatus(),
          message: FileNotFoundException.message,
        });
      }
    });
  }
}
