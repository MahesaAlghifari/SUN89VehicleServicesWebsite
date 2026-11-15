export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-blue-200" : "text-[#2563EB]"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-3xl font-bold tracking-[-0.03em] md:text-4xl ${light ? "text-white" : "text-[#172B45]"}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-7 ${light ? "text-blue-100" : "text-[#667085]"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
