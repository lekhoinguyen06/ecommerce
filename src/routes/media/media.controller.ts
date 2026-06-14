import {
  BadRequestException,
  Body,
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
import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_FILE_ARRAY,
  MAX_FILE_SIZE,
  UPLOAD_PATH,
} from 'src/shared/constants/media.constant';
import { MediaService } from './media.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  PresignedUrlBodyDTO,
  PresignedUrlResDTO,
  UploadedFileResDTO,
} from './media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @ZodSerializerDto(UploadedFileResDTO)
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILE_ARRAY, {
      limits: {
        // VALIDATOR: Limit file size to 2 MB
        fileSize: MAX_FILE_SIZE,
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
        const allowedExtensions = ALLOWED_IMAGE_EXTENSIONS;
        if (
          !allowedExtensions.some((ext) =>
            file.originalname.toLowerCase().endsWith(ext),
          )
        ) {
          return callback(
            new BadRequestException(
              `Only ${ALLOWED_IMAGE_EXTENSIONS.join(', ')} files are allowed!`,
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

  @Post('presigned-url')
  @ZodSerializerDto(PresignedUrlResDTO)
  getPresignedUrl(@Body() body: PresignedUrlBodyDTO) {
    return this.mediaService.getPresignedUrl(body);
  }
}
