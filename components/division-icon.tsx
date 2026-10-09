import {
  Baby,
  BedDouble,
  Beaker,
  Droplets,
  FlaskConical,
  LayoutGrid,
  Package,
  Scissors,
  Smile,
  Stethoscope,
  TestTube,
} from 'lucide-react'
import type { DivisionIcon } from '@/lib/divisions'

const icons: Record<DivisionIcon, typeof Stethoscope> = {
  bed: BedDouble,
  flask: FlaskConical,
  baby: Baby,
  scissors: Scissors,
  stethoscope: Stethoscope,
  smile: Smile,
  'test-tube': TestTube,
  droplet: Droplets,
  package: Package,
  beaker: Beaker,
  grid: LayoutGrid,
}

export function DivisionIconMark({ icon, size = 22 }: { icon: DivisionIcon; size?: number }) {
  const Icon = icons[icon] || LayoutGrid
  return <Icon size={size} strokeWidth={1.75} aria-hidden />
}
