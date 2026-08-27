import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COMPANY = {
  name: 'Tarumed Supplies Limited',
  shortName: 'Tarumed',
  tagline: 'Discover More. Live Healthier',
  domain: 'tarumed.co.ke',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://tarumed.co.ke').replace(/\/$/, ''),
  email: 'hello@tarumed.co.ke',
  careersEmail: 'careers@tarumed.co.ke',
  phone: '+254 715 084 078',
  phoneHref: 'tel:+254715084078',
  whatsapp: '254715084078',
  builderUrl: 'https://codewithseth.co.ke',
  builderName: 'codewithseth.co.ke',
  location: 'Eldoret, Uasin Gishu, Kenya',
  hours: 'Monday–Friday 8:00–17:00 · Saturday 9:00–12:00',
  logo: '/logo.png',
}
