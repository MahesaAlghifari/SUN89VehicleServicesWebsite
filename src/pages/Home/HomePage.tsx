import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  HandCoins,
  Headphones,
  MapPinned,
  Quote,
  Send,
  Truck,
} from "lucide-react";
import { useServices } from "../../hooks/useData";
import { officeImages, statistics } from "../../mocks/data";
import { SectionHeading } from "../../components/common/SectionHeading";

const process = [
  {
    title: "Isi Formulir Pemesanan",
    text: "Isi data kendaraan dan pilih layanan yang Anda butuhkan.",
    icon: ClipboardCheck,
  },
  {
    title: "Verifikasi & Estimasi Biaya",
    text: "Kami cek data Anda dan tampilkan estimasi biaya.",
    icon: HandCoins,
  },
  {
    title: "Penjadwalan Jemput",
    text: "Pilih waktu penjemputan yang paling nyaman untuk Anda.",
    icon: Clock3,
  },
  {
    title: "Proses di Samsat",
    text: "Semua proses di Samsat kami urus dengan cepat dan tanpa ribet.",
    icon: Building2,
  },
  {
    title: "Dokumen Diantar Kembali",
    text: "Setelah selesai, dokumen langsung kami antar ke alamat Anda.",
    icon: Truck,
  },
];
const benefits = [
  {
    title: "Proses Terstruktur",
    text: "Setiap pesanan mengikuti tahapan kerja yang jelas dan dapat dipantau.",
    icon: FileCheck2,
  },
  {
    title: "Pelayanan Profesional",
    text: "Tim kami membantu menjelaskan kebutuhan dokumen secara ringkas.",
    icon: Headphones,
  },
  {
    title: "Transparansi Biaya",
    text: "Estimasi biaya dikonfirmasi sebelum proses dilanjutkan.",
    icon: BadgeCheck,
  },
  {
    title: "Jemput & Antar",
    text: "Opsi penjemputan dan pengantaran dokumen yang lebih praktis.",
    icon: MapPinned,
  },
];
const faqs = [
  [
    "Apa saja layanan yang tersedia?",
    "Daftar layanan aktif dapat dilihat pada halaman Layanan dan akan diperbarui melalui sistem.",
  ],
  [
    "Apa persyaratan dokumen untuk mengurus STNK?",
    "Persyaratan berbeda untuk setiap layanan. Buka detail layanan untuk melihat daftar dokumen yang diperlukan.",
  ],
  [
    "Berapa lama proses pengurusan?",
    "Durasi mengikuti jenis layanan dan kondisi proses. Estimasi resmi akan diberikan pada setiap tahap.",
  ],
  [
    "Bagaimana cara melakukan pemesanan?",
    "Pilih layanan, lengkapi formulir, lalu konfirmasikan data pesanan Anda.",
  ],
  [
    "Bagaimana cara mengecek status dokumen?",
    "Masukkan ID pesanan pada halaman Tracking untuk melihat pembaruan proses.",
  ],
  [
    "Bagaimana sistem pembayaran?",
    "Rincian dan instruksi pembayaran akan dikonfirmasi setelah verifikasi pesanan.",
  ],
  [
    "Apakah dokumen dapat dijemput dan diantarkan?",
    "Opsi penjemputan dan pengantaran tersedia sesuai konfirmasi area layanan.",
  ],
];

