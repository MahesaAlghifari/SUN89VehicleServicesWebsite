export type Service = {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  sortOrder: number;
};

export type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

export type Order = {
  id: string;
  customerId: string;
  serviceId: string;
  vehicleType: string;
  ownershipType: string;
  plateNumber: string;
  orderDate: string;
  status: string;
  totalCost: number;
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

export type CompanyProfile = {
  companyName: string;
  brandName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  socialLinks: Record<string, string>;
};

export type OrderInput = Omit<Order, "id" | "orderDate" | "status" | "totalCost"> & {
  ownerName: string;
  phone: string;
  pickupAddress: string;
  returnAddress: string;
  vehicleYear: string;
};
