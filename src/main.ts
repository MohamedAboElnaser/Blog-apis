import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SWAGGER_DESCRIPTION } from 'docs/swagger-description';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Blog-APIs')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('1.0')
    .addTag('blogs')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
