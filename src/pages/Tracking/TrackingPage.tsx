import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CalendarDays, Check, Circle, Clock3, PackageSearch, Search, Truck } from "lucide-react";
import { useOrderTracking, useServiceById } from "../../hooks/useData";

export function TrackingPage() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") || params.get("orderId") || "B 1234 KLM";
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>();

  useEffect(() => {
    const q = params.get("q") || params.get("orderId");
    if (q) {
      setInput(q);
      setQuery(q);
      setSelectedOrderNo(undefined);
    }
  }, [params]);

  const { order, stages } = useOrderTracking(selectedOrderNo || query);
  const activeOrder = order.data;
  const service = useServiceById(activeOrder?.serviceId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setSelectedOrderNo(undefined);
    setQuery(trimmed);
    setParams({ q: trimmed });
  };

  const pickupStage = stages.data?.find((s) => s.stageCode === "STEP_2");
  const deliveryStage = stages.data?.find((s) => s.stageCode === "STEP_5");

  return (
    <section className="min-h-[70vh] bg-[#F2F6FA] py-10 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">ORDER TRACKING</p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
            Pantau proses dokumen Anda
          </h1>
          <p className="mt-4 text-[#667085]">
            Masukkan Nomor Polisi kendaraan atau ID Pesanan untuk melihat status operasional terbaru.
          </p>
          <form
            onSubmit={submit}
            className="mt-8 flex rounded-xl border border-[#D9E0E8] bg-white p-2 shadow-sm"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-w-0 flex-1 px-4 outline-none"
              placeholder="Contoh: B 1234 KLM atau ORD-1126-001"
              aria-label="Nomor polisi atau ID pesanan"
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

        {!order.isLoading && query && !activeOrder && (
          <div className="mx-auto mt-10 max-w-4xl card p-10 text-center">
            <PackageSearch className="mx-auto size-10 text-[#98A2B3]" />
            <h2 className="mt-4 font-heading text-xl font-bold">Pesanan tidak ditemukan</h2>
            <p className="mt-2 text-sm text-[#667085]">
              Periksa kembali Nomor Polisi atau ID Pesanan yang Anda masukkan.
            </p>
          </div>
        )}

        {activeOrder && (
          <div className="mx-auto mt-10 max-w-5xl space-y-5">
            {order.allMatches.length > 1 && (
              <div className="card flex flex-wrap items-center gap-2 p-4">
                <span className="mr-2 text-xs font-semibold text-[#667085]">
                  Ditemukan {order.allMatches.length} pesanan:
                </span>
                {order.allMatches.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedOrderNo(item.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      activeOrder.id === item.id
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#F2F6FA] text-[#17375E] hover:bg-blue-50"
                    }`}
                  >
                    {item.id} · {item.serviceName || item.plateNumber}
                  </button>
                ))}
              </div>
            )}

            <div className="card grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563EB]">
                    {activeOrder.id}
                  </span>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-bold ${
                      activeOrder.isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : activeOrder.isCancelled
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {activeOrder.status}
                  </span>
                  {activeOrder.paymentStatus && (
                    <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      Pembayaran: {activeOrder.paymentStatus}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 font-heading text-2xl font-bold">
                  {activeOrder.serviceName || service.data?.name || "Layanan Pengurusan Dokumen"}
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  {activeOrder.vehicleType} · <strong>{activeOrder.plateNumber}</strong>
                  {activeOrder.samsatOrigin && activeOrder.samsatOrigin !== "-"
                    ? ` · Samsat ${activeOrder.samsatOrigin}`
                    : ""}
                </p>
              </div>
              <div className="border-t border-[#E5EAF0] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <p className="text-xs font-semibold text-[#667085]">TANGGAL ORDER</p>
                <p className="mt-2 flex items-center gap-2 font-semibold">
                  <CalendarDays size={17} />
                  {new Date(activeOrder.orderDate).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="border-b border-[#E5EAF0] p-6 md:p-8">
                <h2 className="font-heading text-xl font-bold">Status Pengurusan</h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Pembaruan setiap tahap berasal langsung dari sistem operasional SUN 89 Biro Jasa.
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
                            className={`absolute left-[19px] top-9 h-full w-px ${
                              stage.status === "completed" ? "bg-[#2563EB]" : "bg-[#D9E0E8]"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 grid size-10 place-items-center rounded-full border-2 ${
                            stage.status === "completed"
                              ? "border-[#2563EB] bg-[#2563EB] text-white"
                              : stage.status === "active"
                                ? "border-[#2563EB] bg-white text-[#2563EB]"
                                : "border-[#D9E0E8] bg-white text-[#98A2B3]"
                          }`}
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
                label={`PENJEMPUTAN (${activeOrder.serviceMethod || "Antar Jemput"})`}
                title={
                  pickupStage?.status === "completed"
                    ? "Dokumen telah diterima"
                    : pickupStage?.status === "active"
                      ? "Sedang dalam proses penjemputan"
                      : "Menunggu jadwal penjemputan"
                }
                text="Jadwal dan status penjemputan mengikuti konfirmasi operasional."
              />
              <InfoCard
                icon={Truck}
                label="PENGANTARAN"
                title={
                  deliveryStage?.status === "completed"
                    ? "Dokumen selesai diantarkan"
                    : deliveryStage?.status === "active"
                      ? "Pengantaran sedang berlangsung"
                      : "Belum dijadwalkan"
                }
                text="Jadwal pengantaran akan tersedia setelah proses di Samsat selesai."
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
