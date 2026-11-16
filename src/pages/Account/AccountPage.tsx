import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  History,
  Info,
  MapPin,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router";
import {
  useCustomerProfile,
  useOrders,
  useServices,
  useUpdateCustomer,
  useWilayah,
} from "../../hooks/useData";
import type { Customer, Order } from "../../types";

const profileSchema = z.object({
  id: z.string(),
  accountId: z.string().optional(),
  customerType: z.enum(["PERORANGAN", "PERUSAHAAN_PT"]),
  fullName: z.string().trim().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.email("Format email tidak valid"),
  phone: z.string().trim().min(9, "Nomor WhatsApp minimal 9 digit"),
  provinsi: z.string().trim(),
  kotaKabupaten: z.string().trim(),
  kecamatan: z.string().trim(),
  desaKelurahan: z.string().trim(),
  rtRw: z.string().trim(),
  noRumah: z.string().trim(),
  patokan: z.string().trim(),
  detailAlamat: z.string().trim(),
  linkGoogleMaps: z
    .string()
    .trim()
    .refine((val) => {
      if (!val) return true;
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Gunakan URL valid yang dimulai dengan http:// atau https://"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [selected, setSelected] = useState<Order>();
  const profile = useCustomerProfile();
  const orders = useOrders(profile.data?.id);
  const services = useServices();
  const wilayah = useWilayah();
  const update = useUpdateCustomer();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      id: "",
      customerType: "PERORANGAN",
      fullName: "",
      email: "",
      phone: "",
      provinsi: "",
      kotaKabupaten: "",
      kecamatan: "",
      desaKelurahan: "",
      rtRw: "",
      noRumah: "",
      patokan: "",
      detailAlamat: "",
      linkGoogleMaps: "",
    },
  });

  useEffect(() => {
    if (profile.data) {
      reset({
        id: profile.data.id,
        accountId: profile.data.accountId,
        customerType: profile.data.customerType || "PERORANGAN",
        fullName: profile.data.fullName || "",
        email: profile.data.email || "",
        phone: profile.data.phone || "",
        provinsi: profile.data.provinsi || "",
        kotaKabupaten: profile.data.kotaKabupaten || "",
        kecamatan: profile.data.kecamatan || "",
        desaKelurahan: profile.data.desaKelurahan || "",
        rtRw: profile.data.rtRw || "",
        noRumah: profile.data.noRumah || "",
        patokan: profile.data.patokan || "",
        detailAlamat: profile.data.detailAlamat || profile.data.address || "",
        linkGoogleMaps: profile.data.linkGoogleMaps || "",
      });
    }
  }, [profile.data, wilayah.data, reset]);

  const customerType = watch("customerType");
  const selectedProvinsi = watch("provinsi");
  const selectedKota = watch("kotaKabupaten");
  const mapsUrl = watch("linkGoogleMaps");

  const provinces = wilayah.data?.provinces ?? [];
  const filteredRegencies = useMemo(() => {
    const all = wilayah.data?.regencies ?? [];
    if (!selectedProvinsi) return all;
    return all.filter(
      (r) => r.namaProvinsi.toLowerCase() === selectedProvinsi.trim().toLowerCase(),
    );
  }, [wilayah.data?.regencies, selectedProvinsi]);

  const isAddressIncomplete = Boolean(
    profile.data &&
      (!profile.data.provinsi || !profile.data.kotaKabupaten || !profile.data.detailAlamat),
  );

  const hasValidMapsPreview = useMemo(() => {
    if (!mapsUrl?.trim()) return false;
    try {
      const u = new URL(mapsUrl.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, [mapsUrl]);

  return (
    <section className="min-h-[70vh] bg-[#F2F6FA] py-10 md:py-16">
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">AKUN SAYA</p>
            <h1 className="font-heading text-4xl font-bold">
              Halo, {profile.data?.fullName?.split(" ")[0] ?? "Pelanggan"}
            </h1>
            <p className="mt-2 text-[#667085]">
              Kelola profil, alamat penjemputan dokumen, dan riwayat pesanan Anda di satu tempat.
            </p>
          </div>
          {profile.data?.id && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D9E0E8] bg-white px-4 py-1.5 text-xs font-semibold text-[#17375E]">
              <span>ID Pelanggan:</span>
              <span className="font-mono text-[#2563EB]">{profile.data.id}</span>
            </div>
          )}
        </div>
        <div className="mb-6 flex w-fit gap-1 rounded-xl border border-[#E5EAF0] bg-white p-1">
          {(
            [
              ["profile", UserRound, "Profil"],
              ["orders", History, "Riwayat Pesanan"],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                tab === id ? "bg-[#17375E] text-white" : "text-[#667085]"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
        {tab === "profile" && (
          <div className="card max-w-4xl p-6 md:p-8">
            <div className="flex flex-col gap-1 border-b border-[#E5EAF0] pb-4">
              <h2 className="font-heading text-xl font-bold">Informasi Profil & Alamat Pelanggan</h2>
              <p className="text-sm text-[#667085]">
                Data profil dan alamat ini digunakan otomatis saat Anda membuat pesanan layanan.
              </p>
            </div>

            {isAddressIncomplete && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-[#17375E]">
                <Info className="mt-0.5 size-5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-semibold">Alamat penjemputan Anda belum lengkap</p>
                  <p className="mt-0.5 text-xs leading-5 text-[#475467]">
                    Lengkapi Provinsi, Kota/Kabupaten, dan Detail Alamat di bawah ini agar kurir SUN
                    89 mudah menjemput & mengantar berkas serta form pemesanan otomatis terisi.
                  </p>
                </div>
              </div>
            )}

            {profile.isLoading ? (
              <p className="mt-6 text-sm text-[#667085]">Memuat profil...</p>
            ) : (
              <form
                className="mt-6 space-y-8"
                onSubmit={handleSubmit((data) =>
                  update.mutate({
                    ...(data as Customer),
                    address: data.detailAlamat,
                  }),
                )}
              >
                <input type="hidden" {...register("id")} />

                {update.isError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                    <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                    <span>
                      {(update.error as Error)?.message ||
                        "Gagal memperbarui profil. Periksa kembali data Anda."}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#667085] uppercase">
                    <UserRound size={15} className="text-[#2563EB]" />
                    Identitas & Kontak
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <label>
                      Tipe Pelanggan
                      <select className="field" {...register("customerType")}>
                        <option value="PERORANGAN">Perorangan / Pribadi</option>
                        <option value="PERUSAHAAN_PT">Perusahaan / PT / Badan Usaha</option>
                      </select>
                    </label>
                    <label>
                      {customerType === "PERUSAHAAN_PT" ? "Nama Perusahaan / PIC" : "Nama Lengkap"}
                      <input
                        className="field"
                        placeholder={
                          customerType === "PERUSAHAAN_PT"
                            ? "Contoh: PT Mitra Graha Sentosa"
                            : "Nama lengkap sesuai KTP/STNK"
                        }
                        {...register("fullName")}
                      />
                      <FieldError text={errors.fullName?.message} />
                    </label>
                    <label>
                      Email
                      <input
                        className="field"
                        type="email"
                        placeholder="nama@email.com"
                        {...register("email")}
                      />
                      <FieldError text={errors.email?.message} />
                    </label>
                    <label>
                      Nomor WhatsApp
                      <input
                        className="field"
                        placeholder="081234567890"
                        {...register("phone")}
                      />
                      <FieldError text={errors.phone?.message} />
                    </label>
                  </div>
                </div>

                <div className="border-t border-[#E5EAF0] pt-6">
                  <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#667085] uppercase">
                    <MapPin size={15} className="text-[#2563EB]" />
                    Alamat Lengkap Domisili / Pengantaran
                  </h3>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <label>
                      Provinsi
                      {provinces.length > 0 ? (
                        <select
                          className="field"
                          {...register("provinsi", {
                            onChange: (e) => {
                              const nextProv = e.target.value;
                              const matchesCurrent = (wilayah.data?.regencies ?? []).some(
                                (r) =>
                                  r.namaProvinsi.toLowerCase() === nextProv.toLowerCase() &&
                                  r.namaKabKota.toLowerCase() === selectedKota.toLowerCase(),
                              );
                              if (!matchesCurrent) {
                                setValue("kotaKabupaten", "");
                              }
                            },
                          })}
                        >
                          <option value="">Pilih Provinsi</option>
                          {selectedProvinsi &&
                            !provinces.some(
                              (p) => p.namaProvinsi.toLowerCase() === selectedProvinsi.toLowerCase(),
                            ) && <option value={selectedProvinsi}>{selectedProvinsi}</option>}
                          {provinces.map((p) => (
                            <option key={p.kodeProvinsi} value={p.namaProvinsi}>
                              {p.namaProvinsi}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="field"
                          placeholder="Contoh: DKI Jakarta / Jawa Barat"
                          {...register("provinsi")}
                        />
                      )}
                      <FieldError text={errors.provinsi?.message} />
                    </label>

                    <label>
                      Kota / Kabupaten
                      {filteredRegencies.length > 0 ? (
                        <select className="field" {...register("kotaKabupaten")}>
                          <option value="">
                            {selectedProvinsi
                              ? "Pilih Kota / Kabupaten"
                              : "Pilih Provinsi atau Kota / Kabupaten"}
                          </option>
                          {selectedKota &&
                            !filteredRegencies.some(
                              (r) => r.namaKabKota.toLowerCase() === selectedKota.toLowerCase(),
                            ) && <option value={selectedKota}>{selectedKota}</option>}
                          {filteredRegencies.map((r) => (
                            <option key={r.kodeKabKota} value={r.namaKabKota}>
                              {r.namaKabKota}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="field"
                          placeholder="Contoh: Kota Adm. Jakarta Selatan / Kab. Bogor"
                          {...register("kotaKabupaten")}
                        />
                      )}
                      <FieldError text={errors.kotaKabupaten?.message} />
                    </label>

                    <label>
                      Kecamatan
                      <input
                        className="field"
                        placeholder="Contoh: Cibinong / Tebet"
                        {...register("kecamatan")}
                      />
                    </label>

                    <label>
                      Desa / Kelurahan
                      <input
                        className="field"
                        placeholder="Contoh: Sukahati / Tebet Barat"
                        {...register("desaKelurahan")}
                      />
                    </label>

                    <label>
                      RT / RW
                      <input
                        className="field"
                        placeholder="Contoh: 001/002"
                        {...register("rtRw")}
                      />
                    </label>

                    <label>
                      Nomor Rumah / Gedung / Blok
                      <input
                        className="field"
                        placeholder="Contoh: No. 18B / Gedung Graha Lt. 3"
                        {...register("noRumah")}
                      />
                    </label>

                    <label className="md:col-span-2">
                      Patokan / Landmark
                      <input
                        className="field"
                        placeholder="Contoh: Dekat pintu barat Tebet Eco Park / seberang minimarket"
                        {...register("patokan")}
                      />
                    </label>

                    <label className="md:col-span-2">
                      Detail Alamat / Nama Jalan
                      <textarea
                        className="field min-h-24"
                        placeholder="Nama jalan, perumahan, blok, atau petunjuk tambahan untuk kurir"
                        {...register("detailAlamat")}
                      />
                      <FieldError text={errors.detailAlamat?.message} />
                    </label>

                    <label className="md:col-span-2">
                      <span className="flex items-center justify-between gap-2">
                        <span>Link Google Maps (Opsional)</span>
                        {hasValidMapsPreview && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                          >
                            Buka di Google Maps <ExternalLink size={13} />
                          </a>
                        )}
                      </span>
                      <input
                        className="field font-mono text-xs"
                        type="url"
                        placeholder="https://maps.google.com/?q=-6.2392,106.8524"
                        {...register("linkGoogleMaps")}
                      />
                      <FieldError text={errors.linkGoogleMaps?.message} />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-[#E5EAF0] pt-5">
                  <button className="btn-primary" disabled={update.isPending}>
                    {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  {update.isSuccess && (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                      <CheckCircle2 size={17} /> Profil tersimpan ke database
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
        {tab === "orders" && (
          <div className="card overflow-hidden">
            <div className="border-b border-[#E5EAF0] p-6">
              <h2 className="font-heading text-xl font-bold">Riwayat Pesanan</h2>
            </div>
            {orders.isLoading ? (
              <p className="p-8 text-[#667085]">Memuat pesanan...</p>
            ) : orders.data?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] text-left text-sm">
                  <thead className="bg-[#F8FAFC] text-xs text-[#667085]">
                    <tr>
                      {[
                        "ID Pesanan",
                        "Tanggal",
                        "Layanan",
                        "Nomor Polisi",
                        "Status",
                        "Total Biaya",
                        "",
                      ].map((h) => (
                        <th key={h} className="px-5 py-4 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.data.map((order) => (
                      <tr key={order.id} className="border-t border-[#E5EAF0]">
                        <td className="px-5 py-5 font-bold text-[#2563EB]">{order.id}</td>
                        <td className="px-5 py-5">
                          {new Date(order.orderDate).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-5 py-5 font-semibold">
                          {order.serviceName ||
                            services.data?.find((s) => s.id === order.serviceId)?.name ||
                            "-"}
                        </td>
                        <td className="px-5 py-5">{order.plateNumber}</td>
                        <td className="px-5 py-5">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          {order.totalCost
                            ? `Rp ${order.totalCost.toLocaleString("id-ID")}`
                            : "Menunggu estimasi"}
                        </td>
                        <td className="px-5 py-5">
                          <button onClick={() => setSelected(order)} aria-label="Lihat detail">
                            <ArrowUpRight size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center">
                <History className="mx-auto text-[#98A2B3]" />
                <p className="mt-3 text-[#667085]">Belum ada pesanan.</p>
              </div>
            )}
          </div>
        )}
        {selected && (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-[#102A49]/70 p-5">
            <div className="w-full max-w-lg rounded-2xl bg-white p-7">
              <div className="flex justify-between">
                <div>
                  <p className="eyebrow">DETAIL PESANAN</p>
                  <h2 className="font-heading text-2xl font-bold">{selected.id}</h2>
                </div>
                <button onClick={() => setSelected(undefined)}>
                  <X />
                </button>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
                <Detail
                  label="Layanan"
                  value={
                    selected.serviceName ||
                    services.data?.find((s) => s.id === selected.serviceId)?.name
                  }
                />
                <Detail label="Status" value={selected.status} />
                <Detail label="Kendaraan" value={selected.vehicleType} />
                <Detail label="Nomor Polisi" value={selected.plateNumber} />
                <Detail
                  label="Total"
                  value={
                    selected.totalCost
                      ? `Rp ${selected.totalCost.toLocaleString("id-ID")}`
                      : "Menunggu estimasi"
                  }
                />
                <Detail label="Pembayaran" value={selected.paymentStatus || "Belum Lunas"} />
              </dl>
              <Link
                to={`/tracking?q=${encodeURIComponent(selected.id)}`}
                className="btn-primary mt-7 w-full"
              >
                Lihat Tracking
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-[#667085]">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}

function FieldError({ text }: { text?: string }) {
  return text ? <span className="mt-1 block text-xs font-medium text-red-600">{text}</span> : null;
}
