import { ConflictException, NotFoundException } from '@nestjs/common';
import { PetsService } from './pets.service.js';

describe('PetsService', () => {
  let service: PetsService;

  beforeEach(() => {
    service = new PetsService();
  });

  it('memuat data seed dan findAll mengembalikan array', () => {
    expect(service.findAll().length).toBeGreaterThanOrEqual(8);
  });

  it('create memberi id baru dan nilai default', () => {
    const pet = service.create({ nama: 'Mochi', jenis: 'Kucing', umur: 5 });
    expect(pet.id).toBeGreaterThan(8);
    expect(pet.status).toBe('Siap Dijemput');
    expect(service.findOne(pet.id).nama).toBe('Mochi');
  });

  it('create menolak duplikat dengan ConflictException', () => {
    service.create({ nama: 'Mochi', jenis: 'Kucing', umur: 5 });
    expect(() => service.create({ nama: 'mochi', jenis: 'KUCING', umur: 7 })).toThrow(ConflictException);
  });

  it('findOne melempar NotFoundException bila id tidak ada', () => {
    expect(() => service.findOne(9999)).toThrow(NotFoundException);
  });

  it('update hanya mengubah field yang dikirim', () => {
    const before = service.findOne(1);
    const jenis = before.jenis;
    const updated = service.update(1, { umur: 20 });
    expect(updated.umur).toBe(20);
    expect(updated.jenis).toBe(jenis);
  });

  it('remove menghapus data dan mengembalikannya', () => {
    const removed = service.remove(1);
    expect(removed.id).toBe(1);
    expect(() => service.findOne(1)).toThrow(NotFoundException);
  });

  it('findAll mendukung filter jenis dan pencarian q', () => {
    expect(service.findAll({ jenis: 'anjing' }).every((p) => p.jenis === 'Anjing')).toBe(true);
    expect(service.findAll({ q: 'golden' }).map((p) => p.nama)).toEqual(['Rocky']);
  });
});
