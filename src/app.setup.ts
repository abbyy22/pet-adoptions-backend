import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Konfigurasi bersama yang dipakai main.ts dan e2e test. */
export function configureApp(app: INestApplication) {
  // ValidationPipe global: validasi DTO otomatis di semua endpoint.
  // whitelist membuang field yang tidak dikenal (mis. `id` yang dikirim PetForm).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
}
