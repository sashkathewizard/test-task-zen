import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || '3001';
  await app.listen(port);
  console.log(`Server listening ${port} port`);
}
bootstrap();
