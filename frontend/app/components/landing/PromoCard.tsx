"use client"

import { useState, useEffect } from "react"

// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

export function PromoCard({
  pretitle = "Summer Special",
  titleStrong = "20% OFF",
  title = "SKIING IN GULMARG",
  cta = "Book Activity",
  images = ["/skkinggulmarg.jpg", "/beach_1.jpg", "/Artboard_1.png"],
  onCtaClick,
  autoSlide = true,
  slideInterval = 2000,
}: {
  pretitle?: string
  titleStrong?: string
  title?: string
  cta?: string
  images?: string[]
  onCtaClick?: () => void
  className?: string
  autoSlide?: boolean
  slideInterval?: number
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-slide effect
  useEffect(() => {
    if (!autoSlide || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, slideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, slideInterval, images.length])

  const currentImage = images[currentImageIndex] || images[0] || "/placeholder.svg?height=400&width=800&query=mountain%20promo%20background"

  return (
    <section aria-label="Promoted activity" className="relative overflow-hidden rounded-xl max-h-72">

      <img
        src={currentImage}
        alt="Mountain background for the skiing promotion"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
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
            className="rounded-3xl bg-[#EF4444] px-6 py-3 text-sm text-white shadow-lg transition-all duration-200 hover:bg-rose-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black/50"
          >
            {cta}
          </button>
        </div>
        
        {/* Carousel indicators */}
        {images.length > 1 && (
          <div className="mt-4 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-110' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Aspect guard to keep height on SSR */}
      <div className="invisible h-56 w-full md:h-64 lg:h-72">.</div>
    </section>
  )
}
