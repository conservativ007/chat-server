import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CONSTANTS } from './common/constants';

import * as fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/privkey.pem'),
  cert: fs.readFileSync('./secrets/fullchain.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // in this place we validate incoming body
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(CONSTANTS.PORT);
  console.log(`The server is listening on port ${CONSTANTS.PORT}`);
}
bootstrap();
