import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { JENIS_KELAMIN, STATUS_ADOPSI } from '../entities/pet.entity.js';
import type { JenisKelamin, StatusAdopsi } from '../entities/pet.entity.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePetDto {
  // --- Wajib (sama dengan yang dikirim PetForm di frontend) ---
  @Transform(trim)
  @IsString({ message: 'nama harus berupa teks' })
  @IsNotEmpty({ message: 'nama tidak boleh kosong' })
  @MinLength(2, { message: 'nama minimal 2 karakter' })
  @MaxLength(50, { message: 'nama maksimal 50 karakter' })
  nama: string;

  @Transform(trim)
  @IsString({ message: 'jenis harus berupa teks' })
  @IsNotEmpty({ message: 'jenis tidak boleh kosong' })
  @MinLength(3, { message: 'jenis minimal 3 karakter (contoh: Kucing)' })
  @MaxLength(30, { message: 'jenis maksimal 30 karakter' })
  jenis: string;

  @IsInt({ message: 'umur harus berupa bilangan bulat (satuan bulan)' })
  @Min(0, { message: 'umur tidak boleh negatif' })
  @Max(360, { message: 'umur maksimal 360 bulan' })
  umur: number;

  // --- Opsional (diisi default oleh service jika tidak dikirim) ---
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(60, { message: 'ras maksimal 60 karakter' })
  ras?: string;

  @IsOptional()
  @IsIn(JENIS_KELAMIN, {
    message: `jenisKelamin harus salah satu dari: ${JENIS_KELAMIN.join(', ')}`,
  })
  jenisKelamin?: JenisKelamin;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(80, { message: 'lokasi maksimal 80 karakter' })
  lokasi?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(250, { message: 'deskripsi maksimal 250 karakter' })
  deskripsi?: string;

  @IsOptional()
  @IsArray({ message: 'sifat harus berupa array teks' })
  @ArrayMaxSize(6, { message: 'sifat maksimal 6 item' })
  @IsString({ each: true, message: 'setiap item sifat harus berupa teks' })
  sifat?: string[];

  @IsOptional()
  @IsBoolean({ message: 'sudahSteril harus true atau false' })
  sudahSteril?: boolean;

  @IsOptional()
  @IsIn(STATUS_ADOPSI, {
    message: `status harus salah satu dari: ${STATUS_ADOPSI.join(', ')}`,
  })
  status?: StatusAdopsi;

  @IsOptional()
  @IsDateString({}, { message: 'tanggalMasuk harus format tanggal ISO (YYYY-MM-DD)' })
  tanggalMasuk?: string;
}
