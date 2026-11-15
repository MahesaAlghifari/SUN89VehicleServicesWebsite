import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  Info,
  Lightbulb,
} from "lucide-react";
import { useCreateOrder, useServices } from "../../hooks/useData";

const optionalAmount = z
  .string()
  .optional()
  .refine((value) => !value || /^\d+$/.test(value), "Gunakan angka tanpa tanda baca");

const schema = z.object({
  serviceId: z.string().min(1, "Pilih layanan"),
  vehicleType: z.string().min(1, "Pilih jenis kendaraan"),
  ownershipType: z.string().min(1, "Pilih jenis kepemilikan"),
  vehicleYear: z.string().regex(/^\d{4}$/, "Masukkan tahun 4 digit"),
  plateNumber: z.string().min(4, "Nomor polisi tidak valid"),
  taxDueDate: z.string().min(1, "Isi masa berlaku pajak"),
  pkbAmount: optionalAmount,
  swdklljAmount: optionalAmount,
  ownerName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(9, "Nomor telepon tidak valid"),
  pickupCity: z.string().min(2, "Isi domisili pengambilan"),
  returnCity: z.string().min(2, "Isi domisili pengembalian"),
  pickupAddress: z.string().min(10, "Alamat terlalu singkat"),
  returnAddress: z.string().min(10, "Alamat terlalu singkat"),
  samsatOrigin: z.string().optional(),
  samsatDestination: z.string().optional(),
  lossChronology: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
const inputClass = "order-field";

export function ServicesPage() {
  const [params] = useSearchParams();
  const { data: services, isLoading } = useServices();
  const createOrder = useCreateOrder();
  const [createdId, setCreatedId] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceId: params.get("serviceId") ?? "",
      vehicleType: "",
      ownershipType: "",
      pickupCity: "",
      returnCity: "",
      returnAddress: "",
    },
  });

  useEffect(() => {
    const id = params.get("serviceId");
    if (id) setValue("serviceId", id);
  }, [params, setValue]);

  const selectedId = watch("serviceId");
  const selected = useMemo(
    () => services?.find((service) => service.id === selectedId),
    [services, selectedId],
  );
  const isMutation = selected?.category === "MUTASI";
  const isDuplicate = selected?.code === "DUPLIKAT_STNK";
  const needsPhysicalCheck = selected?.code === "PERP_5THN";

  const onSubmit = (data: FormData) =>
    createOrder.mutate(
      { ...data, customerId: "cust-001" },
      { onSuccess: (order) => setCreatedId(order.id) },
    );

  return (
    <section className="bg-[radial-gradient(circle_at_12%_20%,#e6f3ff_0,transparent_28%),radial-gradient(circle_at_88%_74%,#f2eaff_0,transparent_24%),#f7f9fc] py-8 md:py-12">
      <div className="container-page">
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.9fr)_minmax(310px,0.92fr)]">
          <form id="service-order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <OrderPanel
              title="Layanan Informasi"
              description="Silakan pilih jenis layanan dan informasi dasar kendaraan Anda untuk memulai proses pemesanan."
            >
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
              title="Data Kendaraan"
              description="Lengkapi data kendaraan Anda dengan benar agar proses dapat berjalan lancar."
            >
              <div className="grid gap-x-4 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                <label>
                  Jenis Kendaraan
                  <select className={inputClass} {...register("vehicleType")}>
                    <option value="">Pilih jenis</option>
                    <option>Mobil</option>
                    <option>Motor</option>
                  </select>
                  <Error text={errors.vehicleType?.message} />
                </label>
                <label>
                  Kepemilikan Kendaraan
                  <select className={inputClass} {...register("ownershipType")}>
                    <option value="">Pilih kepemilikan</option>
                    <option>Pribadi</option>
                    <option>Perusahaan</option>
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
                  PKB Berlaku Sampai
                  <input type="date" className={inputClass} {...register("taxDueDate")} />
                  <Error text={errors.taxDueDate?.message} />
                </label>
                <label>
                  Nominal PKB Terakhir
                  <input
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="Masukkan nominal"
                    {...register("pkbAmount")}
                  />
                  <Error text={errors.pkbAmount?.message} />
                </label>
                <label>
                  Nominal SWDKLLJ
                  <input
                    inputMode="numeric"
                    className={inputClass}
                    placeholder="Masukkan nominal"
                    {...register("swdklljAmount")}
                  />
                  <Error text={errors.swdklljAmount?.message} />
                </label>

                {isMutation && (
                  <>
                    <label>
                      Domisili Samsat Asal
                      <input
                        className={inputClass}
                        {...register("samsatOrigin")}
                        placeholder="Kota/Kabupaten"
                      />
                    </label>
                    <label>
                      Domisili Samsat Tujuan
                      <input
                        className={inputClass}
                        {...register("samsatDestination")}
                        placeholder="Kota/Kabupaten"
                      />
                    </label>
                  </>
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
              title="Data Pengiriman & Kontak"
              description="Mohon isi alamat lengkap untuk pengambilan dan pengembalian berkas, serta nomor HP."
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
                  Nomor HP (untuk konfirmasi & komunikasi)
                  <input
                    className={inputClass}
                    {...register("phone")}
                    placeholder="+62 812 0000 0089"
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
              <CostGroup title="Layanan Jasa" rows={["Biaya jasa"]} />
              <CostGroup
                title="Biaya Resmi"
                rows={["Biaya PKB", "Biaya SWDKLLJ", "Denda (jika ada)"]}
              />
              <div className="mt-5 flex items-center justify-between border-t border-[#e8ecf1] pt-5">
                <span className="font-semibold">Total Estimasi</span>
                <span className="text-sm font-semibold text-[#2563eb]">Menunggu verifikasi</span>
              </div>
              <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#667085]">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                Estimasi akan diberikan setelah kelengkapan dokumen dan data kendaraan diverifikasi.
              </p>
            </section>

            <section className="rounded-xl border border-[#e1e6ed] bg-white p-5 shadow-[0_4px_18px_rgba(23,55,94,.04)] md:p-6">
              <h2 className="font-heading text-lg font-bold">Siap Mengajukan?</h2>
              <p className="mt-2 text-sm leading-5 text-[#667085]">
                Pastikan semua data sudah benar sebelum submit formulir.
              </p>
              <button
                form="service-order-form"
                className="btn-primary mt-5 w-full"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Mengirim formulir..." : "Submit Formulir"}
              </button>
              <p className="mt-4 flex gap-2 text-[11px] leading-4 text-[#667085]">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                Biaya akan dikonfirmasi setelah verifikasi dokumen.
              </p>
            </section>
          </aside>
        </div>

        {createdId && (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-[#102A49]/70 p-5">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
              <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
              <h2 className="mt-5 font-heading text-2xl font-bold">Pesanan berhasil dibuat</h2>
              <p className="mt-3 text-sm text-[#667085]">
                Simpan ID pesanan berikut untuk memantau status dokumen Anda.
              </p>
              <strong className="mt-5 block rounded-lg bg-[#F2F6FA] p-4 font-heading text-xl text-[#17375E]">
                {createdId}
              </strong>
              <button onClick={() => setCreatedId(undefined)} className="btn-primary mt-6 w-full">
                Selesai
              </button>
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

function CostGroup({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="mt-6 border-b border-[#e8ecf1] pb-5">
      <p className="mb-3 text-[11px] font-medium text-[#98a2b3]">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-[#475467]">{row}</span>
            <span className="text-xs font-medium text-[#667085]">Menunggu verifikasi</span>
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
