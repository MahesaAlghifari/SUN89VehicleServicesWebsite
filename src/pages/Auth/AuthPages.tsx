import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Brand } from "../../components/common/Brand";
import { useAuth } from "../../app/providers/AuthProvider";

const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const registerSchema = z
  .object({
    customerType: z.enum(["PERORANGAN", "PERUSAHAAN_PT"]),
    fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
    email: z.email("Email tidak valid"),
    phone: z.string().min(9, "Nomor telepon minimal 9 digit"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirm: z.string(),
    terms: z.boolean().refine(Boolean, "Anda wajib menyetujui syarat dan ketentuan"),
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
            Terhubung langsung dengan sistem operasional SUN 89 Biro Jasa untuk memantau progres
            dokumen dan riwayat pengurusan kendaraan Anda.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LoginPage() {
  const [show, setShow] = useState(false);
  const [serverError, setServerError] = useState<string>();
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk mengakses akun dan riwayat pesanan."
    >
      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          setServerError(undefined);
          try {
            await auth.login(values);
            navigate("/akun");
          } catch (err: any) {
            setServerError(err?.message || "Gagal login. Periksa kembali email dan password Anda.");
          }
        })}
      >
        {serverError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}
        <label>
          Email
          <input
            className="field"
            type="email"
            {...register("email")}
            placeholder="nama@email.com"
          />
          <Error text={errors.email?.message} />
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
          <Error text={errors.password?.message} />
        </label>
        <div className="flex items-center justify-between gap-2 text-xs text-[#667085]">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Ingat saya
          </label>
          <button
            type="button"
            className="font-semibold text-[#2563EB] hover:underline"
            onClick={() => {
              setValue("email", "hendrawan.pratama@gmail.com");
              setValue("password", "klien123");
            }}
          >
            Isi akun demo pelanggan
          </button>
        </div>
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
  const [serverError, setServerError] = useState<string>();
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      customerType: "PERORANGAN",
    },
  });

  const customerType = watch("customerType");

  return (
    <AuthShell
      title="Buat akun baru"
      subtitle="Daftar cepat untuk menyimpan profil dan memantau riwayat pesanan. Alamat lengkap penjemputan dapat dilengkapi di halaman Akun Saya."
    >
      <form
        className="mt-8 grid gap-4"
        onSubmit={handleSubmit(async (values) => {
          setServerError(undefined);
          try {
            await auth.register({
              customerType: values.customerType,
              fullName: values.fullName,
              email: values.email,
              phone: values.phone,
              password: values.password,
            });
            navigate("/akun");
          } catch (err: any) {
            setServerError(err?.message || "Gagal mendaftarkan akun. Silakan coba lagi.");
          }
        })}
      >
        {serverError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
            <span>{serverError}</span>
          </div>
        )}
        <label>
          Tipe pelanggan
          <select className="field" {...register("customerType")}>
            <option value="PERORANGAN">Perorangan / Pribadi</option>
            <option value="PERUSAHAAN_PT">Perusahaan / PT / Badan Usaha</option>
          </select>
        </label>
        <label>
          {customerType === "PERUSAHAAN_PT" ? "Nama perusahaan / PIC" : "Nama lengkap"}
          <input
            className="field"
            {...register("fullName")}
            placeholder={
              customerType === "PERUSAHAAN_PT"
                ? "Contoh: PT Mitra Graha Sentosa"
                : "Nama lengkap sesuai KTP/STNK"
            }
          />
          <Error text={errors.fullName?.message} />
        </label>
        <label>
          Email
          <input className="field" type="email" {...register("email")} placeholder="nama@email.com" />
          <Error text={errors.email?.message} />
        </label>
        <label>
          Nomor telepon / WhatsApp
          <input className="field" {...register("phone")} placeholder="081234567890" />
          <Error text={errors.phone?.message} />
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
          <Error text={errors.password?.message} />
        </label>
        <label>
          Konfirmasi password
          <input className="field" type="password" {...register("confirm")} />
          <Error text={errors.confirm?.message} />
        </label>
        <label className="flex items-start gap-2 text-sm text-[#667085]">
          <input className="mt-1" type="checkbox" {...register("terms")} /> Saya menyetujui syarat
          dan ketentuan penggunaan.
        </label>
        <Error text={errors.terms?.message} />
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
