import type { CompanyProfile, Customer, Order, OrderStage, Service } from "../types";
import heroImg from "../assets/hero.jpg";
import galleryOfficeTeam from "../assets/gallery-office-team.jpg";
import galleryDocuments from "../assets/gallery-documents.jpg";
import gallerySamsat from "../assets/gallery-samsat.jpg";
import galleryInspection from "../assets/gallery-inspection.jpg";
import galleryHandover from "../assets/gallery-handover.jpg";
import bcaFinanceLogo from "../assets/clients/bca-finance.png";
import bfiFinanceLogo from "../assets/clients/bfi-finance.webp";
import bprsAlsalaamLogo from "../assets/clients/bprs-alsalaam.jpg";
import cimbNiagaFinanceLogo from "../assets/clients/cimb-niaga-finance.jpg";
import clemontFinanceLogo from "../assets/clients/clemont-finance.png";
import clipanFinanceLogo from "../assets/clients/clipan-finance.png";
import csulFinanceLogo from "../assets/clients/csul-finance.png";
import gratamaFinanceLogo from "../assets/clients/gratama-finance.png";
import jTrustBankLogo from "../assets/clients/j-trust-bank.jpg";
import jaccsMpmFinanceLogo from "../assets/clients/jaccs-mpm-finance.png";
import kbBukopinFinanceLogo from "../assets/clients/kb-bukopin-finance.png";
import mandiriUtamaFinanceLogo from "../assets/clients/mandiri-utama-finance.svg";
import smsFinanceLogo from "../assets/clients/sms-finance.svg";
import wooriFinanceLogo from "../assets/clients/woori-finance.png";

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
  address:
    "Jl. Raya Sukahati No. 06, RT 01/RW 03, Sukahati, Kec. Cibinong, Kabupaten Bogor, Jawa Barat 16913",
  phone: "021 8372 4628",
  whatsapp: "081219801888",
  hours: [
    "Senin – Jumat: 08.00 – 17.00",
    "Sabtu: 08.00 – 15.00",
    "Minggu: Tutup",
  ],
  mapEmbedUrl:
    "https://maps.google.com/maps?q=SUN+89+BIRO+JASA+Bogor&z=16&output=embed",
  mapLinkUrl:
    "https://www.google.com/maps/search/?api=1&query=SUN+89+BIRO+JASA+Bogor",
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

export const heroImage = heroImg;

export const officeGallery = [
  {
    src: galleryOfficeTeam,
    title: "Pemeriksaan & sortir berkas di kantor",
    alt: "Tim SUN 89 memeriksa dan menyusun dokumen kendaraan di meja kantor",
    objectPosition: "object-center",
  },
  {
    src: galleryDocuments,
    title: "Kelengkapan dokumen & verifikasi berkas",
    alt: "Verifikasi kelengkapan map berkas dan dokumen kendaraan SUN 89",
    objectPosition: "object-center",
  },
  {
    src: gallerySamsat,
    title: "Pengurusan dokumen di Samsat",
    alt: "Kantor Samsat untuk pengurusan administrasi kendaraan",
    objectPosition: "object-center",
  },
  {
    src: galleryInspection,
    title: "Pendampingan cek fisik kendaraan",
    alt: "Proses cek fisik kendaraan bersama petugas di Polres Bogor",
    objectPosition: "object-[center_35%]",
  },
  {
    src: galleryHandover,
    title: "Pengantaran & serah terima ke pelanggan",
    alt: "Serah terima dokumen STNK dan pelat kendaraan kepada pelanggan SUN 89",
    objectPosition: "object-[center_20%]",
  },
];

export const clientLogos = [
  { name: "BCA Finance", src: bcaFinanceLogo },
  { name: "Mandiri Utama Finance", src: mandiriUtamaFinanceLogo },
  { name: "CIMB Niaga Finance", src: cimbNiagaFinanceLogo },
  { name: "BFI Finance", src: bfiFinanceLogo },
  { name: "Clipan Finance", src: clipanFinanceLogo },
  { name: "KB Bukopin Finance", src: kbBukopinFinanceLogo },
  { name: "J Trust Bank", src: jTrustBankLogo },
  { name: "Woori Finance Indonesia", src: wooriFinanceLogo },
  { name: "CSUL Finance", src: csulFinanceLogo },
  { name: "JACCS MPM Finance", src: jaccsMpmFinanceLogo },
  { name: "SMS Finance", src: smsFinanceLogo },
  { name: "Clemont Finance", src: clemontFinanceLogo },
  { name: "Gratama Finance", src: gratamaFinanceLogo },
  { name: "BPRS AlSalaam", src: bprsAlsalaamLogo },
];

export const testimonials = [
  {
    name: "Ibnu Barand",
    quote: "Pelayanan cepat, lebih cepat dari estimasi. Jika ada sisa uang, dikembalikan.",
  },
  {
    name: "Indra Pastel",
    quote: "Biro jasa terpercaya, ketepatan waktu, transparan, ngak ribet, keren deh pokoknya 👍",
  },
  {
    name: "Andry Setiawan",
    quote:
      "Fast Respon bgt asli !!! Request customer is number one... Mudah-mudahan bisa lebih cepat selesai dari waktu yang telah di tentukan.. mantaapsss joss SUN 89 BIRO JASA",
  },
  {
    name: "Andreas Hariyo",
    quote:
      "Pelayanannya ramah, semua proses dokumen di-update berkala dan transparan. Jika biaya yang dipakai lebih kecil dari estimasi. Langsung diberikan pengembalian dana. Pokoknya mantap.",
  },
  {
    name: "Rna Hidayat",
    quote:
      "Alhamdulillah petugasnya ramah2 dan prosesnya cepat... besok2 kalo urus2 ke SUN89 aja.. recomended pokoknya.... terimaksih sun89",
  },
  {
    name: "Ibrahim Arbil",
    quote:
      "Biro jasa yang saya rekomendasikan. Pelayanan mantap, staff ramah dan sangat membantu. Berkas pengajuan prosesnya cepat dan dapat dijemput dan bisa diantar langsung ke rumah. Mantapp 👍.",
  },
  {
    name: "Papau Fauzan",
    quote:
      "Mantap banget biro jasa ini bisa nyelesain masalah pemberkasan yang ada kendala, pokonya pelayanannya responsif, cepat dan amanah banget, terimakasih sun 89 biro jasa",
  },
];
