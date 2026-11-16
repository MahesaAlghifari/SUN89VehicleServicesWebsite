import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Lightbulb,
  Paperclip,
  X,
} from "lucide-react";
import {
  useCreateOrder,
  useCustomerProfile,
  usePricingEstimate,
  useSamsatOffices,
  useServices,
} from "../../hooks/useData";
import { useAuth } from "../../app/providers/AuthProvider";
import type { Customer } from "../../types";

function formatCustomerFullAddress(c: Customer): string {
  const base = (c.detailAlamat || c.address || "").trim();
  const extraParts = [
    c.noRumah?.trim(),
    c.rtRw?.trim() ? `RT/RW ${c.rtRw.trim()}` : "",
    c.desaKelurahan?.trim() ? `Kel. ${c.desaKelurahan.trim()}` : "",
    c.kecamatan?.trim() ? `Kec. ${c.kecamatan.trim()}` : "",
    c.patokan?.trim() ? `(Patokan: ${c.patokan.trim()})` : "",
  ].filter(Boolean);

  if (base && extraParts.length > 0) {
    return `${base}, ${extraParts.join(", ")}`;
  }
  return base || extraParts.join(", ");
}

const optionalAmount = z
  .string()
  .optional()
  .refine((value) => !value || /^\d+$/.test(value), "Gunakan angka tanpa tanda baca");

