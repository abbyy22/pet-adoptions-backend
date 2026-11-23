import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

describe('Pets API (e2e)', () => {
  let app: INestApplication;
  const http = () => request(app.getHttpServer());

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /pets -> 200 array', async () => {
    const res = await http().get('/pets').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('nama');
  });

  it('POST /pets payload PetForm (dengan id dari Date.now) -> 201 dan id diabaikan', async () => {
    const res = await http()
      .post('/pets')
      .send({ id: 1732345678901, nama: 'Mochi', jenis: 'Kucing', umur: 5 })
      .expect(201);
    expect(res.body.id).not.toBe(1732345678901);
    expect(res.body).toMatchObject({ nama: 'Mochi', jenis: 'Kucing', umur: 5 });
  });

  it('POST /pets data tidak valid -> 400 dengan daftar pesan', async () => {
    const res = await http().post('/pets').send({ nama: 'A', jenis: '', umur: -3, status: 'x' }).expect(400);
    expect(Array.isArray(res.body.message)).toBe(true);
    expect(res.body.message.length).toBeGreaterThanOrEqual(3);
  });

  it('POST /pets duplikat -> 409', async () => {
    await http().post('/pets').send({ nama: 'Milo', jenis: 'Kucing', ras: 'Tabby Orange Domestik', umur: 18 }).expect(409);
  });

  it('GET /pets/:id -> 200 / 404 / 400', async () => {
    await http().get('/pets/1').expect(200);
    await http().get('/pets/9999').expect(404);
    await http().get('/pets/abc').expect(400);
  });

  it('PATCH /pets/:id -> 200 dan 404', async () => {
    const res = await http().patch('/pets/1').send({ umur: 24, status: 'Dalam Proses' }).expect(200);
    expect(res.body).toMatchObject({ id: 1, umur: 24, status: 'Dalam Proses' });
    await http().patch('/pets/9999').send({ umur: 3 }).expect(404);
    await http().patch('/pets/1').send({ umur: 'banyak' }).expect(400);
  });

  it('DELETE /pets/:id -> 200 lalu 404', async () => {
    await http().delete('/pets/2').expect(200);
    await http().get('/pets/2').expect(404);
    await http().delete('/pets/2').expect(404);
  });

  it('CORS mengizinkan origin frontend Vite dan preflight PATCH', async () => {
    const res = await http()
      .options('/pets/1')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'PATCH')
      .expect(204);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(res.headers['access-control-allow-methods']).toContain('PATCH');
  });
});
