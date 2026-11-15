import { Link } from "react-router";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="SUN 89 Beranda">
      <span className="grid size-11 place-items-center rounded-xl bg-[#2563EB] font-heading text-sm font-extrabold text-white shadow-lg shadow-blue-900/15">
        89
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-[#17375E]"}`}>
        <strong className="font-heading text-lg tracking-tight">SUN 89</strong>
        <small className="mt-1 block text-[9px] font-semibold tracking-[0.2em] opacity-65">
          BIRO JASA
        </small>
      </span>
    </Link>
  );
}
