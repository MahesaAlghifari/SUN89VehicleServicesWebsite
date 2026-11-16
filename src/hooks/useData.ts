import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../app/providers/AuthProvider";
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

export const useSamsatOffices = () =>
  useQuery({
    queryKey: ["samsat-offices"],
    queryFn: () => repositories.samsat.getOffices(),
  });

export const useWilayah = () =>
  useQuery({
    queryKey: ["wilayah-administratif"],
    queryFn: () => repositories.wilayah.getAll(),
    staleTime: 5 * 60_000,
  });

export const usePricingEstimate = (
  serviceId?: string,
  samsatId?: string,
  metodeLayanan: "Antar Jemput" | "Datang Langsung" = "Antar Jemput",
) =>
  useQuery({
    queryKey: ["pricing-estimate", serviceId, samsatId, metodeLayanan],
    queryFn: () =>
      repositories.pricing.getEstimate({
        serviceId: serviceId!,
        samsatId: samsatId || undefined,
        metodeLayanan,
      }),
    enabled: Boolean(serviceId),
  });

export const usePaymentMethods = () =>
  useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => repositories.paymentMethods.getActive(),
  });

export const useOrders = (customerId?: string) =>
  useQuery({
    queryKey: ["orders", customerId],
    queryFn: () => repositories.orders.getAll(customerId),
  });

export const useCustomerProfile = () =>
  useQuery({ queryKey: ["customer"], queryFn: () => repositories.customers.getCurrent() });

export const useOrderTracking = (id?: string) => {
  const results = useQuery({
    queryKey: ["order-tracking-list", id],
    queryFn: () => repositories.orders.trackAll(id!),
    enabled: Boolean(id?.trim()),
  });

  const primaryOrder = results.data?.[0] ?? null;

  const order = {
    ...results,
    data: primaryOrder,
    allMatches: results.data ?? [],
  };

  const stages = useQuery({
    queryKey: ["stages", primaryOrder?.id ?? id],
    queryFn: () => repositories.orders.getStages(primaryOrder?.id ?? id!),
    enabled: Boolean(id?.trim()) && Boolean(primaryOrder),
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
  const { setCustomerProfile } = useAuth();
  return useMutation({
    mutationFn: (input: Customer) => repositories.customers.update(input),
    onSuccess: (data) => {
      client.setQueryData(["customer"], data);
      setCustomerProfile(data);
    },
  });
};