const schema = z.object({
  serviceId: z.string().min(1, "Pilih layanan"),
  serviceMethod: z.enum(["Antar Jemput", "Datang Langsung"]),
  samsatOriginId: z.string().min(1, "Pilih wilayah Samsat asal"),
  samsatDestinationId: z.string().optional(),
  vehicleType: z.string().min(1, "Pilih jenis kendaraan"),
  ownershipType: z.string().min(1, "Pilih jenis kepemilikan"),
  vehicleYear: z.string().regex(/^\d{4}$/, "Masukkan tahun 4 digit"),
  plateNumber: z
    .string()
    .min(4, "Nomor polisi tidak valid")
    .regex(/^[A-Za-z]{1,2}\s?[0-9]{1,4}\s?[A-Za-z]{1,3}$/, "Format nopol contoh: B 1234 XYZ"),
  taxDueDate: z.string().min(1, "Isi masa berlaku pajak"),
  pkbAmount: optionalAmount,
  swdklljAmount: optionalAmount,
  ownerName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(9, "Nomor telepon tidak valid"),
  pickupCity: z.string().min(2, "Isi domisili pengambilan"),
  returnCity: z.string().min(2, "Isi domisili pengembalian"),
  pickupAddress: z.string().min(10, "Alamat terlalu singkat"),
  returnAddress: z.string().min(10, "Alamat terlalu singkat"),
  lossChronology: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
const inputClass = "order-field";

export function ServicesPage() {
  const [params] = useSearchParams();
  const { isAuthenticated, customer } = useAuth();
  const customerProfileQuery = useCustomerProfile();
  const activeCustomer = isAuthenticated ? (customerProfileQuery.data ?? customer) : null;
  const { data: services, isLoading } = useServices();
  const { data: samsatOffices } = useSamsatOffices();
  const createOrder = useCreateOrder();
  const [createdOrder, setCreatedOrder] = useState<{ id: string; plateNumber: string }>();
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: params.get("serviceId") ?? "",
      serviceMethod: "Antar Jemput",
      samsatOriginId: "",
      samsatDestinationId: "",
      vehicleType: "",
      ownershipType: activeCustomer
        ? activeCustomer.customerType === "PERUSAHAAN_PT"
          ? "Perusahaan"
          : "Pribadi"
        : "",
      ownerName: activeCustomer?.fullName ?? "",
      phone: activeCustomer?.phone ?? "",
      pickupCity: activeCustomer?.kotaKabupaten ?? "",
      returnCity: activeCustomer?.kotaKabupaten ?? "",
      pickupAddress: activeCustomer ? formatCustomerFullAddress(activeCustomer) : "",
      returnAddress: activeCustomer ? formatCustomerFullAddress(activeCustomer) : "",
    },
  });

  useEffect(() => {
    const id = params.get("serviceId");
    if (id) setValue("serviceId", id);
  }, [params, setValue]);

  useEffect(() => {
    if (activeCustomer) {
      if (activeCustomer.fullName && !watch("ownerName")) {
        setValue("ownerName", activeCustomer.fullName);
      }
      if (activeCustomer.phone && !watch("phone")) {
        setValue("phone", activeCustomer.phone);
      }
      if (!watch("ownershipType")) {
        setValue(
          "ownershipType",
          activeCustomer.customerType === "PERUSAHAAN_PT" ? "Perusahaan" : "Pribadi",
        );
      }
      if (activeCustomer.kotaKabupaten) {
        setValue("pickupCity", activeCustomer.kotaKabupaten);
        setValue("returnCity", activeCustomer.kotaKabupaten);
      }
      const composedAddress = formatCustomerFullAddress(activeCustomer);
      if (composedAddress.length >= 10) {
        setValue("pickupAddress", composedAddress);
        setValue("returnAddress", composedAddress);
      }
    }
  }, [activeCustomer, setValue, watch]);

  useEffect(() => {
    if (samsatOffices?.length && !watch("samsatOriginId")) {
      setValue("samsatOriginId", samsatOffices[0].samsatId);
      if (!watch("pickupCity") && !activeCustomer?.kotaKabupaten) {
        setValue("pickupCity", samsatOffices[0].wilayah);
        setValue("returnCity", samsatOffices[0].wilayah);
      }
    }
  }, [samsatOffices, activeCustomer?.kotaKabupaten, setValue, watch]);

  const selectedId = watch("serviceId");
  const selectedSamsatOriginId = watch("samsatOriginId");
  const selectedServiceMethod = watch("serviceMethod");
  const pkbAmountStr = watch("pkbAmount");
  const swdklljAmountStr = watch("swdklljAmount");

  const selected = useMemo(
    () => services?.find((service) => service.id === selectedId),
    [services, selectedId],
  );
  const isMutation =
    Boolean(selected?.requiresDestinationSamsat) || selected?.category === "MUTASI";
  const isDuplicate = selected?.code === "DUPLIKAT_STNK";
  const needsPhysicalCheck = selected?.code === "PERP_5THN";

  const { data: pricingEstimate } = usePricingEstimate(
    selectedId || undefined,
    selectedSamsatOriginId || undefined,
    selectedServiceMethod,
  );

  const pkbVal = Number(pkbAmountStr || 0);
  const swdklljVal = Number(swdklljAmountStr || 0);
  const jasaVal = pricingEstimate?.estimasiBiayaJasa ?? 0;
  const kurirVal = pricingEstimate?.estimasiBiayaAntarJemput ?? 0;
  const totalEstimasi = jasaVal + kurirVal + (isNaN(pkbVal) ? 0 : pkbVal) + (isNaN(swdklljVal) ? 0 : swdklljVal);

  const onSubmit = (data: FormData) => {
    if (isMutation && !data.samsatDestinationId) {
      setError("samsatDestinationId", {
        type: "manual",
        message: "Pilih wilayah Samsat tujuan untuk layanan mutasi",
      });
      return;
    }

    const originOffice = samsatOffices?.find((o) => o.samsatId === data.samsatOriginId);
    const destOffice = samsatOffices?.find((o) => o.samsatId === data.samsatDestinationId);
    const profileComposedAddress = activeCustomer ? formatCustomerFullAddress(activeCustomer) : "";
    const usesProfilePickup = Boolean(
      activeCustomer &&
        profileComposedAddress &&
        data.pickupAddress.trim() === profileComposedAddress.trim(),
    );
    const usesProfileReturn = Boolean(
      activeCustomer &&
        profileComposedAddress &&
        data.returnAddress.trim() === profileComposedAddress.trim(),
    );

    createOrder.mutate(
      {
        ...data,
        customerId: activeCustomer?.id ?? "cust-001",
        samsatOrigin: originOffice?.wilayah ?? data.pickupCity,
        samsatDestination: destOffice?.wilayah,
        ...(usesProfilePickup && activeCustomer
          ? {
              pickupDistrict: activeCustomer.kecamatan || undefined,
              pickupVillage: activeCustomer.desaKelurahan || undefined,
              pickupRtRw: activeCustomer.rtRw || undefined,
              pickupHouseNo: activeCustomer.noRumah || undefined,
              pickupLandmark: activeCustomer.patokan || undefined,
              pickupMapsUrl: activeCustomer.linkGoogleMaps || undefined,
            }
          : {}),
        ...(usesProfileReturn && activeCustomer
          ? {
              returnDistrict: activeCustomer.kecamatan || undefined,
              returnVillage: activeCustomer.desaKelurahan || undefined,
              returnRtRw: activeCustomer.rtRw || undefined,
              returnHouseNo: activeCustomer.noRumah || undefined,
              returnLandmark: activeCustomer.patokan || undefined,
              returnMapsUrl: activeCustomer.linkGoogleMaps || undefined,
            }
          : {}),
        files,
      },
      {
        onSuccess: (order) => {
          setCreatedOrder({ id: order.id, plateNumber: order.plateNumber });
          setFiles([]);
        },
      },
    );
  };

  return (
    <section className="bg-[radial-gradient(circle_at_12%_20%,#e6f3ff_0,transparent_28%),radial-gradient(circle_at_88%_74%,#f2eaff_0,transparent_24%),#f7f9fc] py-8 md:py-12">
      <div className="container-page">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(310px,0.92fr)]">
          <form id="service-order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <OrderPanel
              title="Layanan Informasi"
              description="Silakan pilih jenis layanan, metode penyerahan berkas, dan wilayah Samsat kendaraan Anda."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  Pilih Layanan
                  <select className={inputClass} {...register("serviceId")} disabled={isLoading}>
                    <option value="">Pilih layanan kendaraan</option>
                    {services?.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <Error text={errors.serviceId?.message} />
                </label>

                <label>
                  Metode Layanan Berkas
                  <select className={inputClass} {...register("serviceMethod")}>
                    <option value="Antar Jemput">Antar Jemput Kurir SUN 89</option>
                    <option value="Datang Langsung">Datang Langsung ke Kantor</option>
                  </select>
                </label>
              </div>

              {selected && (
                <div className="mt-5 rounded-lg border border-[#e7ebf0] bg-[#fafbfd] p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-[#172b45]">{selected.name}</p>
                    <span className="text-[10px] font-bold tracking-[0.12em] text-[#2563eb]">
                      {selected.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#667085]">{selected.description}</p>
                  <details className="mt-3 text-xs text-[#475467]">
                    <summary className="font-semibold text-[#2563eb]">
                      Lihat {selected.requirements.length} persyaratan dokumen
                    </summary>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {selected.requirements.map((requirement) => (
                        <li key={requirement} className="flex gap-2 leading-5">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-[#2563eb]" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </OrderPanel>

            <OrderPanel
              title="Data Kendaraan & Wilayah Samsat"
              description="Lengkapi data kendaraan dan kantor Samsat terdaftar agar estimasi dan proses akurat."
            >
              <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                <label>
                  Jenis Kendaraan
                  <select className={inputClass} {...register("vehicleType")}>
                    <option value="">Pilih jenis</option>
                    <option value="Mobil">Mobil</option>
                    <option value="Motor">Motor</option>
                  </select>
                  <Error text={errors.vehicleType?.message} />
                </label>
                <label>
                  Kepemilikan Kendaraan
                  <select className={inputClass} {...register("ownershipType")}>
                    <option value="">Pilih kepemilikan</option>
                    <option value="Pribadi">Pribadi</option>
                    <option value="Perusahaan">Perusahaan</option>
                  </select>
                  <Error text={errors.ownershipType?.message} />
                </label>
                <label>
                  Tahun Kendaraan
                  <input className={inputClass} placeholder="2023" {...register("vehicleYear")} />
                  <Error text={errors.vehicleYear?.message} />
                </label>
                <label>
                  Nomor Polisi
                  <input
                    className={inputClass}
                    placeholder="B 1234 XYZ"
                    {...register("plateNumber")}
                  />
                  <Error text={errors.plateNumber?.message} />
                </label>
                <label>
                  Wilayah Samsat Asal
                  <select className={inputClass} {...register("samsatOriginId")}>
                    <option value="">Pilih Samsat Asal</option>
                    {samsatOffices?.map((office) => (
                      <option key={office.samsatId} value={office.samsatId}>
                        {office.namaSamsat} ({office.wilayah})
                      </option>
                    ))}
                  </select>
                  <Error text={errors.samsatOriginId?.message} />
                </label>
                <label>
                  PKB Berlaku Sampai
                  <input type="date" className={inputClass} {...register("taxDueDate")} />
                  <Error text={errors.taxDueDate?.message} />
                </label>
                <label>
                  Nominal PKB Terakhir (Opsional)
                  <input
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="Contoh: 2500000"
                    {...register("pkbAmount")}
                  />
                  <Error text={errors.pkbAmount?.message} />
                </label>
                <label>
                  Nominal SWDKLLJ (Opsional)
                  <input
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="Contoh: 143000"
                    {...register("swdklljAmount")}
                  />
                  <Error text={errors.swdklljAmount?.message} />
                </label>

                {isMutation && (
                  <label>
                    Wilayah Samsat Tujuan
                    <select className={inputClass} {...register("samsatDestinationId")}>
                      <option value="">Pilih Samsat Tujuan</option>
                      {samsatOffices?.map((office) => (
                        <option key={office.samsatId} value={office.samsatId}>
                          {office.namaSamsat} ({office.wilayah})
                        </option>
                      ))}
                    </select>
                    <Error text={errors.samsatDestinationId?.message} />
                  </label>
                )}
              </div>

              {isDuplicate && (
                <div className="mt-5">
                  <label>
                    Kronologi Kehilangan Dokumen
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      {...register("lossChronology")}
                      placeholder="Ceritakan secara singkat kronologi kehilangan dokumen"
                    />
                  </label>
                </div>
              )}

              {(isMutation || needsPhysicalCheck || isDuplicate) && (
                <WarningNotice>
                  {isMutation &&
                    "Pastikan wilayah Samsat asal dan tujuan sesuai dengan dokumen kendaraan. Kesalahan pemilihan dapat menghambat proses."}
                  {needsPhysicalCheck &&
                    "Layanan perpanjangan 5 tahun memerlukan cek fisik kendaraan. Jadwal dan lokasi akan dikonfirmasi oleh tim."}
                  {isDuplicate &&
                    "Siapkan surat keterangan kehilangan dari kepolisian dan informasi kronologi dokumen untuk proses verifikasi."}
                </WarningNotice>
              )}
            </OrderPanel>

            <OrderPanel
              title="Data Pengiriman, Kontak & Dokumen"
              description="Mohon isi alamat lengkap untuk pengambilan dan pengembalian berkas, nomor WhatsApp, serta lampirkan foto dokumen pendukung jika ada."
            >
              <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                <label>
                  Nama Pemilik Kendaraan (sesuai STNK)
                  <input
                    className={inputClass}
                    {...register("ownerName")}
                    placeholder="Nama lengkap sesuai STNK"
                  />
                  <Error text={errors.ownerName?.message} />
                </label>
                <label>
                  Nomor WhatsApp (untuk konfirmasi & komunikasi)
                  <input
                    className={inputClass}
                    {...register("phone")}
                    placeholder="081219801888"
                  />
                  <Error text={errors.phone?.message} />
                </label>
                <label>
                  Domisili Pengambilan Berkas
                  <input
                    className={inputClass}
                    {...register("pickupCity")}
                    placeholder="Kota/Kabupaten"
                  />
                  <Error text={errors.pickupCity?.message} />
                </label>
                <label>
                  Domisili Pengembalian Berkas
                  <input
                    className={inputClass}
                    {...register("returnCity")}
                    placeholder="Kota/Kabupaten"
                  />
                  <Error text={errors.returnCity?.message} />
                </label>
                <label>
                  Detail Alamat Pengambilan Berkas
                  <textarea
                    className={`${inputClass} min-h-20 resize-y`}
                    {...register("pickupAddress")}
                    placeholder="Jalan, RT/RW, nomor rumah"
                  />
                  <Error text={errors.pickupAddress?.message} />
                </label>
                <label>
                  Detail Alamat Pengembalian Berkas
                  <textarea
                    className={`${inputClass} min-h-20 resize-y`}
                    {...register("returnAddress")}
                    placeholder="Jalan, RT/RW, nomor rumah"
                  />
                  <Error text={errors.returnAddress?.message} />
                </label>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#344054]">
                    Unggah Foto/Scan Dokumen Persyaratan (Opsional, maks. 5 berkas JPG/PNG/PDF)
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="mt-2 block w-full cursor-pointer rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs text-[#475467] file:mr-3 file:rounded-md file:border-0 file:bg-[#2563eb] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                      onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files || []).slice(0, 5);
                        setFiles(selectedFiles);
                      }}
                    />
                  </label>
                  {files.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {files.map((f, idx) => (
                        <span
                          key={`${f.name}-${idx}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#2563eb]"
                        >
                          <Paperclip size={13} />
                          {f.name}
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                            aria-label="Hapus berkas"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </OrderPanel>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-xl bg-[#2563eb] p-5 text-white shadow-[0_9px_18px_rgba(37,99,235,.22)] md:p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
                  <FileCheck2 size={21} />
                </span>
                <div>
                  <h2 className="font-heading text-base font-bold leading-6">
                    {selected ? selected.name : "Urus dokumen kendaraan tanpa ribet"}
                  </h2>
                  <p className="mt-2 text-sm leading-5 text-blue-50/90">
                    {selected
                      ? selected.description
                      : "Pilih layanan dan lengkapi formulir untuk memulai proses pengurusan dokumen kendaraan Anda."}
                  </p>
                  {selected && (
                    <p className="mt-3 text-xs font-semibold text-white/80">
                      {selected.requirements.length} persyaratan dokumen perlu disiapkan
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#e1e6ed] bg-white p-5 shadow-[0_4px_18px_rgba(23,55,94,.04)] md:p-6">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="size-5 text-[#2563eb]" />
                <h2 className="font-heading text-lg font-bold">Estimasi Biaya</h2>
              </div>
              <CostGroup
                title="Layanan Jasa"
                rows={[
                  {
                    label: "Biaya jasa pengurusan",
                    value: jasaVal > 0 ? `Rp ${jasaVal.toLocaleString("id-ID")}` : "Pilih layanan",
                  },
                  {
                    label: `Biaya kurir (${selectedServiceMethod})`,
                    value:
                      selectedServiceMethod === "Datang Langsung"
                        ? "Rp 0"
                        : kurirVal > 0
                          ? `Rp ${kurirVal.toLocaleString("id-ID")}`
                          : "Pilih layanan",
                  },
                ]}
              />
              <CostGroup
                title="Biaya Resmi Samsat"
                rows={[
                  {
                    label: "Biaya PKB",
                    value:
                      pkbVal > 0 ? `Rp ${pkbVal.toLocaleString("id-ID")}` : "Sesuai notice pajak",
                  },
                  {
                    label: "Biaya SWDKLLJ",
                    value:
                      swdklljVal > 0
                        ? `Rp ${swdklljVal.toLocaleString("id-ID")}`
                        : "Sesuai notice pajak",
                  },
                  { label: "Denda (jika ada)", value: "Menunggu verifikasi" },
                ]}
              />
              <div className="mt-5 flex items-center justify-between border-t border-[#e8ecf1] pt-5">
                <span className="font-semibold">Total Estimasi Awal</span>
                <span className="text-sm font-bold text-[#2563eb]">
                  {totalEstimasi > 0
                    ? `Rp ${totalEstimasi.toLocaleString("id-ID")}`
                    : "Menunggu verifikasi"}
                </span>
              </div>
              <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#667085]">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                {pricingEstimate?.catatan ??
                  "Estimasi akan dikonfirmasi ulang setelah kelengkapan dokumen dan data kendaraan diverifikasi."}
              </p>
            </section>

            <section className="rounded-xl border border-[#e1e6ed] bg-white p-5 shadow-[0_4px_18px_rgba(23,55,94,.04)] md:p-6">
              <h2 className="font-heading text-lg font-bold">Siap Mengajukan?</h2>
              <p className="mt-2 text-sm leading-5 text-[#667085]">
                Pastikan semua data sudah benar sebelum submit formulir.
              </p>
              {createOrder.isError && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                  <span>
                    {(createOrder.error as any)?.message ||
                      "Gagal mengirim pesanan. Periksa kembali isian formulir Anda."}
                  </span>
                </div>
              )}
              <button
                form="service-order-form"
                className="btn-primary mt-5 w-full"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Mengirim formulir..." : "Submit Formulir"}
              </button>
              <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#667085]">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                Biaya akhir akan dikonfirmasi oleh admin setelah verifikasi dokumen.
              </p>
            </section>
          </aside>
        </div>

        {createdOrder && (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-[#102A49]/70 p-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
              <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
              <h2 className="mt-5 font-heading text-2xl font-bold">Pesanan berhasil dibuat</h2>
              <p className="mt-3 text-sm text-[#667085]">
                Simpan ID pesanan atau Nomor Polisi berikut untuk memantau status dokumen Anda.
              </p>
              <div className="mt-5 rounded-lg bg-[#F2F6FA] p-4">
                <strong className="block font-heading text-xl text-[#17375E]">
                  {createdOrder.id}
                </strong>
                <span className="mt-1 block text-xs font-semibold text-[#667085]">
                  Nomor Polisi: {createdOrder.plateNumber}
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to={`/tracking?q=${encodeURIComponent(createdOrder.id)}`}
                  className="btn-primary flex-1"
                >
                  Lacak Pesanan
                </Link>
                <button
                  onClick={() => setCreatedOrder(undefined)}
                  className="btn-outline flex-1"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function OrderPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#e1e6ed] bg-white p-5 shadow-[0_4px_18px_rgba(23,55,94,.035)] md:p-6">
      <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-[#172b45]">{title}</h2>
      <p className="mt-1.5 text-xs leading-5 text-[#667085]">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CostGroup({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="mt-6 border-b border-[#e8ecf1] pb-5">
      <p className="mb-3 text-[11px] font-medium text-[#98a2b3]">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#475467]">{row.label}</span>
            <span className="text-xs font-semibold text-[#172b45]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Error({ text }: { text?: string }) {
  return text ? <span className="mt-1 block text-xs text-red-600">{text}</span> : null;
}

function WarningNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
      <p className="text-xs leading-5">
        <strong>Perhatian:</strong> {children}
      </p>
    </div>
  );
}
