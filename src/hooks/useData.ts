import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { repositories } from "../services/repositories";
import type { Customer, OrderInput } from "../types";

export const useServices = () =>
  useQuery({ queryKey: ["services"], queryFn: () => repositories.services.getAll() });
export const useCompanyProfile = () =>
  useQuery({ queryKey: ["company"], queryFn: () => repositories.company.get() });
export const useServiceById = (id?: string) =>
  useQuery({
    queryKey: ["service", id],
    queryFn: () => repositories.services.getById(id!),
    enabled: Boolean(id),
  });
export const useOrders = (customerId?: string) =>
  useQuery({
    queryKey: ["orders", customerId],
    queryFn: () => repositories.orders.getAll(customerId),
  });
export const useCustomerProfile = () =>
  useQuery({ queryKey: ["customer"], queryFn: () => repositories.customers.getCurrent() });
export const useOrderTracking = (id?: string) => {
  const order = useQuery({
    queryKey: ["order", id],
    queryFn: () => repositories.orders.getById(id!),
    enabled: Boolean(id),
  });
  const stages = useQuery({
    queryKey: ["stages", id],
    queryFn: () => repositories.orders.getStages(id!),
    enabled: Boolean(id) && Boolean(order.data),
  });
  return { order, stages };
};
export const useCreateOrder = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderInput) => repositories.orders.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: ["orders"] }),
  });
};
export const useUpdateCustomer = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: Customer) => repositories.customers.update(input),
    onSuccess: (data) => client.setQueryData(["customer"], data),
  });
};
