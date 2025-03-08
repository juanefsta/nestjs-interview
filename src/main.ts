import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './db/seed';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Seeding on app start
  await seed(app);

  await app.listen(3000);
}

bootstrap();
