import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Forum backend api')
    .setDescription('API for scholl forum')
    .setVersion('1.0')
    .addTag('forum')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const envService = app.get(EnvService);
  const port = envService.get('PORT');

  await app.listen(port);
}
bootstrap();
