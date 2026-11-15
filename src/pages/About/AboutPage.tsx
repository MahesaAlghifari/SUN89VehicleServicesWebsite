import { ArrowRight, Compass, HeartHandshake, MapPin, ShieldCheck, Target } from "lucide-react";
import { Link } from "react-router";
import { SectionHeading } from "../../components/common/SectionHeading";
import { useCompanyProfile } from "../../hooks/useData";
import { officeImages } from "../../mocks/data";

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
            src={officeImages[1]}
            alt="Placeholder kantor SUN 89"
            className="h-[390px] w-full rounded-2xl object-cover"
          />
        </div>
      </section>
      <section className="section bg-[#F2F6FA]">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Profil & Sejarah"
            title="Dibangun dari kebutuhan akan layanan yang lebih tertata"
            description="Narasi ini merupakan konten sementara. Profil resmi, tonggak sejarah, dan informasi legal perusahaan akan dilengkapi setelah data terverifikasi."
          />
          <div className="border-l-2 border-[#2563EB] pl-7">
            <p className="text-sm font-bold text-[#2563EB]">SEJARAH PERUSAHAAN</p>
            <p className="mt-4 leading-8 text-[#667085]">
              SUN 89 berkembang untuk menjembatani kebutuhan masyarakat dalam mengurus administrasi
              kendaraan. Setiap proses dirancang agar persyaratan, tahapan, dan pembaruan status
              dapat dipahami dengan lebih mudah.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Arah Kami" title="Visi, misi, dan nilai perusahaan" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [
                Target,
                "Visi",
                "Menjadi mitra administrasi kendaraan yang dikenal karena kejelasan proses dan kualitas pelayanan.",
              ],
              [
                Compass,
                "Misi",
                "Menyederhanakan proses, menjaga komunikasi, dan mengembangkan layanan berbasis teknologi.",
              ],
              [
                HeartHandshake,
                "Nilai",
                "Integritas, ketelitian, pelayanan, dan tanggung jawab dalam setiap proses.",
              ],
            ].map(([Icon, title, text]) => (
              <article key={String(title)} className="card p-7">
                <Icon className="text-[#2563EB]" />
                <h3 className="mt-8 font-heading text-xl font-bold">{String(title)}</h3>
                <p className="mt-3 leading-7 text-[#667085]">{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-[#17375E] text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              light
              eyebrow="Lokasi Kantor"
              title="Kunjungi SUN 89"
              description="Informasi lokasi lengkap dan titik peta akan ditampilkan setelah alamat perusahaan dikonfirmasi."
            />
            <div className="mt-8 flex gap-3 text-blue-100">
              <MapPin className="shrink-0" />
              <div>
                <strong className="text-white">{company?.brandName ?? "SUN 89"}</strong>
                <p className="mt-1 text-sm">
                  {company?.address ?? "Alamat kantor akan dikonfirmasi"}
                </p>
              </div>
            </div>
            <Link to="/layanan" className="btn-light mt-8">
              Hubungi Kami <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid min-h-[340px] place-items-center rounded-xl border border-white/15 bg-white/[.06]">
            <div className="text-center">
              <MapPin className="mx-auto size-10 text-blue-300" />
              <p className="mt-4 font-semibold">Peta lokasi belum tersedia</p>
              <p className="mt-2 text-sm text-blue-100/60">Menunggu alamat terverifikasi</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Galeri Kantor" title="Ruang yang mendukung pelayanan" />
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {officeImages.slice(1).map((image, i) => (
              <img
                key={image}
                src={image}
                alt={`Placeholder dokumentasi kantor ${i + 1}`}
                className={`h-64 w-full rounded-xl object-cover ${i === 0 ? "col-span-2" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
