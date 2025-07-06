import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import {
  SWAGGER_DESCRIPTION,
  GenerateSwaggerHTML,
} from '../docs/swagger-description';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

async function generateDocs() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blog-APIs')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion('1.0.0')
    .addTag('blogs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const docsDir = path.join(__dirname, '../docs/generated');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Generate standalone HTML
  const html = GenerateSwaggerHTML(document);

  fs.writeFileSync(path.join(docsDir, 'index.html'), html);

  fs.writeFileSync(
    path.join(docsDir, 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  fs.writeFileSync(path.join(docsDir, 'swagger.yaml'), yaml.dump(document));

  console.log('Documentation generated successfully!');
  console.log('Location: docs/generated/');
  console.log('Open: docs/generated/index.html in any browser');

  await app.close();
}

generateDocs().catch(console.error);
