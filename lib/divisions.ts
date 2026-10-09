import { productImageSrc, slugifyName, type Catalog, type CatalogProduct } from '@/lib/catalog'

export type DivisionIcon =
  | 'bed'
  | 'flask'
  | 'baby'
  | 'scissors'
  | 'stethoscope'
  | 'smile'
  | 'test-tube'
  | 'droplet'
  | 'package'
  | 'beaker'
  | 'grid'

export type DivisionAccent = 'sky' | 'teal' | 'rose' | 'indigo' | 'navy' | 'amber' | 'green' | 'cyan' | 'slate'

export type DivisionDef = {
  slug: string
  name: string
  description: string
  icon: DivisionIcon
  accent: DivisionAccent
  categoryEquals?: string[]
  productIncludes?: string[]
  catchAll?: boolean
}

export type StoreDivision = DivisionDef & {
  count: number
  image: string | null
  categoryIds: string[]
  products: CatalogProduct[]
}

const TRANSPORT_CATEGORY = 'transport service'

export const DIVISION_DEFS: DivisionDef[] = [
  {
    slug: 'dental-equipment',
    name: 'Dental Equipment',
    description: 'Dental chairs and clinical equipment for oral health facilities.',
    icon: 'smile',
    accent: 'cyan',
    productIncludes: ['dental'],
  },
  {
    slug: 'maternity-obstetrics',
    name: 'Maternity & Obstetrics',
    description: 'Delivery beds, infant warmers, fetal monitoring and obstetric procedure sets.',
    icon: 'baby',
    accent: 'rose',
    productIncludes: [
      'radiant warmer',
      'phototherapy',
      'delivery',
      'fetal',
      'ctg',
      'penguin sucker',
      'mva',
      'vaccum aspiration',
      'vacuum aspiration',
      'cs set',
      'baby cot',
      'infant',
      'speculum',
    ],
  },
  {
    slug: 'theatre-surgical',
    name: 'Theatre & Surgical Equipment',
    description: 'Operating tables, theatre lights, autoclaves, electrosurgical units and surgical sets.',
    icon: 'scissors',
    accent: 'indigo',
    productIncludes: [
      'operating table',
      'theatre light',
      'theatre lights',
      'mayo trolley',
      'diathermy',
      'electrosurgical',
      'anesthesia',
      'anaesthesia',
      'kick bucket',
      'surgical',
      'stitching set',
      'gauze drum',
      'autoclave',
      'suction machine',
      'yankquer',
      'yankauer',
    ],
  },
  {
    slug: 'hospital-furniture',
    name: 'Hospital Furniture',
    description: 'Patient beds, trolleys, cabinets, screens and mobility aids for wards and clinics.',
    icon: 'bed',
    accent: 'slate',
    productIncludes: [
      'bed',
      'mattress',
      'bedside cabinet',
      'trolley',
      'drip stand',
      'ward screen',
      'commode',
      'wheelchair',
      'crutch',
      'crutches',
      'walker',
      'examination couch',
      'stretcher',
      'overbed',
    ],
  },
  {
    slug: 'glucometers-hb',
    name: 'Glucometers & Hb Machines',
    description: 'Blood glucose and haemoglobin testing devices for clinics and wards.',
    icon: 'droplet',
    accent: 'green',
    categoryEquals: ['glucometers & hb machines', 'glucometers & haemoglobin machines'],
  },
  {
    slug: 'rapid-diagnostic-kits',
    name: 'Rapid Diagnostic Kits',
    description: 'Point-of-care kits for fast screening and clinical decision support.',
    icon: 'test-tube',
    accent: 'teal',
    categoryEquals: ['rapid diagnostic kits'],
  },
  {
    slug: 'serology-kits',
    name: 'Serology Kits',
    description: 'Serology reagents and kits for laboratory diagnostic work.',
    icon: 'test-tube',
    accent: 'teal',
    categoryEquals: ['serology kits'],
  },
  {
    slug: 'lab-chemicals',
    name: 'Lab Chemicals',
    description: 'Laboratory chemicals and reagents for routine and specialist testing.',
    icon: 'beaker',
    accent: 'amber',
    categoryEquals: ['lab chemicals', 'laboratory chemicals'],
  },
  {
    slug: 'lab-consumables',
    name: 'Lab Consumables',
    description: 'Everyday laboratory consumables, tips, tubes, slides and disposables.',
    icon: 'package',
    accent: 'sky',
    categoryEquals: ['lab consumables', 'lab division'],
  },
  {
    slug: 'laboratory',
    name: 'Laboratory Division',
    description: 'Analysers, microscopes, centrifuges and core laboratory equipment.',
    icon: 'flask',
    accent: 'teal',
    categoryEquals: ['laboratory equipment', 'laboratory division'],
    productIncludes: [
      'microscope',
      'analyzer',
      'analyser',
      'centrifuge',
      'incubator',
      'waterbath',
      'water bath',
      'elisa',
      'hematology',
      'haematology',
      'immunoassay',
      'biosafety',
      'co-agulation',
      'coagulation',
      'esr analyzer',
      'urine analyzer',
      'blood ban',
      'lab fridge',
      'lab dry oven',
      'orbital shaker',
      'roller mixer',
    ],
  },
  {
    slug: 'medical-equipment',
    name: 'Medical Equipment',
    description: 'Diagnostic, emergency and ward equipment for hospitals and clinics.',
    icon: 'stethoscope',
    accent: 'navy',
    categoryEquals: ['medical equipment division', 'medical equipment'],
    catchAll: true,
  },
]

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function includesAny(haystack: string, needles: string[] = []) {
  return needles.some((needle) => haystack.includes(needle))
}

