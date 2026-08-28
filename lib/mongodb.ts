import 'server-only'
import { MongoClient, type Collection, type Db } from 'mongodb'

type MongoState = {
  client: MongoClient | null
  db: Db | null
  indexVersion: number
}

const MONGO_INDEX_VERSION = 2

const globalForMongo = globalThis as typeof globalThis & { __tarumedMongo?: MongoState }

function mongoState(): MongoState {
  if (!globalForMongo.__tarumedMongo) {
    globalForMongo.__tarumedMongo = { client: null, db: null, indexVersion: 0 }
  }
  if (typeof globalForMongo.__tarumedMongo.indexVersion !== 'number') {
    globalForMongo.__tarumedMongo.indexVersion = 0
  }
  return globalForMongo.__tarumedMongo
}

function resetMongo() {
  const state = mongoState()
  state.client = null
  state.db = null
  state.indexVersion = 0
}

function isMongoClosed(error: unknown) {
  const name = error && typeof error === 'object' && 'name' in error ? String((error as { name?: string }).name) : ''
  const message = error instanceof Error ? error.message : String(error || '')
  return name === 'MongoTopologyClosedError' || message.includes('Topology is closed')
}

async function withMongo<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (!isMongoClosed(error)) throw error
    const state = mongoState()
    try {
      await state.client?.close()
    } catch {}
    resetMongo()
    return await operation()
  }
}

export type ProductImage = {
  publicId: string
  secureUrl: string
}

export type ProductContent = {
  _id?: string
  erpProductId: string
  details: string
  images: ProductImage[]
  updatedAt: Date
}

