import { company, customer, orders, orderStages, services } from "../mocks/data";
import type {
  Customer,
  CustomerType,
  Order,
  OrderInput,
  OrderStage,
  PaymentMethod,
  PublicPricingEstimate,
  SamsatOffice,
  Service,
  WilayahData,
} from "../types";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api/v1/public"
).replace(/\/$/, "");

export const AUTH_TOKEN_KEY = "sun89-token";
export const AUTH_CUSTOMER_KEY = "sun89-customer";
export const AUTH_FLAG_KEY = "sun89-auth";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(init?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || (payload && payload.success === false)) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Permintaan gagal dengan status ${response.status}`;
    const code = payload?.error?.code;
    throw new ApiClientError(message, response.status, code);
  }

  return (payload?.data ?? payload) as T;
}

function isNetworkError(err: unknown): boolean {
  return !(err instanceof ApiClientError);
}

function mapTimelineToOrderStages(
  orderNo: string,
  timeline?: Array<{
    step: number;
    stageName: string;
    label: string;
    status: "WAITING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    waktuSelesai: string | null;
  }>,
  publicStageName?: string,
): OrderStage[] {
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return [];
  }

  return timeline.map((item) => {
    const status: OrderStage["status"] =
      item.status === "COMPLETED"
        ? "completed"
        : item.status === "IN_PROGRESS"
          ? "active"
          : "pending";

    let updatedAt: string | undefined;
    if (item.waktuSelesai) {
      const parsed = new Date(item.waktuSelesai);
      updatedAt = !isNaN(parsed.getTime())
        ? parsed.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : item.waktuSelesai;
    }

    return {
      id: `${orderNo}-step-${item.step}`,
      orderId: orderNo,
      stageCode: `STEP_${item.step}`,
      stageName: item.label || item.stageName,
      status,
      operationalStatus:
        status === "active"
          ? publicStageName || "Sedang Diproses"
          : item.status === "CANCELLED"
            ? "Dibatalkan"
            : status === "completed"
              ? "Selesai"
              : undefined,
      description:
        status === "active"
          ? `Tahap aktif: ${publicStageName || item.label}`
          : status === "completed"
            ? `Tahap ${item.label.toLowerCase()} telah diselesaikan.`
            : `Menunggu tahap sebelumnya selesai.`,
      updatedAt,
    };
  });
}

function mapBackendOrderToOrder(raw: any): Order {
  const orderId = String(raw.orderNo || raw.id || "");
  const stages = mapTimelineToOrderStages(orderId, raw.timeline, raw.publicStageName);
  return {
    id: orderId,
    invoiceNo: raw.noInvoice || undefined,
    customerId: String(raw.customerId || "cust-001"),
    serviceId: String(raw.serviceId || ""),
    serviceName: String(raw.layanan || raw.serviceName || ""),
    vehicleType: String(raw.tipeKendaraan || raw.vehicleType || "Mobil"),
    ownershipType: String(raw.kepemilikanKendaraan || raw.ownershipType || "Pribadi"),
    plateNumber: String(raw.nopol || raw.plateNumber || "-"),
    orderDate: String(raw.tanggalOrder || raw.createdAt || raw.orderDate || new Date().toISOString()),
    status: String(raw.publicStageName || raw.currentStageName || raw.status || "Verifikasi"),
    workflowStatus: String(raw.statusPengerjaan || "Diproses"),
    paymentStatus: String(raw.paymentStatus || "Belum Lunas"),
    samsatOrigin: String(raw.samsatAsal || "-"),
    samsatDestination: String(raw.samsatTujuan || "-"),
    serviceMethod: String(raw.metodeLayanan || "Antar Jemput"),
    totalCost: Number(raw.totalBiaya ?? raw.totalEstimasiAwal ?? raw.totalCost ?? 0),
    isCompleted: Boolean(raw.isCompleted),
    isCancelled: Boolean(raw.isCancelled),
    stages,
  };
}

export interface ServiceRepository {
  getAll(): Promise<Service[]>;
  getById(id: string): Promise<Service | null>;
}

export interface OrderRepository {
  getAll(customerId?: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  trackAll(query: string): Promise<Order[]>;
  create(input: OrderInput): Promise<Order>;
  getStages(orderId: string): Promise<OrderStage[]>;
}

class BackendServiceRepository implements ServiceRepository {
  async getAll(): Promise<Service[]> {
    try {
      const rows = await apiRequest<
        Array<{
          serviceId: string;
          serviceName: string;
          kodeLayanan: string;
          kategori: string;
          memerlukanSamsatTujuan?: boolean;
          deskripsi: string;
          persyaratan: string[];
          urutan?: number;
        }>
      >("/services");

      return rows.map((row, index) => ({
        id: row.serviceId,
        code: row.kodeLayanan,
        name: row.serviceName,
        category: row.kategori,
        description: row.deskripsi || "",
        requirements: Array.isArray(row.persyaratan) ? row.persyaratan : [],
        requiresDestinationSamsat: Boolean(row.memerlukanSamsatTujuan),
        isActive: true,
        sortOrder: row.urutan ?? index + 1,
      }));
    } catch (err) {
      if (isNetworkError(err)) {
        return [...services].sort((a, b) => a.sortOrder - b.sortOrder);
      }
      throw err;
    }
  }

  async getById(id: string): Promise<Service | null> {
    if (!id) return null;
    const all = await this.getAll();
    const norm = id.trim().toLowerCase();
    return (
      all.find(
        (item) =>
          item.id.toLowerCase() === norm ||
          item.code.toLowerCase() === norm ||
          item.name.toLowerCase() === norm,
      ) ?? null
    );
  }
}

class BackendOrderRepository implements OrderRepository {
  private lastTrackedCache = new Map<string, Order>();

  async getAll(customerId?: string): Promise<Order[]> {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return customerId ? orders.filter((o) => o.customerId === customerId) : [...orders];
    }

    try {
      const rows = await apiRequest<any[]>("/customer/orders");
      const mapped = rows.map(mapBackendOrderToOrder);
      for (const item of mapped) {
        this.lastTrackedCache.set(item.id.toUpperCase(), item);
      }
      return mapped;
    } catch (err) {
      if (isNetworkError(err)) {
        return customerId ? orders.filter((o) => o.customerId === customerId) : [...orders];
      }
      throw err;
    }
  }

  async trackAll(query: string): Promise<Order[]> {
    const clean = query.trim();
    if (!clean) return [];

    try {
      const rows = await apiRequest<any[]>(
        `/orders/tracking?nopol=${encodeURIComponent(clean)}`,
      );
      const mapped = (rows || []).map(mapBackendOrderToOrder);
      for (const item of mapped) {
        this.lastTrackedCache.set(item.id.toUpperCase(), item);
        this.lastTrackedCache.set(clean.toUpperCase(), item);
      }
      if (mapped.length > 0) {
        return mapped;
      }

      // Check local mock fallback if query matches demo SUN-* ID
      const mockMatch = orders.find((o) => o.id.toUpperCase() === clean.toUpperCase());
      return mockMatch ? [mockMatch] : [];
    } catch (err) {
      if (isNetworkError(err)) {
        const mockMatch = orders.find(
          (o) =>
            o.id.toUpperCase() === clean.toUpperCase() ||
            o.plateNumber.replace(/\s+/g, "").toUpperCase() ===
              clean.replace(/\s+/g, "").toUpperCase(),
        );
        return mockMatch ? [mockMatch] : [];
      }
      throw err;
    }
  }

  async getById(id: string): Promise<Order | null> {
    const results = await this.trackAll(id);
    return results[0] ?? null;
  }

  async getStages(orderId: string): Promise<OrderStage[]> {
    const clean = orderId.trim();
    if (!clean) return [];

    const cached = this.lastTrackedCache.get(clean.toUpperCase());
    if (cached?.stages && cached.stages.length > 0) {
      return cached.stages;
    }

    try {
      const matched = await this.getById(clean);
      if (matched?.stages && matched.stages.length > 0) {
        return matched.stages;
      }
      if (matched && matched.plateNumber) {
        const detail = await apiRequest<any>(
          `/orders/${encodeURIComponent(matched.id)}/tracking?nopol=${encodeURIComponent(matched.plateNumber)}`,
        );
        const stages = mapTimelineToOrderStages(
          matched.id,
          detail.timeline,
          detail.publicStageName,
        );
        if (stages.length > 0) return stages;
      }
    } catch {
      // Fallback to mock stages if demo order
    }

    return orderStages.filter((stage) => stage.orderId.toUpperCase() === clean.toUpperCase());
  }

  async create(input: OrderInput): Promise<Order> {
    const formData = new FormData();
    formData.append("customer", input.ownerName.trim());
    formData.append("namaPemilik", input.ownerName.trim());
    formData.append("nomorHP", input.phone.trim());
    formData.append("serviceId", input.serviceId.trim());
    formData.append("nopol", input.plateNumber.trim().toUpperCase());
    formData.append("tipeKendaraan", input.vehicleType || "Mobil");
    formData.append("kepemilikanKendaraan", input.ownershipType || "Pribadi");
    formData.append("tahunKendaraan", input.vehicleYear || String(new Date().getFullYear()));
    formData.append("metodeLayanan", input.serviceMethod || "Antar Jemput");

    if (input.taxDueDate) formData.append("pkbBerlakuSd", input.taxDueDate);
    if (input.pkbAmount) formData.append("nominalPkbTerakhir", input.pkbAmount);
    if (input.swdklljAmount) formData.append("nominalSwdkllj", input.swdklljAmount);
    if (input.samsatOriginId) formData.append("samsatAsalId", input.samsatOriginId);
    if (input.samsatOrigin) formData.append("wilayahSamsatAsal", input.samsatOrigin);
    if (input.samsatDestinationId) formData.append("samsatTujuanId", input.samsatDestinationId);
    if (input.samsatDestination) formData.append("wilayahSamsatTujuan", input.samsatDestination);
    if (input.pickupCity) formData.append("kotaPenjemputan", input.pickupCity);
    if (input.pickupDistrict) formData.append("kecamatanPenjemputan", input.pickupDistrict);
    if (input.pickupVillage) formData.append("kelurahanPenjemputan", input.pickupVillage);
    if (input.pickupRtRw) formData.append("rtRwPenjemputan", input.pickupRtRw);
    if (input.pickupHouseNo) formData.append("noRumahPenjemputan", input.pickupHouseNo);
    if (input.pickupLandmark) formData.append("patokanPenjemputan", input.pickupLandmark);
    if (input.pickupMapsUrl) formData.append("mapsPenjemputan", input.pickupMapsUrl);
    if (input.returnCity) formData.append("kotaPengantaran", input.returnCity);
    if (input.returnDistrict) formData.append("kecamatanPengantaran", input.returnDistrict);
    if (input.returnVillage) formData.append("kelurahanPengantaran", input.returnVillage);
    if (input.returnRtRw) formData.append("rtRwPengantaran", input.returnRtRw);
    if (input.returnHouseNo) formData.append("noRumahPengantaran", input.returnHouseNo);
    if (input.returnLandmark) formData.append("patokanPengantaran", input.returnLandmark);
    if (input.returnMapsUrl) formData.append("mapsPengantaran", input.returnMapsUrl);
    if (input.pickupAddress) formData.append("alamatPenjemputan", input.pickupAddress);
    if (input.returnAddress) formData.append("alamatPengantaran", input.returnAddress);
    if (input.customerId) formData.append("customerId", input.customerId);

    const notesParts: string[] = [];
    if (input.lossChronology?.trim()) {
      notesParts.push(`Kronologi Kehilangan: ${input.lossChronology.trim()}`);
    }
    if (input.pickupAddress?.trim() && input.returnAddress?.trim()) {
      notesParts.push(
        `Jemput: ${input.pickupCity ? `${input.pickupCity} - ` : ""}${input.pickupAddress.trim()} | Antar: ${input.returnCity ? `${input.returnCity} - ` : ""}${input.returnAddress.trim()}`,
      );
    }
    if (notesParts.length > 0) {
      formData.append("catatan", notesParts.join(" | ").slice(0, 500));
    }

    if (Array.isArray(input.files)) {
      for (const file of input.files.slice(0, 5)) {
        formData.append("files", file);
      }
    }

    const created = await apiRequest<any>("/orders", {
      method: "POST",
      headers: {
        "x-idempotency-key": `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      },
      body: formData,
    });

    const mapped = mapBackendOrderToOrder({
      ...created,
      serviceId: input.serviceId,
      customerId: input.customerId,
      ownershipType: input.ownershipType,
    });

    this.lastTrackedCache.set(mapped.id.toUpperCase(), mapped);
    return mapped;
  }
}

