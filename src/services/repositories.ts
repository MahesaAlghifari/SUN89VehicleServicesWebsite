import { company, customer, orders, orderStages, services } from "../mocks/data";
import type { Customer, Order, OrderInput, OrderStage, Service } from "../types";

const wait = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ServiceRepository {
  getAll(): Promise<Service[]>;
  getById(id: string): Promise<Service | null>;
}

export interface OrderRepository {
  getAll(customerId?: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(input: OrderInput): Promise<Order>;
  getStages(orderId: string): Promise<OrderStage[]>;
}

class MockServiceRepository implements ServiceRepository {
  async getAll() {
    await wait();
    return [...services].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async getById(id: string) {
    await wait(120);
    return services.find((item) => item.id === id) ?? null;
  }
}

class MockOrderRepository implements OrderRepository {
  async getAll(customerId?: string) {
    await wait();
    return customerId ? orders.filter((order) => order.customerId === customerId) : [...orders];
  }
  async getById(id: string) {
    await wait();
    return orders.find((order) => order.id.toUpperCase() === id.toUpperCase()) ?? null;
  }
  async create(input: OrderInput) {
    await wait(650);
    const order: Order = {
      ...input,
      id: `SUN-${Date.now().toString().slice(-6)}`,
      orderDate: new Date().toISOString().slice(0, 10),
      status: "Verifikasi",
      totalCost: 0,
    };
    orders.unshift(order);
    return order;
  }
  async getStages(orderId: string) {
    await wait();
    return orderStages.filter((stage) => stage.orderId === orderId);
  }
}

// Ready for a future HTTP adapter without changing UI consumers.
export class ApiServiceRepository implements ServiceRepository {
  constructor(private readonly baseUrl: string) {}
  async getAll(): Promise<Service[]> {
    throw new Error(`API repository belum dikonfigurasi: ${this.baseUrl}`);
  }
  async getById(): Promise<Service | null> {
    throw new Error(`API repository belum dikonfigurasi: ${this.baseUrl}`);
  }
}

let currentCustomer: Customer = { ...customer };
export const repositories = {
  services: new MockServiceRepository(),
  orders: new MockOrderRepository(),
  company: { get: async () => company },
  customers: {
    getCurrent: async () => {
      await wait(180);
      return currentCustomer;
    },
    update: async (data: Customer) => {
      await wait(450);
      currentCustomer = { ...data };
      return currentCustomer;
    },
  },
};
