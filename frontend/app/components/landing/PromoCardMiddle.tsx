"use client"

// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

export function PromoCardMiddle({
  pretitle = "Summer Special",
  titleStrong = "20% OFF",
  title = "SKIING IN GULMARG",
  cta = "Book Activity",
  imageSrc = "/skkinggulmarg.jpg",
  onCtaClick,
  className,
}: {
  pretitle?: string
  titleStrong?: string
  title?: string
  cta?: string
  imageSrc?: string
  onCtaClick?: () => void
  className?: string
}) {
  return (
    <section aria-label="Promoted activity" className="relative overflow-hidden max-h-72 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">

      <img
        src={imageSrc || "/placeholder.svg?height=400&width=800&query=mountain%20promo%20background"}
        alt="Mountain background for the skiing promotion"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      {/* Content */}
      <div className="relative p-6 md:p-8 lg:p-10">
        <p className="text-xs font-medium uppercase tracking-wider text-white/85">{pretitle}</p>
        <h2 className="mt-2 text-pretty text-2xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
          <span className="block">{titleStrong}</span>
          <span className="block">{title}</span>
        </h2>
        <div className="mt-5">
          <button 
            onClick={onCtaClick} 
            className="rounded-3xl bg-[#EF4444] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-rose-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black/50"
          >
            {cta}
          </button>
        </div>
      </div>
      {/* Aspect guard to keep height on SSR */}
      <div className="invisible h-56 w-full md:h-64 lg:h-72">.</div>
    </section>
  )
}
