import { useState } from "react";
import { CalendarDays, Check, Circle, Clock3, PackageSearch, Search, Truck } from "lucide-react";
import { useOrderTracking, useServiceById } from "../../hooks/useData";

export function TrackingPage() {
  const [input, setInput] = useState("SUN-240891");
  const [orderId, setOrderId] = useState("SUN-240891");
  const { order, stages } = useOrderTracking(orderId);
  const service = useServiceById(order.data?.serviceId);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(input.trim());
  };
  return (
    <section className="min-h-[70vh] bg-[#F2F6FA] py-10 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">ORDER TRACKING</p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Pantau proses dokumen Anda
          </h1>
          <p className="mt-4 text-[#667085]">
            Masukkan ID pesanan untuk melihat status operasional terbaru.
          </p>
          <form
            onSubmit={submit}
            className="mt-8 flex rounded-xl border border-[#D9E0E8] bg-white p-2 shadow-sm"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 px-4 outline-none"
              placeholder="Contoh: SUN-240891"
              aria-label="ID pesanan"
            />
            <button className="btn-primary">
              <Search size={18} />
              <span className="hidden sm:inline">Lacak Pesanan</span>
            </button>
          </form>
        </div>
        {order.isLoading && (
          <div className="mx-auto mt-10 max-w-4xl card p-10 text-center text-[#667085]">
            Mencari data pesanan...
          </div>
        )}
        {!order.isLoading && orderId && !order.data && (
          <div className="mx-auto mt-10 max-w-4xl card p-10 text-center">
            <PackageSearch className="mx-auto size-10 text-[#98A2B3]" />
            <h2 className="mt-4 font-heading text-xl font-bold">Pesanan tidak ditemukan</h2>
            <p className="mt-2 text-sm text-[#667085]">
              Periksa kembali ID pesanan yang Anda masukkan.
            </p>
          </div>
        )}
        {order.data && (
          <div className="mx-auto mt-10 max-w-5xl space-y-5">
            <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB]">
                    {order.data.id}
                  </span>
                  <span className="rounded-md bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    {order.data.status}
                  </span>
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold">
                  {service.data?.name ?? "Memuat layanan..."}
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  {order.data.vehicleType} · {order.data.plateNumber}
                </p>
              </div>
              <div className="border-t border-[#E5EAF0] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="text-xs font-semibold text-[#667085]">TANGGAL ORDER</p>
                <p className="mt-2 flex items-center gap-2 font-semibold">
                  <CalendarDays size={17} />
                  {new Date(order.data.orderDate).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="border-b border-[#E5EAF0] p-6 md:p-8">
                <h2 className="font-heading text-xl font-bold">Status Pengurusan</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Pembaruan setiap tahap berasal dari data operasional.
                </p>
              </div>
              <div className="p-6 md:p-8">
                {stages.isLoading ? (
                  <p className="text-sm text-[#667085]">Memuat status...</p>
                ) : (
                  <div>
                    {stages.data?.map((stage, index) => (
                      <div
                        key={stage.id}
                        className="relative grid grid-cols-[40px_1fr] gap-4 pb-9 last:pb-0"
                      >
                        {index < (stages.data?.length ?? 0) - 1 && (
                          <div
                            className={`absolute left-[19px] top-9 h-full w-px ${stage.status === "completed" ? "bg-[#2563EB]" : "bg-[#D9E0E8]"}`}
                          />
                        )}
                        <div
                          className={`relative z-10 grid size-10 place-items-center rounded-full border-2 ${stage.status === "completed" ? "border-[#2563EB] bg-[#2563EB] text-white" : stage.status === "active" ? "border-[#2563EB] bg-white text-[#2563EB]" : "border-[#D9E0E8] bg-white text-[#98A2B3]"}`}
                        >
                          {stage.status === "completed" ? (
                            <Check size={17} />
                          ) : stage.status === "active" ? (
                            <Clock3 size={17} />
                          ) : (
                            <Circle size={12} />
                          )}
                        </div>
                        <div className={`pt-1 ${stage.status === "pending" ? "opacity-50" : ""}`}>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="font-heading font-bold">{stage.stageName}</h3>
                            {stage.updatedAt && (
                              <span className="text-xs text-[#667085]">{stage.updatedAt}</span>
                            )}
                          </div>
                          {stage.operationalStatus && (
                            <p className="mt-2 text-sm font-semibold text-[#2563EB]">
                              {stage.operationalStatus}
                            </p>
                          )}
                          {stage.description && (
                            <p className="mt-1 text-sm leading-6 text-[#667085]">
                              {stage.description}
                            </p>
                          )}
                          {stage.estimatedDuration && (
                            <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#F2F6FA] px-3 py-2 text-xs text-[#667085]">
                              <Clock3 size={14} />
                              {stage.estimatedDuration}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <InfoCard
                icon={PackageSearch}
                label="PENJEMPUTAN"
                title="Dokumen telah dijemput"
                text="Jadwal dan status mengikuti konfirmasi operasional."
              />
              <InfoCard
                icon={Truck}
                label="PENGANTARAN"
                title="Belum dijadwalkan"
                text="Jadwal akan tersedia setelah proses dokumen selesai."
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
function InfoCard({
  icon: Icon,
  label,
  title,
  text,
}: {
  icon: typeof Truck;
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card flex gap-4 p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#2563EB]">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[10px] font-bold tracking-widest text-[#667085]">{label}</p>
        <h3 className="mt-1 font-heading font-bold">{title}</h3>
        <p className="mt-1 text-sm text-[#667085]">{text}</p>
      </div>
    </div>
  );
}
