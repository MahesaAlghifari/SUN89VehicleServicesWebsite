import type { CompanyProfile, Customer, Order, OrderStage, Service } from "../types";

export const services: Service[] = [
  {
    id: "svc-perp-1th",
    code: "PERP_1THN",
    name: "Perpanjangan 1 Tahun",
    category: "PAJAK_STNK",
    description: "Deskripsi resmi terverifikasi",
    requirements: [
      "KTP asli + fotokopi (2 rangkap)",
      "STNK asli + fotokopi (2 rangkap)",
      "BPKB asli / Surat Keterangan Leasing + fotokopi (2 rangkap)",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "svc-perp-5th",
    code: "PERP_5THN",
    name: "Perpanjangan 5 Tahun",
    category: "PAJAK_STNK",
    description:
      "Perpanjangan STNK 5 tahunan sekaligus ganti plat nomor kendaraan. Perpanjangan STNK setiap 5 tahun sekali bersamaan dengan penggantian plat kendaraan.",
    requirements: [
      "KTP asli + fotokopi (2 rangkap)",
      "STNK asli + fotokopi (2 rangkap)",
      "BPKB asli / Surat Keterangan Leasing + fotokopi (2 rangkap)",
      "Cek fisik kendaraan",
    ],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "svc-mut-asal",
    code: "MUT_ASAL",
    name: "Mutasi Antar Samsat",
    category: "MUTASI",
    description:
      "Pemindahan data kendaraan dalam wilayah Jadetabek dengan proses yang terverifikasi. Pemindahan kepemilikan atau domisili kendaraan antar samsat di wilayah Jadetabek.",
    requirements: [
      "Fotokopi KTP pemilik baru (2 rangkap)",
      "STNK asli + fotokopi (2 rangkap)",
      "BPKB asli + fotokopi (2 rangkap)",
      "Cek fisik kendaraan",
      "Kwitansi pembelian",
      "Surat pelepasan hak (jika atas nama perusahaan)",
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "svc-mut-antar",
    code: "MUT_ANTAR",
    name: "Mutasi Luar Daerah",
    category: "MUTASI",
    description:
      "Proses mutasi kendaraan antar daerah di luar wilayah Jadetabek. Proses penarikan berkas kendaraan dari wilayah Jadetabek untuk pengurusan di luar daerah.",
    requirements: [
      "Fotokopi KTP pemilik baru (daerah tujuan) (2 rangkap)",
      "STNK asli + fotokopi (2 rangkap)",
      "BPKB asli + fotokopi (2 rangkap)",
      "Cek fisik kendaraan",
      "Kwitansi pembelian",
      "Surat pelepasan hak (jika atas nama perusahaan)",
    ],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "svc-balik-nama",
    code: "BALIK_NAMA",
    name: "Balik Nama",
    category: "KEPEMILIKAN",
    description:
      "Proses balik nama kendaraan dari penjual ke pembeli dengan legal dan aman. Proses pengalihan kepemilikan kendaraan dari pemilik lama ke pemilik baru di samsat yang sama.",
    requirements: [
      "Fotokopi KTP pemilik baru (2 rangkap)",
      "STNK asli + fotokopi (2 rangkap)",
      "BPKB asli + fotokopi (2 rangkap)",
      "Cek fisik kendaraan",
      "Kwitansi pembelian",
      "Surat pelepasan hak (jika atas nama perusahaan)",
    ],
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "svc-tarik-berkas",
    code: "TARIK_BERKAS",
    name: "Tarik Berkas",
    category: "DOKUMEN",
    description: "Pengambilan dan penarikan berkas arsip kendaraan dari loket Samsat.",
    requirements: [
      "Surat Kuasa Bermaterai",
      "Fotokopi STNK / BPKB",
      "KTP Pemohon / Penerima Kuasa",
    ],
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "svc-duplikat-stnk",
    code: "DUPLIKAT_STNK",
    name: "Duplikat STNK",
    category: "DOKUMEN",
    description: "Pengurusan penggantian STNK yang hilang atau duplikat dokumen kendaraan.",
    requirements: [
      "KTP asli + fotokopi (2 rangkap)",
      "Fotokopi STNK (jika ada)",
      "BPKB asli / Surat Keterangan Leasing + fotokopi (2 rangkap)",
      "Cek fisik kendaraan",
      "Surat keterangan hilang dari kepolisian",
    ],
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "svc-lainnya",
    code: "LAINNYA",
    name: "Lainnya",
    category: "LAINNYA",
    description: "Pengurusan layanan samsat khusus dan lainnya.",
    requirements: ["Dokumen Pendukung Khusus Sesuai Petunjuk Loket Samsat"],
    isActive: true,
    sortOrder: 8,
  },
];

export const company: CompanyProfile = {
  companyName: "CV. SUN DELAPAN SEMBILAN",
  brandName: "SUN 89",
  address: "Alamat kantor akan dikonfirmasi",
  phone: "Nomor telepon akan dikonfirmasi",
  email: "Email akan dikonfirmasi",
  whatsapp: "Nomor WhatsApp akan dikonfirmasi",
  socialLinks: { instagram: "#", facebook: "#" },
};

export const statistics = [
  { value: "5.000+", label: "Dokumen Terproses" },
  { value: "98%", label: "Kepuasan Pelanggan" },
  { value: "15+", label: "Tahun Pengalaman" },
];

export const customer: Customer = {
  id: "cust-001",
  fullName: "Raka Pratama",
  email: "raka@example.com",
  phone: "0812 0000 0089",
  address: "Jakarta, Indonesia",
};

export const orders: Order[] = [
  {
    id: "SUN-240891",
    customerId: "cust-001",
    serviceId: "svc-perp-5th",
    vehicleType: "Mobil",
    ownershipType: "Pribadi",
    plateNumber: "B 1289 SUN",
    orderDate: "2025-01-16",
    status: "Proses Samsat",
    totalCost: 1250000,
  },
  {
    id: "SUN-240712",
    customerId: "cust-001",
    serviceId: "svc-perp-1th",
    vehicleType: "Motor",
    ownershipType: "Pribadi",
    plateNumber: "B 8912 CV",
    orderDate: "2024-11-08",
    status: "Pengurusan Selesai",
    totalCost: 480000,
  },
];

export const orderStages: OrderStage[] = [
  {
    id: "stg-1",
    orderId: "SUN-240891",
    stageCode: "VERIFIKASI",
    stageName: "Verifikasi",
    status: "completed",
    operationalStatus: "Data diterima",
    description: "Data pesanan telah diverifikasi oleh tim.",
    updatedAt: "16 Jan 2025, 09:30",
  },
  {
    id: "stg-2",
    orderId: "SUN-240891",
    stageCode: "PENJADWALAN",
    stageName: "Penjadwalan",
    status: "completed",
    description: "Penjemputan dokumen telah dijadwalkan.",
    updatedAt: "16 Jan 2025, 13:15",
  },
  {
    id: "stg-3",
    orderId: "SUN-240891",
    stageCode: "VERIFIKASI_DOKUMEN",
    stageName: "Verifikasi Dokumen",
    status: "completed",
    description: "Kelengkapan dokumen telah diperiksa.",
    updatedAt: "17 Jan 2025, 10:10",
  },
  {
    id: "stg-4",
    orderId: "SUN-240891",
    stageCode: "PROSES_SAMSAT",
    stageName: "Proses Samsat",
    status: "active",
    operationalStatus: "Berkas dalam pemeriksaan loket",
    description: "Dokumen sedang diproses di Samsat.",
    estimatedDuration: "Menunggu estimasi dari petugas",
    updatedAt: "18 Jan 2025, 11:20",
  },
  {
    id: "stg-5",
    orderId: "SUN-240891",
    stageCode: "VERIFIKASI_ULANG",
    stageName: "Verifikasi Ulang",
    status: "pending",
  },
  {
    id: "stg-6",
    orderId: "SUN-240891",
    stageCode: "SUPERVISI",
    stageName: "Supervisi",
    status: "pending",
  },
  {
    id: "stg-7",
    orderId: "SUN-240891",
    stageCode: "PENGANTARAN",
    stageName: "Pengantaran",
    status: "pending",
  },
  {
    id: "stg-8",
    orderId: "SUN-240891",
    stageCode: "SELESAI",
    stageName: "Pengurusan Selesai",
    status: "pending",
  },
];

export const officeImages = [
  "https://images.unsplash.com/photo-1621831337128-35676ca30868?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1709497197725-2e97c76b31d0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1693471019113-d2837cc9a2cc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1707823942892-3316eeb091a0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1659384899570-49a0ad1f545a?auto=format&fit=crop&w=1200&q=80",
];