export type AdminUser = {
  _id?: string
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export type SiteSettings = {
  _id: string
  showPrices: boolean
  updatedAt: Date
}

export type ContactMessage = {
  _id?: string
  name: string
  email: string
  phone: string
  location?: string
  message: string
  createdAt: Date
}

export type ProductPerformance = {
  _id?: string
  erpProductId: string
  productName: string
  categoryId: string
  categoryName: string
  clicks: number
  shares: number
  lastClickedAt: Date
  lastSharedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type ProductJourney = {
  fromProductId: string
  toProductId: string
  count: number
  updatedAt: Date
  createdAt: Date
}

export type ProductMetrics = {
  clicks: number
  shares: number
}

export type CategoryPerformance = {
  categoryId: string
  categoryName: string
  clicks: number
  shares: number
  productsClicked: number
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI)
}

async function getDatabase(): Promise<Db> {
  const state = mongoState()
  if (state.db) return state.db
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB_NAME || 'tarumed'
  if (!uri) throw new Error('MONGODB_URI is not configured')

  if (!state.client) {
    const isDev = process.env.NODE_ENV !== 'production'
    state.client = new MongoClient(uri, {
      serverSelectionTimeoutMS: isDev ? 2500 : 8000,
      connectTimeoutMS: isDev ? 2500 : 8000,
    })
    await state.client.connect()
  }

  state.db = state.client.db(dbName)
  return state.db
}

export async function getCollection<T>(name: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(name)
}

export async function ensureIndexes(): Promise<void> {
  const state = mongoState()
  if (!isMongoConfigured() || state.indexVersion >= MONGO_INDEX_VERSION) return
  const db = await getDatabase()
  await db.collection('product_content').createIndex({ erpProductId: 1 }, { unique: true })
  await db.collection('product_images').createIndex({ erpProductId: 1 }, { unique: true })
  await db.collection('admins').createIndex({ email: 1 }, { unique: true })
  await db.collection('product_performance').createIndex({ erpProductId: 1 }, { unique: true })
  await db.collection('product_performance').createIndex({ clicks: -1 })
  await db.collection('product_performance').createIndex({ shares: -1 })
  await db.collection('product_performance').createIndex({ categoryId: 1, clicks: -1 })
  await db.collection('product_performance').createIndex({ lastClickedAt: -1 })
  await db.collection('product_journeys').createIndex({ fromProductId: 1, toProductId: 1 }, { unique: true })
  await db.collection('product_journeys').createIndex({ fromProductId: 1, count: -1 })
  state.indexVersion = MONGO_INDEX_VERSION
}

export async function getProductContentMap(): Promise<Map<string, ProductContent>> {
  if (!isMongoConfigured()) return new Map()
  return withMongo(async () => {
    await ensureIndexes()
    const content = await getCollection<ProductContent>('product_content')
    const legacy = await getCollection<{ erpProductId: string; publicId?: string; secureUrl?: string }>('product_images')
    const map = new Map<string, ProductContent>()
    for (const doc of await content.find({}).toArray()) map.set(doc.erpProductId, doc)
    for (const old of await legacy.find({}).toArray()) {
      if (map.has(old.erpProductId) || !old.secureUrl) continue
      map.set(old.erpProductId, {
        erpProductId: old.erpProductId,
        details: '',
        images: old.publicId ? [{ publicId: old.publicId, secureUrl: old.secureUrl }] : [],
        updatedAt: new Date(),
      })
    }
    return map
  })
}

export async function addProductImage(erpProductId: string, image: ProductImage): Promise<ProductContent> {
  await ensureIndexes()
  const collection = await getCollection<ProductContent>('product_content')
  await collection.updateOne(
    { erpProductId },
    {
      $setOnInsert: { erpProductId, details: '' },
      $push: { images: image },
      $set: { updatedAt: new Date() },
    },
    { upsert: true },
  )
  const doc = await collection.findOne({ erpProductId })
  return doc as ProductContent
}

export async function removeProductImage(erpProductId: string, publicId: string): Promise<ProductImage | null> {
  const collection = await getCollection<ProductContent>('product_content')
  const existing = await collection.findOne({ erpProductId })
  const image = existing?.images.find((item) => item.publicId === publicId) || null
  if (!image) return null
  await collection.updateOne({ erpProductId }, { $pull: { images: { publicId } }, $set: { updatedAt: new Date() } })
  return image
}

export async function updateProductDetails(erpProductId: string, details: string): Promise<ProductContent> {
  await ensureIndexes()
  const collection = await getCollection<ProductContent>('product_content')
  await collection.updateOne(
    { erpProductId },
    {
      $set: { details, updatedAt: new Date() },
      $setOnInsert: { erpProductId, images: [] },
    },
    { upsert: true },
  )
  return (await collection.findOne({ erpProductId })) as ProductContent
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const collection = await getCollection<AdminUser>('admins')
  return collection.findOne({ email: email.trim().toLowerCase() })
}

export async function countAdmins(): Promise<number> {
  const collection = await getCollection<AdminUser>('admins')
  return collection.countDocuments()
}

export async function updateAdminEmail(fromEmail: string, toEmail: string): Promise<void> {
  const collection = await getCollection<AdminUser>('admins')
  await collection.updateOne(
    { email: fromEmail.trim().toLowerCase() },
    { $set: { email: toEmail.trim().toLowerCase(), updatedAt: new Date() } },
  )
}

export async function createAdmin(admin: Omit<AdminUser, 'createdAt' | 'updatedAt'>): Promise<AdminUser> {
  await ensureIndexes()
  const collection = await getCollection<AdminUser>('admins')
  const doc: AdminUser = {
    ...admin,
    email: admin.email.trim().toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await collection.insertOne(doc)
  return doc
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isMongoConfigured()) return { _id: 'default', showPrices: true, updatedAt: new Date() }
  const collection = await getCollection<SiteSettings>('site_settings')
  const settings = await collection.findOne({ _id: 'default' })
  if (settings) return settings
  const defaults: SiteSettings = { _id: 'default', showPrices: true, updatedAt: new Date() }
  await collection.updateOne({ _id: 'default' }, { $set: defaults }, { upsert: true })
  return defaults
}

export async function updateSiteSettings(updates: Partial<Pick<SiteSettings, 'showPrices'>>): Promise<SiteSettings> {
  const collection = await getCollection<SiteSettings>('site_settings')
  const next = { ...updates, updatedAt: new Date() }
  await collection.updateOne({ _id: 'default' }, { $set: next }, { upsert: true })
  return getSiteSettings()
}

export async function createContactMessage(message: Omit<ContactMessage, '_id' | 'createdAt'>): Promise<void> {
  const collection = await getCollection<ContactMessage>('contact_messages')
  await collection.insertOne({ ...message, createdAt: new Date() })
}

export async function recordProductClick(input: {
  erpProductId: string
  productName: string
  categoryId: string
  categoryName: string
  fromProductId?: string
}): Promise<void> {
  if (!isMongoConfigured()) return
  await withMongo(async () => {
    await ensureIndexes()
    const now = new Date()
    const collection = await getCollection<ProductPerformance>('product_performance')
    await collection.updateOne(
      { erpProductId: input.erpProductId },
      {
        $inc: { clicks: 1 },
        $set: {
          productName: input.productName,
          categoryId: input.categoryId,
          categoryName: input.categoryName,
          lastClickedAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          erpProductId: input.erpProductId,
          shares: 0,
          createdAt: now,
        },
      },
      { upsert: true },
    )
    if (input.fromProductId && input.fromProductId !== input.erpProductId) {
      const journeys = await getCollection<ProductJourney>('product_journeys')
      await journeys.updateOne(
        { fromProductId: input.fromProductId, toProductId: input.erpProductId },
        {
          $inc: { count: 1 },
          $set: { updatedAt: now },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true },
      )
    }
  })
}

export async function recordProductShare(input: {
  erpProductId: string
  productName: string
  categoryId: string
  categoryName: string
}): Promise<void> {
  if (!isMongoConfigured()) return
  await withMongo(async () => {
    await ensureIndexes()
    const now = new Date()
    const collection = await getCollection<ProductPerformance>('product_performance')
    await collection.updateOne(
      { erpProductId: input.erpProductId },
      {
        $inc: { shares: 1 },
        $set: {
          productName: input.productName,
          categoryId: input.categoryId,
          categoryName: input.categoryName,
          lastSharedAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          erpProductId: input.erpProductId,
          clicks: 0,
          createdAt: now,
        },
      },
      { upsert: true },
    )
  })
}

export async function getProductMetricsMap(): Promise<Map<string, ProductMetrics>> {
  if (!isMongoConfigured()) return new Map()
  return withMongo(async () => {
    await ensureIndexes()
    const collection = await getCollection<ProductPerformance>('product_performance')
    const map = new Map<string, ProductMetrics>()
    for (const doc of await collection.find({}, { projection: { erpProductId: 1, clicks: 1, shares: 1 } }).toArray()) {
      map.set(doc.erpProductId, { clicks: Number(doc.clicks) || 0, shares: Number(doc.shares) || 0 })
    }
    return map
  })
}

export async function getProductClickMap(): Promise<Map<string, number>> {
  const metrics = await getProductMetricsMap()
  const map = new Map<string, number>()
  for (const [id, value] of metrics) map.set(id, value.clicks)
  return map
}

export async function getRelatedProductIds(fromProductId: string, limit = 8): Promise<string[]> {
  if (!isMongoConfigured() || !fromProductId) return []
  return withMongo(async () => {
    await ensureIndexes()
    const journeys = await getCollection<ProductJourney>('product_journeys')
    const rows = await journeys.find({ fromProductId }).sort({ count: -1 }).limit(limit).toArray()
    return rows.map((row) => row.toProductId)
  })
}

export async function getCategoryPerformance(): Promise<CategoryPerformance[]> {
  if (!isMongoConfigured()) return []
  return withMongo(async () => {
    await ensureIndexes()
    const collection = await getCollection<ProductPerformance>('product_performance')
    return collection.aggregate<CategoryPerformance>([
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $last: '$categoryName' },
          clicks: { $sum: '$clicks' },
          shares: { $sum: { $ifNull: ['$shares', 0] } },
          productsClicked: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: 1,
          clicks: 1,
          shares: 1,
          productsClicked: 1,
        },
      },
      { $sort: { clicks: -1 } },
    ]).toArray()
  })
}
