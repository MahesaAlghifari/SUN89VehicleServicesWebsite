import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { Mail, MapPin, Menu, Phone, UserRound, X } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useCompanyProfile } from "../../hooks/useData";
import { Brand } from "../common/Brand";
import { getTelUrl, getWhatsAppUrl } from "../../utils/contact";

const nav = [
  { to: "/", label: "Beranda" },
  { to: "/layanan", label: "Layanan" },
  { to: "/tracking", label: "Tracking" },
  { to: "/tentang", label: "Tentang Kami" },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { data: company } = useCompanyProfile();
  return (
    <div className="min-h-screen bg-white text-[#172B45]">
      <header className="sticky top-0 z-50 border-b border-[#E5EAF0] bg-white/95 backdrop-blur">
        <div className="container-page flex h-20 items-center justify-between">
          <Brand />
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${isActive ? "text-[#2563EB]" : "text-[#667085] hover:text-[#17375E]"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <Link className="btn-secondary" to="/akun">
                  <UserRound size={17} /> Akun Saya
                </Link>
                <button className="text-sm font-semibold text-[#667085]" onClick={logout}>
                  Keluar
                </button>
              </>
            ) : (
              <Link className="btn-primary" to="/login">
                Login
              </Link>
            )}
          </div>
          <button
            className="grid size-11 place-items-center rounded-lg border border-[#E5EAF0] lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Buka menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-[#E5EAF0] bg-white px-5 py-5 lg:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 font-semibold hover:bg-[#F2F6FA]"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Link
              to={isAuthenticated ? "/akun" : "/login"}
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              {isAuthenticated ? "Akun Saya" : "Login"}
            </Link>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-[#102A49] text-white">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand light />
            <p className="mt-5 text-sm leading-6 text-blue-100/75">
              Mitra pengurusan dokumen dan administrasi kendaraan yang terstruktur dan profesional.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-bold">Navigasi</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/75">
              {nav.map((item) => (
                <Link key={item.to} to={item.to}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold">Kontak</h3>
            <div className="mt-5 space-y-3 text-sm text-blue-100/75">
              <p className="flex items-start gap-2.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-blue-300" />
                <span>{company?.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={17} className="shrink-0 text-blue-300" />
                <a
                  href={getTelUrl(company?.phone)}
                  className="transition hover:text-white"
                >
                  {company?.phone}
                </a>
              </p>
              {company?.email && (
                <p className="flex items-center gap-2.5">
                  <Mail size={17} className="shrink-0 text-blue-300" />
                  <a href={`mailto:${company.email}`} className="transition hover:text-white">
                    {company.email}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold">Jam Layanan</h3>
            <ul className="mt-5 space-y-1.5 text-sm leading-6 text-blue-100/75">
              {(company?.hours ?? []).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {company?.whatsapp && (
              <p className="mt-4 text-xs text-blue-200/75">
                WhatsApp:{" "}
                <a
                  href={getWhatsAppUrl(company.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline-offset-4 hover:underline"
                >
                  {company.whatsapp}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-blue-100/55">
          © {new Date().getFullYear()} {company?.companyName ?? "CV. SUN DELAPAN SEMBILAN"}
        </div>
      </footer>
    </div>
  );
}
