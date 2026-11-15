import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
export function NotFoundPage() {
  return (
    <section className="grid min-h-[65vh] place-items-center px-5 text-center">
      <div>
        <span className="font-heading text-8xl font-extrabold text-[#DCE8F5]">404</span>
        <h1 className="-mt-3 font-heading text-3xl font-bold">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-[#667085]">Alamat yang Anda tuju tidak tersedia.</p>
        <Link to="/" className="btn-primary mt-7">
          <ArrowLeft size={17} /> Kembali ke Beranda
        </Link>
      </div>
    </section>
  );
}
