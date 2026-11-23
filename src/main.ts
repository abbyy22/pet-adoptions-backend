import { NestFactory } from '@nestjs/core';
import { configureApp } from './app.setup.js';
import { AppModule } from './app.module.js';

// Muat file .env bila ada (fitur bawaan Node 20.12+, tanpa dependensi tambahan).
try {
  process.loadEnvFile();
} catch {
  // .env bersifat opsional; nilai default dipakai jika tidak ada.
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`PawHome API berjalan di http://localhost:${port}`);
}
await bootstrap();