function isTransport(name: string) {
  return normalize(name) === TRANSPORT_CATEGORY || normalize(name).includes('transport service')
}

export function divisionHref(slug: string) {
  return `/divisions/${slug}`
}

export function matchDivisionSlug(product: CatalogProduct, defs: DivisionDef[] = DIVISION_DEFS): string | null {
  const category = normalize(product.categoryName)
  const name = normalize(product.name)
  if (isTransport(category) || isTransport(name)) return null

  for (const def of defs) {
    if (def.catchAll) continue
    if (def.categoryEquals?.some((item) => normalize(item) === category)) return def.slug
  }
  for (const def of defs) {
    if (includesAny(name, def.productIncludes)) return def.slug
  }
  for (const def of defs) {
    if (def.catchAll && def.categoryEquals?.some((item) => normalize(item) === category)) return def.slug
  }
  return null
}

export function buildStoreDivisions(catalog: Catalog): StoreDivision[] {
  const extras = new Map<string, CatalogProduct[]>()
  const grouped = new Map<string, CatalogProduct[]>()

  for (const product of catalog.products) {
    const slug = matchDivisionSlug(product)
    if (!slug) {
      const fallback = slugifyName(product.categoryName) || 'other-supplies'
      const list = extras.get(fallback) || []
      list.push(product)
      extras.set(fallback, list)
      continue
    }
    const list = grouped.get(slug) || []
    list.push(product)
    grouped.set(slug, list)
  }

  const fromDefs: StoreDivision[] = DIVISION_DEFS.map((def) => {
    const products = grouped.get(def.slug) || []
    return {
      ...def,
      products,
      count: products.length,
      categoryIds: [...new Set(products.map((product) => product.categoryId).filter(Boolean))],
      image: products.find((product) => product.image)?.image || null,
    }
  }).filter((division) => division.count > 0)

  const knownNames = new Set(DIVISION_DEFS.map((def) => normalize(def.name)))
  const extraDivisions: StoreDivision[] = []
  for (const [slug, products] of extras) {
    const name = products[0]?.categoryName || 'More supplies'
    if (knownNames.has(normalize(name)) || isTransport(name)) continue
    extraDivisions.push({
      slug,
      name,
      description: `Products in ${name} currently listed with Tarumed.`,
      icon: 'grid',
      accent: 'slate',
      products,
      count: products.length,
      categoryIds: [...new Set(products.map((product) => product.categoryId).filter(Boolean))],
      image: products.find((product) => product.image)?.image || null,
    })
  }

  return [...fromDefs, ...extraDivisions].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getDivision(catalog: Catalog, slug: string): StoreDivision | null {
  return buildStoreDivisions(catalog).find((division) => division.slug === slug) || null
}

export function divisionCoverSrc(division: Pick<StoreDivision, 'image'>) {
  return division.image || productImageSrc({ image: null })
}
