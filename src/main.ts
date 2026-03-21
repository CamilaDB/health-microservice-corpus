import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Health Microservice Corpus')
    .setDescription(
      'Microsserviço REST em NestJS usado como corpus experimental para avaliação de geração automatizada de testes unitários com LLMs/SLMs.',
    )
    .setVersion('1.0')
    .addTag('patients')
    .addTag('encounters')
    .addTag('orders')
    .addTag('results')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap();
