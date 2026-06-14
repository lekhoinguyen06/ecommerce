import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UPLOAD_PATH } from './shared/constants/media.constant';
import envConfig from './shared/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(UPLOAD_PATH, {
    prefix: envConfig.STATIC_PREFIX,
  });
  await app.listen(envConfig.APP_PORT ?? 3000);
}
bootstrap();
