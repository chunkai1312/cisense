import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: true } });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
