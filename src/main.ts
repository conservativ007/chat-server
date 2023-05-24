import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CONSTANTS } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // in this place we validate incoming body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(CONSTANTS.PORT);
  console.log(`The server is listening on port ${CONSTANTS.PORT}`);
  // console.log(42);
}
bootstrap();
