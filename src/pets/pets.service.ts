import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto.js';
import { QueryPetDto } from './dto/query-pet.dto.js';
import { UpdatePetDto } from './dto/update-pet.dto.js';
import type { Pet } from './entities/pet.entity.js';
import { SEED_PETS } from './pets.seed.js';

@Injectable()
export class PetsService {
  // Penyimpanan sementara di memori (data hilang saat server restart).
  private pets: Pet[] = structuredClone(SEED_PETS);
  private nextId = SEED_PETS.reduce((max, pet) => Math.max(max, pet.id), 0) + 1;

  create(dto: CreatePetDto): Pet {
    this.assertNotDuplicate(dto.nama, dto.jenis, dto.ras ?? '');

    const now = new Date().toISOString();
    const pet: Pet = {
      id: this.nextId++,
      nama: dto.nama,
      jenis: dto.jenis,
      ras: dto.ras ?? '',
      jenisKelamin: dto.jenisKelamin ?? 'Jantan',
      umur: dto.umur,
      lokasi: dto.lokasi ?? 'Shelter PawHome',
      deskripsi: dto.deskripsi ?? '',
      sifat: dto.sifat ?? [],
      sudahSteril: dto.sudahSteril ?? false,
      status: dto.status ?? 'Siap Dijemput',
      tanggalMasuk: dto.tanggalMasuk ?? now.slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };

    this.pets.push(pet);
    return pet;
  }

  findAll(query: QueryPetDto = {}): Pet[] {
    const jenis = query.jenis?.trim().toLowerCase();
    const q = query.q?.trim().toLowerCase();

    return this.pets.filter((pet) => {
      if (jenis && !pet.jenis.toLowerCase().includes(jenis)) return false;
      if (q) {
        const haystack = [pet.nama, pet.ras, pet.lokasi, pet.deskripsi, ...pet.sifat]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  findOne(id: number): Pet {
    const pet = this.pets.find((item) => item.id === id);
    if (!pet) {
      throw new NotFoundException(`Hewan dengan id ${id} tidak ditemukan`);
    }
    return pet;
  }

  update(id: number, dto: UpdatePetDto): Pet {
    const pet = this.findOne(id);

    this.assertNotDuplicate(
      dto.nama ?? pet.nama,
      dto.jenis ?? pet.jenis,
      dto.ras ?? pet.ras,
      id,
    );

    // Hanya field yang benar-benar dikirim yang menimpa data lama.
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        (pet as unknown as Record<string, unknown>)[key] = value;
      }
    }
    pet.updatedAt = new Date().toISOString();
    return pet;
  }

  remove(id: number): Pet {
    const pet = this.findOne(id);
    this.pets = this.pets.filter((item) => item.id !== id);
    return pet;
  }

  /** Dua hewan dianggap duplikat jika nama, jenis, dan ras-nya sama (tanpa membedakan huruf besar/kecil). */
  private assertNotDuplicate(nama: string, jenis: string, ras: string, ignoreId?: number) {
    const norm = (value: string) => value.trim().toLowerCase();
    const duplicate = this.pets.find(
      (item) =>
        item.id !== ignoreId &&
        norm(item.nama) === norm(nama) &&
        norm(item.jenis) === norm(jenis) &&
        norm(item.ras) === norm(ras),
    );
    if (duplicate) {
      throw new ConflictException(
        `Hewan bernama "${nama}" (${jenis}) sudah terdaftar dengan id ${duplicate.id}`,
      );
    }
  }
}