export function normalizeCustomer(raw: any): Customer {
  const detail = String(raw?.detailAlamat ?? raw?.address ?? "").trim();
  const rawType = String(raw?.customerType ?? raw?.tipePelanggan ?? "").toUpperCase();
  const customerType: CustomerType =
    rawType === "PERUSAHAAN_PT" || rawType === "PERUSAHAAN" ? "PERUSAHAAN_PT" : "PERORANGAN";

  return {
    id: String(raw?.id || customer.id),
    accountId: raw?.accountId ? String(raw.accountId) : undefined,
    customerType,
    fullName: String(raw?.fullName || ""),
    email: String(raw?.email || ""),
    phone: String(raw?.phone || ""),
    provinsi: String(raw?.provinsi || ""),
    kotaKabupaten: String(raw?.kotaKabupaten || ""),
    kecamatan: String(raw?.kecamatan || ""),
    desaKelurahan: String(raw?.desaKelurahan || ""),
    rtRw: String(raw?.rtRw || ""),
    noRumah: String(raw?.noRumah || ""),
    patokan: String(raw?.patokan || ""),
    detailAlamat: detail,
    linkGoogleMaps: String(raw?.linkGoogleMaps || ""),
    address: detail,
  };
}

let fallbackCustomer: Customer = (() => {
  try {
    const raw = localStorage.getItem(AUTH_CUSTOMER_KEY);
    if (raw) return normalizeCustomer(JSON.parse(raw));
  } catch {}
  return normalizeCustomer(customer);
})();

