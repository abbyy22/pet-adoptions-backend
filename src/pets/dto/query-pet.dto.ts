import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryPetDto {
  /** Filter jenis hewan, mis. ?jenis=Kucing */
  @IsOptional()
  @IsString()
  @MaxLength(30)
  jenis?: string;

  /** Pencarian bebas pada nama, ras, lokasi, deskripsi, mis. ?q=milo */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  q?: string;
}
