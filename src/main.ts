import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seed } from './db/seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Seeding on app start
  await seed(app);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Routes')
    .setDescription('API documentation for my app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor()); // 🔥 Aplicar interceptor global

  await app.listen(3000);
}

bootstrap();