function ServiceAccordion() {
  const { data, isLoading, isError } = useServices();
  const [selectedId, setSelectedId] = useState<string>();
  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className="grid min-h-[560px] animate-pulse gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-[#E5EAF0] bg-white" />
        <div className="rounded-2xl bg-[#17375E]" />
      </div>
    );
  if (isError) return <div className="card p-8 text-red-600">Layanan belum dapat dimuat.</div>;
  const activeService = data?.find((service) => service.id === selectedId) ?? data?.[0];

  return (
    <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
      <div className="rounded-2xl border border-[#E5EAF0] bg-white p-2 shadow-[0_16px_42px_rgba(23,55,94,.045)]">
        {data?.map((service, index) => {
          const active = activeService?.id === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedId(service.id)}
              aria-pressed={active}
              className={`group relative flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition md:px-4 ${
                active
                  ? "border-blue-200 bg-[#EEF5FF]"
                  : "border-transparent hover:border-[#E5EAF0] hover:bg-[#FAFBFC]"
              }`}
            >
              <span
                className={`w-6 shrink-0 font-heading text-[10px] font-bold tracking-[.08em] ${
                  active ? "text-[#2563EB]" : "text-[#98A2B3]"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <strong className="truncate font-heading text-sm font-bold text-[#172B45]">
                    {service.name}
                  </strong>
                  <small className="hidden shrink-0 text-[9px] font-bold tracking-[.1em] text-[#667085] lg:inline">
                    {service.category.replace(/_/g, " ")}
                  </small>
                </span>
                <span className="mt-1 block truncate text-[11px] text-[#667085]">
                  {service.description}
                </span>
              </span>
              <ArrowRight
                className={`size-4 shrink-0 transition ${
                  active
                    ? "translate-x-0 text-[#2563EB]"
                    : "-translate-x-1 text-[#98A2B3] group-hover:translate-x-0"
                }`}
              />
              {active && (
                <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-[#2563EB]" />
              )}
            </button>
          );
        })}
      </div>

      {activeService && (
        <article className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl bg-[#17375E] p-7 text-white shadow-[0_20px_50px_rgba(23,55,94,.16)] md:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold tracking-[.18em] text-blue-200">
              {activeService.category.replace(/_/g, " ")}
            </span>
            <span className="text-xs font-semibold text-blue-200/60">
              {String(activeService.sortOrder).padStart(2, "0")} / 08
            </span>
          </div>
          <h3 className="mt-7 max-w-md font-heading text-3xl font-bold leading-tight tracking-[-0.035em]">
            {activeService.name}
          </h3>
          <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/75">
            {activeService.description}
          </p>
          <div className="my-8 h-px bg-white/12" />
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-200">
            Persyaratan dokumen
          </p>
          <ul className="mt-5 space-y-3">
            {activeService.requirements.map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm leading-6 text-blue-50/85">
                <Check className="mt-1 size-4 shrink-0 text-blue-300" />
                {requirement}
              </li>
            ))}
          </ul>
          <button
            className="btn-light mt-auto w-full pt-3 sm:w-fit"
            onClick={() => navigate(`/layanan?serviceId=${activeService.id}`)}
          >
            Ajukan Layanan <ArrowRight size={17} />
          </button>
        </article>
      )}
    </div>
  );
}

export function HomePage() {
  const [faqOpen, setFaqOpen] = useState(0);
  return (
    <>
      <section className="container-page pb-8 pt-6 md:pb-12 md:pt-8">
        <div className="overflow-hidden rounded-[24px] border border-[#DDE5EE] bg-white shadow-[0_24px_70px_rgba(23,55,94,.11)]">
          <div className="grid min-h-[570px] lg:grid-cols-[.94fr_1.06fr]">
            <div className="relative z-10 flex flex-col justify-center bg-[#17375E] px-7 py-14 text-white md:px-12 lg:px-14">
              <span className="mb-7 w-fit rounded-full border border-white/20 px-4 py-2 text-[11px] font-semibold tracking-[.14em] text-blue-100">
                BIRO JASA KENDARAAN TERPERCAYA
              </span>
              <h1 className="max-w-[600px] font-heading text-4xl font-bold leading-[1.13] tracking-[-0.045em] md:text-5xl lg:text-[52px]">
                Pengurusan Dokumen Kendaraan Lebih Mudah dan Terpercaya.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-blue-100/80">
                SUN 89 membantu kebutuhan administrasi kendaraan Anda, mulai dari perpanjangan STNK,
                balik nama, mutasi, hingga pengurusan dokumen lainnya.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/layanan" className="btn-primary">
                  Lihat Layanan <ArrowRight size={18} />
                </Link>
                <Link to="/tracking" className="btn-light">
                  Cek Status Dokumen
                </Link>
              </div>
            </div>
            <div className="relative min-h-[360px] overflow-hidden lg:min-h-full">
              <img
                src={officeImages[0]}
                alt="Placeholder eksterior kantor profesional"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A49]/30 via-transparent to-transparent" />
              <span className="absolute bottom-5 right-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-semibold tracking-wide text-[#17375E] backdrop-blur">
                FOTO KANTOR SEMENTARA
              </span>
            </div>
          </div>
          <div className="grid border-t border-[#E5EAF0] bg-white sm:grid-cols-3">
            {statistics.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center gap-4 px-6 py-5 md:justify-center md:px-8 ${index < statistics.length - 1 ? "border-b border-[#E5EAF0] sm:border-b-0 sm:border-r" : ""}`}
              >
                <strong className="font-heading text-2xl text-[#17375E] md:text-3xl">
                  {item.value}
                </strong>
                <span className="max-w-28 text-xs leading-5 text-[#667085]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-[#98A2B3] md:text-right">
          Angka statistik merupakan data contoh dan belum terverifikasi.
        </p>
      </section>

      <section className="section bg-[#F2F6FA]">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Solusi SUN 89"
            title="Layanan pengurusan kendaraan"
            description="Pilih kebutuhan Anda. Kami bantu proses administrasinya."
          />
          <div className="mx-auto mt-12 max-w-[1160px]">
            <ServiceAccordion />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Cara Kerja"
            title="Lima langkah, proses yang lebih tenang"
            description="Gambaran proses layanan untuk membantu Anda memahami perjalanan dokumen dari awal hingga selesai."
          />
          <div className="relative mx-auto mt-16 grid max-w-6xl gap-0 md:grid-cols-5">
            <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-[#CFD8E3] md:block" />
            {process.map((item, index) => (
              <div
                key={item.title}
                className="relative grid grid-cols-[56px_1fr] gap-5 pb-10 last:pb-0 md:block md:px-3 md:pb-0 md:text-center"
              >
                {index < process.length - 1 && (
                  <span className="absolute left-[27px] top-14 h-[calc(100%-3.5rem)] w-px bg-[#CFD8E3] md:hidden" />
                )}
                <div className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-[5px] border-white bg-[#17375E] text-white shadow-[0_6px_18px_rgba(23,55,94,.18)] md:mx-auto">
                  <item.icon size={21} />
                </div>
                <div className="pt-1 md:mt-6 md:pt-0">
                  <span className="text-[11px] font-bold tracking-[.14em] text-[#2563EB]">
                    LANGKAH 0{index + 1}
                  </span>
                  <h3 className="mx-auto mt-2 max-w-[180px] font-heading text-sm font-bold leading-5">
                    {item.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[190px] text-xs leading-5 text-[#667085]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="overflow-hidden rounded-[28px] bg-[#17375E] px-6 py-14 text-white shadow-[0_24px_60px_rgba(23,55,94,.14)] md:px-10 md:py-16">
            <SectionHeading
              align="center"
              eyebrow="Mengapa SUN 89"
              light
              title="Pendamping administrasi yang dapat diandalkan"
              description="Pendekatan kerja yang dirancang untuk memberi kejelasan di setiap langkah."
            />
            <div className="mx-auto mt-14 grid max-w-5xl sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item, index) => (
                <article
                  key={item.title}
                  className={`relative px-4 py-7 text-center md:px-6 ${index % 2 === 0 ? "sm:border-r sm:border-white/12" : ""} ${index < benefits.length - 1 ? "border-b border-white/12 lg:border-b-0 lg:border-r" : ""}`}
                >
                  <span className="mx-auto grid size-12 place-items-center rounded-full bg-white/10 text-blue-200">
                    <item.icon className="size-5" />
                  </span>
                  <h3 className="mt-6 font-heading text-base font-bold">{item.title}</h3>
                  <p className="mx-auto mt-3 max-w-[220px] text-sm leading-6 text-blue-100/68">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Klien Kami"
            title="Kepercayaan yang kami jaga"
            description="Logo klien akan ditampilkan setelah aset dan izin publikasi dikonfirmasi."
          />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#E5EAF0] bg-[#E5EAF0] md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid h-28 place-items-center bg-white text-[10px] font-bold tracking-[.18em] text-[#98A2B3] transition-colors hover:bg-[#F8FAFC]"
              >
                LOGO KLIEN
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#F2F6FA]">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Testimoni"
            title="Cerita dari pelanggan"
            description="Konten berikut merupakan contoh tata letak dan bukan ulasan pelanggan nyata."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-[1.15fr_.85fr]">
            {[
              [
                "Prosesnya dijelaskan dengan runtut sehingga saya memahami dokumen apa saja yang perlu disiapkan.",
                "Nama pelanggan contoh",
                "Perpanjangan STNK",
              ],
              [
                "Pembaruan status membantu saya mengetahui posisi proses tanpa perlu menanyakan berulang kali.",
                "Nama pelanggan contoh",
                "Balik Nama",
              ],
            ].map(([quote, name, service]) => (
              <article
                className="relative overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white p-7 shadow-[0_14px_40px_rgba(23,55,94,.045)] md:p-9"
                key={service}
              >
                <Quote className="absolute right-6 top-5 size-14 text-[#2563EB]/8" />
                <span className="text-[10px] font-bold tracking-[.16em] text-[#98A2B3]">
                  TESTIMONI CONTOH
                </span>
                <p className="relative mt-7 font-heading text-lg font-semibold leading-8">
                  “{quote}”
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-[#E5EAF0] pt-5">
                  <span className="grid size-9 place-items-center rounded-full bg-[#EDF4FC] text-xs font-bold text-[#3979B9]">
                    {name.charAt(0)}
                  </span>
                  <div>
                    <strong className="text-sm">{name}</strong>
                    <p className="text-xs text-[#667085]">{service}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Galeri"
            title="Ruang dan aktivitas SUN 89"
            description="Foto profesional sementara yang akan diganti dengan dokumentasi kantor asli."
          />
          <div className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-3 md:auto-rows-[230px] md:grid-cols-4">
            {officeImages.map((image, i) => (
              <figure
                key={image}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <img
                  src={image}
                  alt={
                    [
                      "Tampak depan kantor",
                      "Interior kantor",
                      "Area resepsionis",
                      "Aktivitas pelayanan",
                      "Dokumentasi pengurusan kendaraan",
                    ][i]
                  }
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-xs font-semibold text-white">
                  {
                    [
                      "Tampak depan kantor",
                      "Interior kantor",
                      "Area resepsionis",
                      "Aktivitas pelayanan",
                      "Dokumentasi pengurusan kendaraan",
                    ][i]
                  }
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#F2F6FA]">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="FAQ"
            title="Pertanyaan yang sering diajukan"
            description="Temukan informasi awal sebelum membuat pesanan."
          />
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-[0_18px_45px_rgba(23,55,94,.045)]">
            {faqs.map(([q, a], i) => (
              <div
                className={`border-b border-[#E5EAF0] transition-colors last:border-0 ${faqOpen === i ? "bg-[#FBFCFE]" : ""}`}
                key={q}
              >
                <button
                  className="flex w-full items-center gap-4 p-5 text-left font-semibold md:px-7 md:py-6"
                  onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
                >
                  <span className="flex-1">{q}</span>
                  <span
                    className={`grid size-8 place-items-center rounded-full border transition ${faqOpen === i ? "rotate-180 border-blue-200 bg-blue-50 text-[#2563EB]" : "border-[#E5EAF0] text-[#667085]"}`}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>
                {faqOpen === i && (
                  <p className="max-w-3xl px-5 pb-6 text-sm leading-7 text-[#667085] md:px-7">
                    {a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2F6FA] pb-20 md:pb-24">
        <div className="container-page">
          <div className="flex flex-col items-center justify-between gap-7 rounded-[24px] bg-[#2563EB] px-7 py-10 text-center text-white shadow-[0_18px_45px_rgba(37,99,235,.18)] md:flex-row md:px-12 md:py-11 md:text-left">
            <div>
              <h2 className="font-heading text-2xl font-bold">Siap mengurus dokumen kendaraan?</h2>
              <p className="mt-2 text-blue-100">
                Mulai dengan memilih layanan yang sesuai kebutuhan Anda.
              </p>
            </div>
            <Link to="/layanan" className="btn-light shrink-0">
              Buat Pesanan <Send size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
