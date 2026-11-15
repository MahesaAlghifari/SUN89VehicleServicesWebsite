import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

export type TestimonialItem = {
  name: string;
  quote: string;
};

export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const ignoreScrollUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index: number) => {
    const track = trackRef.current;
    const target = track?.children[index] as HTMLElement | undefined;
    if (!track || !target) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const centeredLeft = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    const clampedLeft = Math.max(0, Math.min(maxScroll, centeredLeft));

    ignoreScrollUntilRef.current = Date.now() + 700;
    track.scrollTo({ left: clampedLeft, behavior: "smooth" });
    setActiveIndex(index);
  };

  const handleScroll = () => {
    if (Date.now() < ignoreScrollUntilRef.current) return;
    const track = trackRef.current;
    if (!track || items.length === 0) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (track.scrollLeft <= 8) {
      setActiveIndex(0);
      return;
    }
    if (maxScroll > 0 && track.scrollLeft >= maxScroll - 8) {
      setActiveIndex(items.length - 1);
      return;
    }

    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < track.children.length; i++) {
      const child = track.children[i] as HTMLElement;
      const cardCenter = child.offsetLeft + child.offsetWidth / 2;
      const diff = Math.abs(cardCenter - viewportCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    }
    setActiveIndex(closest);
  };

  useEffect(() => {
    if (paused || items.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      goTo((activeIndex + 1) % items.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [paused, activeIndex, items.length]);

  return (
    <div
      className="mx-auto mt-12 max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        aria-label="Daftar testimoni pelanggan"
        className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <article
              key={item.name}
              onClick={() => goTo(i)}
              className={`relative flex w-[86%] shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-2xl border bg-white p-7 transition-all duration-300 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.8333rem)] ${
                isActive
                  ? "border-[#2563EB]/45 shadow-[0_18px_44px_rgba(37,99,235,0.10)]"
                  : "border-[#E5EAF0] shadow-[0_14px_40px_rgba(23,55,94,.045)] hover:border-[#CBD5E1]"
              }`}
            >
              <Quote className="pointer-events-none absolute right-6 top-5 size-12 text-[#2563EB]/8" />
              <div>
                <div className="flex items-center gap-1 text-amber-400" aria-label="Rating 5 dari 5">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star key={starIdx} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="relative mt-5 text-[15px] leading-7 text-[#172B45]">
                  “{item.quote}”
                </p>
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-[#E5EAF0] pt-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#EDF4FC] text-xs font-bold text-[#2563EB]">
                  {item.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm text-[#172B45]">{item.name}</strong>
                  <p className="text-xs text-[#667085]">Pelanggan SUN 89</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((item, i) => {
              const active = i === activeIndex;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Lihat testimoni ${item.name}`}
                  aria-current={active ? "true" : undefined}
                  className={`h-2 rounded-full transition-all ${
                    active ? "w-6 bg-[#2563EB]" : "w-2 bg-[#CBD5E1] hover:bg-[#94A3B8]"
                  }`}
                />
              );
            })}
          </div>
          <span className="text-xs font-semibold text-[#667085]">
            {activeIndex + 1} / {items.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo((activeIndex - 1 + items.length) % items.length)}
            aria-label="Testimoni sebelumnya"
            className="grid size-10 place-items-center rounded-full border border-[#D9E0E8] bg-white text-[#17375E] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo((activeIndex + 1) % items.length)}
            aria-label="Testimoni berikutnya"
            className="grid size-10 place-items-center rounded-full border border-[#D9E0E8] bg-white text-[#17375E] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
