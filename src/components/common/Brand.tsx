import { Link } from "react-router";
import logoImg from "../../assets/logo.jpeg";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className={
        light
          ? "inline-flex items-center rounded-xl bg-white px-3 py-1.5 shadow-sm"
          : "inline-flex items-center"
      }
      aria-label="SUN 89 Beranda"
    >
      <img
        src={logoImg}
        alt="SUN 89 Biro Jasa"
        className="h-9 w-auto object-contain sm:h-10"
      />
    </Link>
  );
}
