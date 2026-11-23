import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto.js';

// Semua field menjadi opsional, aturan validasinya tetap diwarisi dari CreatePetDto.
export class UpdatePetDto extends PartialType(CreatePetDto) {}
