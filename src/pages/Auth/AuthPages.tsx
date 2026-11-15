import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Brand } from "../../components/common/Brand";
import { useAuth } from "../../app/providers/AuthProvider";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
const registerSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.email(),
    phone: z.string().min(9),
    password: z.string().min(6),
    confirm: z.string(),
    terms: z.boolean().refine(Boolean),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Konfirmasi password tidak sama",
  });

function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[.8fr_1.2fr]">
      <div className="flex items-center bg-white px-5 py-12 md:px-12">
        <div className="mx-auto w-full max-w-md">
          <Brand />
          <h1 className="mt-12 font-heading text-3xl font-bold">{title}</h1>
          <p className="mt-3 text-[#667085]">{subtitle}</p>
          {children}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-[#17375E] p-14 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative max-w-lg">
          <ShieldCheck className="size-12 text-blue-300" />
          <h2 className="mt-7 font-heading text-4xl font-bold leading-tight">
            Satu akun untuk mengelola profil dan riwayat pesanan.
          </h2>
          <p className="mt-4 leading-7 text-blue-100/75">
            Autentikasi ini merupakan simulasi frontend dan bukan sistem keamanan produksi.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() {
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });
  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk mengakses akun dan riwayat pesanan."
    >
      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async () => {
          await new Promise((r) => setTimeout(r, 350));
          auth.login();
          navigate("/akun");
        })}
      >
        <label>
          Email
          <input
            className="field"
            type="email"
            {...register("email")}
            placeholder="nama@email.com"
          />
          <Error text={errors.email?.message as string} />
        </label>
        <label>
          Password
          <div className="relative">
            <input
              className="field pr-12"
              type={show ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          <Error text={errors.password?.message as string} />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#667085]">
          <input type="checkbox" /> Ingat saya
        </label>
        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Login"}
        </button>
        <p className="text-center text-sm text-[#667085]">
          Belum punya akun?{" "}
          <Link className="font-bold text-[#2563EB]" to="/register">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const [show, setShow] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });
  return (
    <AuthShell
      title="Buat akun baru"
      subtitle="Daftar untuk menyimpan profil dan melihat riwayat pesanan."
    >
      <form
        className="mt-8 grid gap-4"
        onSubmit={handleSubmit(async () => {
          await new Promise((r) => setTimeout(r, 350));
          auth.login();
          navigate("/akun");
        })}
      >
        <label>
          Nama lengkap
          <input className="field" {...register("fullName")} />
          <Error text={errors.fullName?.message as string} />
        </label>
        <label>
          Email
          <input className="field" type="email" {...register("email")} />
          <Error text={errors.email?.message as string} />
        </label>
        <label>
          Nomor telepon
          <input className="field" {...register("phone")} />
          <Error text={errors.phone?.message as string} />
        </label>
        <label>
          Password
          <div className="relative">
            <input
              className="field pr-12"
              type={show ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShow(!show)}
            >
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          <Error text={errors.password?.message as string} />
        </label>
        <label>
          Konfirmasi password
          <input className="field" type="password" {...register("confirm")} />
          <Error text={errors.confirm?.message as string} />
        </label>
        <label className="flex items-start gap-2 text-sm text-[#667085]">
          <input className="mt-1" type="checkbox" {...register("terms")} /> Saya menyetujui syarat
          dan ketentuan penggunaan.
        </label>
        <Error text={errors.terms?.message as string} />
        <button className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Membuat akun..." : "Buat Akun"}
        </button>
        <p className="text-center text-sm text-[#667085]">
          Sudah punya akun?{" "}
          <Link className="font-bold text-[#2563EB]" to="/login">
            Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
function Error({ text }: { text?: string }) {
  return text ? <span className="mt-1 block text-xs text-red-600">{text}</span> : null;
}
