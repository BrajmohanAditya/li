import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from 'node_modules/@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from 'node_modules/@nestjs/swagger/dist/swagger-module';
import helmet from 'helmet';
import compression from 'compression';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.use(helmet());
   app.use(compression());

   app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: ['http://localhost:5173', 'https://li-4q4j.onrender.com'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

   const config = new DocumentBuilder()
    .setTitle('library management superadmin api')
    .setVersion('1.0')
    .addBasicAuth()
    .build()

  const documnet = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documnet);

  await app.listen(process.env.PORT ?? 3000);

  console.log(`server is running ${process.env.PORT}`);
}
bootstrap();
