import type React from "react"
// import { cn } from "@/lib/utils"
import { Bike, Car, ChevronRight, Mountain, Archive as Parachute, Sailboat, Ship, Sun, Wind, Tent } from "lucide-react"

type ActivityItem = {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
}

const defaultItems: ActivityItem[] = [
  { label: "Turf Booking", icon: Tent },
  { label: "Bungee Jumping", icon: Parachute },
  { label: "Rafting", icon: Ship },
  { label: "Skydiving", icon: Wind },
  { label: "Go Kart", icon: Car },
  { label: "Peak Climbing", icon: Mountain },
  { label: "Desert Safari", icon: Sun },
  { label: "Kayaking", icon: Sailboat },
  { label: "Bike Riding", icon: Bike },
]

export function ActivitiesMenu({
  items = defaultItems,
  className,
}: {
  items?: ActivityItem[]
  className?: string
}) {
  return (
    <nav aria-label="Activities" className="cursor-pointer w-full rounded-xl bg-card text-card-foreground">
      <ul className="divide-y">
        {items.map((item, idx) => {
          const Icon = item.icon
          const Wrapper: any = item.href ? "a" : "div"
          const linkProps = item.href ? { href: item.href } : {}
          return (
            <li key={idx}>
              <Wrapper
                {...linkProps}
                className=
                  "flex items-center justify-between px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="text-md">{item.label}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </Wrapper>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