export const repositories = {
  services: new BackendServiceRepository(),
  orders: new BackendOrderRepository(),
  company: { get: async () => company },
  samsat: {
    getOffices: async (params?: { search?: string; provinsi?: string }): Promise<SamsatOffice[]> => {
      const qs = new URLSearchParams();
      if (params?.search) qs.set("search", params.search);
      if (params?.provinsi) qs.set("provinsi", params.provinsi);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return apiRequest<SamsatOffice[]>(`/samsat${suffix}`);
    },
  },
  wilayah: {
    getAll: async (provinsi?: string): Promise<WilayahData> => {
      const qs = new URLSearchParams();
      if (provinsi) qs.set("provinsi", provinsi);
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      return apiRequest<WilayahData>(`/wilayah${suffix}`);
    },
  },
  pricing: {
    getEstimate: async (params: {
      serviceId: string;
      samsatId?: string;
      metodeLayanan?: "Antar Jemput" | "Datang Langsung";
    }): Promise<PublicPricingEstimate> => {
      const qs = new URLSearchParams({ serviceId: params.serviceId });
      if (params.samsatId) qs.set("samsatId", params.samsatId);
      if (params.metodeLayanan) qs.set("metodeLayanan", params.metodeLayanan);
      return apiRequest<PublicPricingEstimate>(`/pricing?${qs.toString()}`);
    },
  },
  paymentMethods: {
    getActive: async (): Promise<PaymentMethod[]> => {
      return apiRequest<PaymentMethod[]>("/payment-methods");
    },
  },
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const result = await apiRequest<{ token: string; customer: Customer }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      const normalized = normalizeCustomer(result.customer);
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem(AUTH_CUSTOMER_KEY, JSON.stringify(normalized));
      localStorage.setItem(AUTH_FLAG_KEY, "true");
      fallbackCustomer = normalized;
      return { token: result.token, customer: normalized };
    },
    register: async (payload: {
      customerType?: CustomerType;
      fullName: string;
      email: string;
      phone: string;
      password: string;
      address?: string;
      detailAlamat?: string;
    }) => {
      const result = await apiRequest<{ token: string; customer: Customer }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeCustomer(result.customer);
      localStorage.setItem(AUTH_TOKEN_KEY, result.token);
      localStorage.setItem(AUTH_CUSTOMER_KEY, JSON.stringify(normalized));
      localStorage.setItem(AUTH_FLAG_KEY, "true");
      fallbackCustomer = normalized;
      return { token: result.token, customer: normalized };
    },
    logout: () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_CUSTOMER_KEY);
      localStorage.removeItem(AUTH_FLAG_KEY);
    },
  },
  customers: {
    getCurrent: async (): Promise<Customer> => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        return fallbackCustomer;
      }
      try {
        const data = await apiRequest<Customer>("/customer/me");
        const normalized = normalizeCustomer(data);
        fallbackCustomer = normalized;
        localStorage.setItem(AUTH_CUSTOMER_KEY, JSON.stringify(normalized));
        return normalized;
      } catch (err) {
        if (err instanceof ApiClientError && err.status === 401) {
          repositories.auth.logout();
        }
        return fallbackCustomer;
      }
    },
    update: async (data: Customer): Promise<Customer> => {
      const payload = {
        ...data,
        address: data.detailAlamat,
      };
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        fallbackCustomer = normalizeCustomer(payload);
        localStorage.setItem(AUTH_CUSTOMER_KEY, JSON.stringify(fallbackCustomer));
        return fallbackCustomer;
      }
      const updated = await apiRequest<Customer>("/customer/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const normalized = normalizeCustomer(updated);
      fallbackCustomer = normalized;
      localStorage.setItem(AUTH_CUSTOMER_KEY, JSON.stringify(normalized));
      return normalized;
    },
  },
};
