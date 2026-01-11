// Parent component that composes ActivitiesMenu and PromoCard side by side.

import { ActivitiesMenu } from "./ActivitiesMenu"
import { PromoCard } from "./PromoCard"
import { TrendingActivities } from "./TrendingActivities"
import { Footer } from "../footer/Footer"
import { PopularActivities } from "./PopularActivities"
import { PromoCardMiddle } from "./PromoCardMiddle"
// import { cn } from "@/lib/utils"

export default function Experience({ className }: { className?: string }) {
  return (
    <div className="w-[95%] mx-auto">
      <section className="max-w-[1500px] mx-auto px-6 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="flex-1">
            <PromoCard />
          </div>
        </div>
        <TrendingActivities />
        <PromoCardMiddle />
        <PopularActivities />
      </section>
    </div>
  )
}
