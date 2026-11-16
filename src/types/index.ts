export type Service = {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  requiresDestinationSamsat?: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type SamsatOffice = {
  samsatId: string;
  namaSamsat: string;
  wilayah: string;
  alamat: string;
  kabupatenKota: string;
  provinsi: string;
};

export type PublicPricingEstimate = {
  serviceId: string;
  serviceName: string;
  samsatId: string | null;
  namaSamsat: string | null;
  metodeLayanan: "Antar Jemput" | "Datang Langsung";
  estimasiBiayaJasa: number;
  estimasiBiayaAntarJemput: number;
  totalEstimasiAwal: number;
  catatan: string;
};

export type PaymentMethod = {
  paymentMethodId: string;
  namaMetode: string;
  bank: string;
  namaRekening: string;
  nomorRekening: string;
};

export type CustomerType = "PERORANGAN" | "PERUSAHAAN_PT";

export type Customer = {
  id: string;
  accountId?: string;
  customerType: CustomerType;
  fullName: string;
  email: string;
  phone: string;
  provinsi: string;
  kotaKabupaten: string;
  kecamatan: string;
  desaKelurahan: string;
  rtRw: string;
  noRumah: string;
  patokan: string;
  detailAlamat: string;
  linkGoogleMaps: string;
  address?: string;
};

export type WilayahProvince = {
  kodeProvinsi: string;
  namaProvinsi: string;
};

export type WilayahRegency = {
  kodeKabKota: string;
  kodeProvinsi: string;
  namaProvinsi: string;
  namaKabKota: string;
  jenisWilayah: "Kabupaten" | "Kota";
};

export type WilayahData = {
  provinces: WilayahProvince[];
  regencies: WilayahRegency[];
};

export type OrderStage = {
  id: string;
  orderId: string;
  stageCode: string;
  stageName: string;
  status: "completed" | "active" | "pending";
  operationalStatus?: string;
  description?: string;
  estimatedDuration?: string;
  updatedAt?: string;
};

export type Order = {
  id: string;
  invoiceNo?: string;
  customerId: string;
  serviceId: string;
  serviceName?: string;
  vehicleType: string;
  ownershipType: string;
  plateNumber: string;
  orderDate: string;
  status: string;
  workflowStatus?: string;
  paymentStatus?: string;
  samsatOrigin?: string;
  samsatDestination?: string;
  serviceMethod?: string;
  totalCost: number;
  isCompleted?: boolean;
  isCancelled?: boolean;
  stages?: OrderStage[];
};

export type CompanyProfile = {
  companyName: string;
  brandName: string;
  address: string;
  phone: string;
  email?: string;
  whatsapp: string;
  hours: string[];
  mapEmbedUrl: string;
  mapLinkUrl: string;
  socialLinks: Record<string, string>;
};

export type OrderInput = Omit<Order, "id" | "orderDate" | "status" | "totalCost"> & {
  ownerName: string;
  phone: string;
  pickupCity?: string;
  pickupDistrict?: string;
  pickupVillage?: string;
  pickupRtRw?: string;
  pickupHouseNo?: string;
  pickupLandmark?: string;
  pickupMapsUrl?: string;
  returnCity?: string;
  returnDistrict?: string;
  returnVillage?: string;
  returnRtRw?: string;
  returnHouseNo?: string;
  returnLandmark?: string;
  returnMapsUrl?: string;
  pickupAddress: string;
  returnAddress: string;
  vehicleYear: string;
  taxDueDate?: string;
  pkbAmount?: string;
  swdklljAmount?: string;
  samsatOriginId?: string;
  samsatOrigin?: string;
  samsatDestinationId?: string;
  samsatDestination?: string;
  serviceMethod?: "Antar Jemput" | "Datang Langsung";
  lossChronology?: string;
  files?: File[];
};
