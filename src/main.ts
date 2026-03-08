import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
// import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: false,
  //     forbidNonWhitelisted: false,
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: true,
  //     },
  //     exceptionFactory(errors) {
  //       return new UnprocessableEntityException(
  //         errors.map((error) => ({
  //           field: error.property,
  //           error: error.constraints,
  //         })),
  //       );
  //     },
  //   }),
  // );
  // app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
