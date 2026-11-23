export const JENIS_KELAMIN = ['Jantan', 'Betina'] as const;
export const STATUS_ADOPSI = [
  'Siap Dijemput',
  'Dalam Proses',
  'Urgent Foster',
  'Sudah Diadopsi',
] as const;

export type JenisKelamin = (typeof JENIS_KELAMIN)[number];
export type StatusAdopsi = (typeof STATUS_ADOPSI)[number];

/**
 * Data utama aplikasi PawHome: hewan yang tersedia untuk diadopsi.
 * Field id, nama, jenis, umur mengikuti komponen PetForm/PetCard di frontend
 * (umur dalam satuan BULAN). Field lain dipakai oleh halaman katalog.
 */
export class Pet {
  id: number;
  nama: string;
  jenis: string;
  ras: string;
  jenisKelamin: JenisKelamin;
  umur: number;
  lokasi: string;
  deskripsi: string;
  sifat: string[];
  sudahSteril: boolean;
  status: StatusAdopsi;
  tanggalMasuk: string;
  createdAt: string;
  updatedAt: string;
}
