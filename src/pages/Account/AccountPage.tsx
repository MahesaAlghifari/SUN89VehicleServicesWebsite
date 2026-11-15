import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowUpRight, CheckCircle2, History, UserRound, X } from "lucide-react";
import { Link } from "react-router";
import { useCustomerProfile, useOrders, useServices, useUpdateCustomer } from "../../hooks/useData";
import type { Customer, Order } from "../../types";

export function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [selected, setSelected] = useState<Order>();
  const profile = useCustomerProfile();
  const orders = useOrders(profile.data?.id);
  const services = useServices();
  const update = useUpdateCustomer();
  const { register, handleSubmit, reset } = useForm<Customer>();
  useEffect(() => {
    if (profile.data) reset(profile.data);
  }, [profile.data, reset]);
  return (
    <section className="min-h-[70vh] bg-[#F2F6FA] py-10 md:py-16">
      <div className="container-page">
        <div className="mb-8">
          <p className="eyebrow">AKUN SAYA</p>
          <h1 className="font-heading text-4xl font-bold">
            Halo, {profile.data?.fullName?.split(" ")[0] ?? "Pelanggan"}
          </h1>
          <p className="mt-2 text-[#667085]">
            Kelola profil dan lihat seluruh pesanan Anda di satu tempat.
          </p>
        </div>
        <div className="mb-6 flex w-fit gap-1 rounded-xl border border-[#E5EAF0] bg-white p-1">
          {[
            ["profile", UserRound, "Profil"],
            ["orders", History, "Riwayat Pesanan"],
          ].map(([id, Icon, label]) => (
            <button
              key={String(id)}
              onClick={() => setTab(id as typeof tab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === id ? "bg-[#17375E] text-white" : "text-[#667085]"}`}
            >
              <Icon size={17} />
              {String(label)}
            </button>
          ))}
        </div>
        {tab === "profile" && (
          <div className="card max-w-3xl p-6 md:p-8">
            <h2 className="font-heading text-xl font-bold">Informasi Profil</h2>
            {profile.isLoading ? (
              <p className="mt-6 text-sm text-[#667085]">Memuat profil...</p>
            ) : (
              <form
                className="mt-7 grid gap-5 md:grid-cols-2"
                onSubmit={handleSubmit((data) => update.mutate(data))}
              >
                <input type="hidden" {...register("id")} />
                <label>
                  Nama lengkap
                  <input className="field" {...register("fullName")} />
                </label>
                <label>
                  Email
                  <input className="field" {...register("email")} />
                </label>
                <label>
                  Nomor telepon
                  <input className="field" {...register("phone")} />
                </label>
                <label className="md:col-span-2">
                  Alamat
                  <textarea className="field min-h-24" {...register("address")} />
                </label>
                <div className="flex items-center gap-4 md:col-span-2">
                  <button className="btn-primary" disabled={update.isPending}>
                    {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                  {update.isSuccess && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle2 size={17} /> Tersimpan
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
                          {services.data?.find((s) => s.id === order.serviceId)?.name}
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
                  value={services.data?.find((s) => s.id === selected.serviceId)?.name}
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
              </dl>
              <Link to={`/tracking`} className="btn-primary mt-7 w-full">
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
