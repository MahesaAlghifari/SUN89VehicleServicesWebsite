import { ArrowRight, Clock3, Compass, MapPin, Phone, Target } from "lucide-react";
import { Link } from "react-router";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useCompanyProfile } from "../../hooks/useData";
import { heroImage, officeGallery } from "../../mocks/data";
import { getTelUrl, getWhatsAppUrl } from "../../utils/contact";

const businessUnits = [
  "SUN 89 Biro Jasa",
  "SUN 89 Mobilindo",
  "SUN 89 Body Repair",
  "SUN 89 Auto Detailing",
  "SUN 89 Construction & Maintenance",
  "SUN Hotel",
];

const missionItems = [
  "Memastikan kepuasan konsumen dan pengguna jasa.",
  "Melakukan perbaikan pelayanan secara berkesinambungan dan berkelanjutan.",
  "Menjalankan layanan yang tepat guna dan tepat sasaran.",
  "Lihai dan sigap dalam semua proses pelayanan.",
  "Menjalankan edukasi terencana untuk meningkatkan kompetensi tim dan kualitas pelayanan.",
  "Mematuhi seluruh peraturan perundang-undangan yang berlaku.",
];

export function AboutPage() {
  const { data: company } = useCompanyProfile();
  return (
    <>
      <section className="container-page py-10 md:py-16">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">TENTANG KAMI</p>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Membantu urusan kendaraan terasa lebih jelas.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#667085]">
              {company?.companyName ?? "CV. SUN DELAPAN SEMBILAN"} adalah biro jasa administrasi
              kendaraan yang berfokus pada proses terstruktur, komunikasi profesional, dan kemudahan
              pelanggan.
            </p>
          </div>
          <img
            src={heroImage}
            alt="Tampak depan kantor SUN 89 Biro Jasa"
            className="h-[390px] w-full rounded-2xl object-cover object-center"
          />
        </div>
      </section>
      <section className="section bg-[#F2F6FA]">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Profil & Sejarah"
              title="Berdiri resmi sejak 2016 di bawah naungan CV. Sun Delapan Sembilan"
              description="Perusahaan jasa kepengurusan surat kendaraan bermotor di Bogor yang dibangun oleh para profesional berpengalaman dengan komitmen layanan yang cepat dan tanggap."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {businessUnits.map((unit) => (
                <span
                  key={unit}
                  className="rounded-full border border-[#D8E1EB] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#17375E]"
                >
                  {unit}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4 border-l-2 border-[#2563EB] pl-7 leading-8 text-[#667085]">
            <p className="text-sm font-bold text-[#2563EB]">PROFIL & SEJARAH PERUSAHAAN</p>
            <p>
              Sun Delapan Sembilan didirikan di Bogor berdasarkan Akta Notaris Sugi Harianto,
              S.H., M.Kn. No. AHU-00014.AH.02.01 Tahun 2016 dengan nama resmi{" "}
              <strong className="font-semibold text-[#17375E]">CV. SUN DELAPAN SEMBILAN</strong>,
              beralamat di Jl. Raya Sukahati No. 06, Sukahati, Cibinong, Bogor, Jawa Barat 16913.
            </p>
            <p>
              Bergerak utama di bidang jasa kepengurusan surat kendaraan bermotor melalui{" "}
              <strong className="font-semibold text-[#17375E]">SUN 89 Biro Jasa</strong>,
              perusahaan ini juga mengembangkan berbagai lini usaha lain meliputi SUN Hotel, jual
              beli mobil bekas (SUN 89 Mobilindo), SUN 89 Construction &amp; Maintenance, SUN 89
              Body Repair, dan SUN 89 Auto Detailing.
            </p>
            <p>
              Usaha ini didirikan oleh para profesional yang berpengalaman di bidangnya masing-masing
              serta memiliki komitmen dan keahlian untuk membantu menyelesaikan kebutuhan konsumen
              secara cepat dan tanggap.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Arah Kami" title="Visi dan misi perusahaan" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="card p-7">
              <Target className="text-[#2563EB]" />
              <h3 className="mt-6 font-heading text-xl font-bold text-[#17375E]">
                Visi Perusahaan
              </h3>
              <p className="mt-4 leading-8 text-[#667085]">
                Menjadi biro jasa yang berkualitas dan terpercaya yang menjamin kepuasan pengguna
                jasa, kesejahteraan tim, dan keuntungan bagi pemegang saham serta memberikan
                kemanfaatan bagi lingkungan sekitar.
              </p>
            </article>
            <article className="card p-7">
              <Compass className="text-[#2563EB]" />
              <h3 className="mt-6 font-heading text-xl font-bold text-[#17375E]">
                Misi Perusahaan
              </h3>
              <ol className="mt-4 space-y-3 text-[#667085]">
                {missionItems.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 leading-7">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#EFF4FF] text-xs font-bold text-[#2563EB]">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>
      <section className="section bg-[#17375E] text-white">
        <div className="container-page grid items-stretch gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              light
              eyebrow="Lokasi Kantor"
              title="Kunjungi SUN 89"
              description="Silakan datang langsung ke kantor kami atau hubungi tim SUN 89 untuk konsultasi administrasi kendaraan."
            />
            <div className="mt-8 space-y-4 text-blue-100">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-blue-300" />
                <div>
                  <strong className="text-white">{company?.brandName ?? "SUN 89"}</strong>
                  <p className="mt-1 text-sm leading-6">{company?.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="shrink-0 text-blue-300" />
                <a
                  href={getTelUrl(company?.phone)}
                  className="text-sm font-medium text-white hover:underline"
                >
                  {company?.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 shrink-0 text-blue-300" />
                <ul className="space-y-1 text-sm">
                  {(company?.hours ?? []).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/layanan" className="btn-light">
                Ajukan Layanan <ArrowRight size={17} />
              </Link>
              {company?.whatsapp && (
                <a
                  href={getWhatsAppUrl(company.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[0.6rem] border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  WhatsApp
                </a>
              )}
              {company?.mapLinkUrl && (
                <a
                  href={company.mapLinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[0.6rem] border border-white/25 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Buka Google Maps
                </a>
              )}
            </div>
          </div>
          <div className="min-h-[340px] overflow-hidden rounded-xl border border-white/15 bg-white shadow-lg">
            {company?.mapEmbedUrl && (
              <iframe
                title="Peta Lokasi SUN 89 Biro Jasa Bogor"
                src={company.mapEmbedUrl}
                className="h-full min-h-[340px] w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Galeri Kantor" title="Ruang yang mendukung pelayanan" />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {officeGallery.slice(0, 4).map((item) => (
              <figure key={item.src} className="group relative overflow-hidden rounded-xl">
                <img
                  src={item.src}
                  alt={item.alt}
                  className={`h-64 w-full object-cover ${item.objectPosition} transition duration-500 group-hover:scale-105`}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10 text-xs font-semibold text-white">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
