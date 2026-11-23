# PawHome Pet Adoptions: Backend API

Backend NestJS untuk aplikasi **PawHome** (platform adopsi hewan, frontend React + Vite). Tugas Bab 9: NestJS Dasar + Struktur MVC.

Data utama yang dikelola adalah **Pet** (hewan siap adopsi), dengan CRUD lengkap yang disimpan sementara di array memori (data kembali ke seed awal setiap server di-restart).

## Teknologi
NestJS 12 (ESM), TypeScript, class-validator + class-transformer, Vitest + Supertest. Butuh **Node.js 20.12+**.

## Struktur
```
src/
├── main.ts              # bootstrap, memuat .env, listen
├── app.setup.ts         # ValidationPipe global + CORS
├── app.module.ts
└── pets/                # hasil `nest g resource pets`
    ├── entities/pet.entity.ts   # Model (M)
    ├── dto/                     # create / update / query DTO + validasi
    ├── pets.service.ts          # logika CRUD di array memori
    ├── pets.controller.ts       # endpoint HTTP (C), service via dependency injection
    ├── pets.module.ts
    └── pets.seed.ts             # data awal (dari katalog frontend)
test/pets.e2e-spec.ts    # uji end-to-end semua endpoint
requests.http            # pengujian REST Client (VS Code)
frontend-integration/    # api.js + PetsManager.jsx untuk frontend
docs/screenshots/        # tempat screenshot tugas
```

## Instalasi & Menjalankan
```bash
npm install --legacy-peer-deps   # flag ini menghindari bug resolver npm 10 pada peer dependency Vitest
cp .env.example .env             # opsional; default sudah jalan
npm run start:dev                # http://localhost:3000
```
Produksi: `npm run build && npm run start:prod`. Tes: `npm test` (unit) dan `npm run test:e2e`.

Tidak ada database atau migrasi: sesuai soal, data disimpan di array memori dan diisi 8 hewan awal saat server start.

## Environment (`.env`)
| Variabel | Default | Keterangan |
| --- | --- | --- |
| `PORT` | `3000` | Port server |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` | Origin frontend yang diizinkan (pisahkan koma) |

## Endpoint
| Method | Path | Kegunaan | Status sukses | Error |
| --- | --- | --- | --- | --- |
| GET | `/pets` | Daftar hewan. Query opsional: `jenis`, `q` | 200 | - |
| GET | `/pets/:id` | Detail satu hewan | 200 | 400, 404 |
| POST | `/pets` | Tambah hewan | 201 | 400, 409 |
| PATCH | `/pets/:id` | Ubah sebagian field | 200 | 400, 404, 409 |
| DELETE | `/pets/:id` | Hapus hewan (mengembalikan data yang dihapus) | 200 | 400, 404 |

### Model Pet
| Field | Tipe | Wajib | Aturan validasi |
| --- | --- | --- | --- |
| `id` | number | otomatis | dibuat server |
| `nama` | string | ya | `@IsString`, `@IsNotEmpty`, `@MinLength(2)`, `@MaxLength(50)` |
| `jenis` | string | ya | `@IsString`, `@MinLength(3)`, `@MaxLength(30)` |
| `umur` | number (bulan) | ya | `@IsInt`, `@Min(0)`, `@Max(360)` |
| `ras` | string | tidak | `@IsOptional`, `@MaxLength(60)` |
| `jenisKelamin` | `Jantan` \| `Betina` | tidak | `@IsIn` |
| `lokasi` | string | tidak | `@MaxLength(80)` |
| `deskripsi` | string | tidak | `@MaxLength(250)` |
| `sifat` | string[] | tidak | `@IsArray`, `@ArrayMaxSize(6)`, `@IsString({each})` |
| `sudahSteril` | boolean | tidak | `@IsBoolean` |
| `status` | `Siap Dijemput` \| `Dalam Proses` \| `Urgent Foster` \| `Sudah Diadopsi` | tidak | `@IsIn` |
| `tanggalMasuk` | string (ISO date) | tidak | `@IsDateString` |
| `createdAt`, `updatedAt` | string (ISO) | otomatis | dibuat server |

Contoh response:
```json
{ "id": 9, "nama": "Mochi", "jenis": "Kucing", "ras": "", "jenisKelamin": "Jantan", "umur": 5,
  "lokasi": "Shelter PawHome", "deskripsi": "", "sifat": [], "sudahSteril": false,
  "status": "Siap Dijemput", "tanggalMasuk": "2026-11-23",
  "createdAt": "2026-11-23T10:54:18.747Z", "updatedAt": "2026-11-23T10:54:18.747Z" }
```

### Penanganan error
| Skenario | Exception | Status |
| --- | --- | --- |
| Validasi DTO gagal / `:id` bukan angka | `BadRequestException` (otomatis dari ValidationPipe / ParseIntPipe) | 400 |
| Id tidak ditemukan | `NotFoundException` | 404 |
| Nama + jenis + ras sama sudah ada | `ConflictException` | 409 |

Format error: `{ "statusCode": 404, "message": "...", "error": "Not Found" }`. Pada 400, `message` berupa **array** string.

## Pengujian dengan REST Client
Buka `requests.http` di VS Code (ekstensi *REST Client*), jalankan server, lalu klik **Send Request** pada tiap blok. Simpan screenshot ke `docs/screenshots/` (lihat daftar di sana).

## Menyambungkan ke Frontend
Frontend belum memiliki pemanggilan API (komponen `PetForm`, `PetCard`, `Summary` belum dipakai). Folder `frontend-integration/` berisi sambungan siap pakai:

1. Salin `api.js` ke `src/services/api.js` dan `PetsManager.jsx` ke `src/components/PetsManager.jsx` di repo frontend.
2. Di `src/pages/AvailablePetsPage.jsx`: `import PetsManager from "../components/PetsManager";` lalu tambahkan `<PetsManager />` di dalam `<main>`, sebelum section banner konsultasi.
3. (Opsional) buat `.env` frontend dari `frontend.env.example` bila backend tidak di `localhost:3000`.
4. Jalankan backend (`npm run start:dev`) dan frontend (`npm run dev`), buka halaman **Available Pets**: tambah, ubah, dan hapus data.

## Catatan
- Field `id` yang dikirim `PetForm` (`Date.now()`) sengaja diabaikan; id dibuat server.
- Seed mengikuti katalog (Milo = kucing tabby). `ContactPage.jsx` masih menyebut Milo sebagai anjing; perbedaan ini ada di frontend.
