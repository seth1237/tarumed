import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { cookies } from 'next/headers'
import { countAdmins, createAdmin, getAdminByEmail, isMongoConfigured, updateAdminEmail } from '@/lib/mongodb'

const scryptAsync = promisify(scrypt)
export const ADMIN_COOKIE = 'tarumed_admin'
const SESSION_DAYS = 7

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'tarumed-dev-secret'
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const derived = (await scryptAsync(password, salt, 64)) as Buffer
  const storedBuf = Buffer.from(hash, 'hex')
  if (storedBuf.length !== derived.length) return false
  return timingSafeEqual(storedBuf, derived)
}

function signValue(value: string) {
  const hmac = createHmac('sha256', sessionSecret()).update(value).digest('base64url')
  return `${value}.${hmac}`
}

function verifySignedValue(token: string) {
  const split = token.lastIndexOf('.')
  if (split <= 0) return null
  const value = token.slice(0, split)
  const sig = token.slice(split + 1)
  const expected = createHmac('sha256', sessionSecret()).update(value).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  return value
}

export async function ensureSeedAdmin() {
  if (!isMongoConfigured()) return
  const email = (process.env.ADMIN_EMAIL || 'info@tarumed.co.ke').trim().toLowerCase()
  const existing = await getAdminByEmail(email)
  if (!existing) {
    for (const legacyEmail of ['admin@tarumed.co.ke', 'admin@tarumed.com']) {
      const legacy = await getAdminByEmail(legacyEmail)
      if (legacy) {
        await updateAdminEmail(legacyEmail, email)
        break
      }
    }
  }
  const count = await countAdmins()
  if (count > 0) return
  const password = process.env.ADMIN_PASSWORD
  if (!password) return
  await createAdmin({
    email,
    name: 'Tarumed Admin',
    passwordHash: await hashPassword(password),
  })
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureSeedAdmin()
  const admin = await getAdminByEmail(email)
  if (!admin) return null
  const ok = await verifyPassword(password, admin.passwordHash)
  if (!ok) return null
  return { email: admin.email, name: admin.name }
}

export async function setAdminSession(email: string) {
  const payload = Buffer.from(JSON.stringify({
    email,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  })).toString('base64url')
  const store = await cookies()
  store.set(ADMIN_COOKIE, signValue(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return null
  const payload = verifySignedValue(token)
  if (!payload) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email?: string; exp?: number }
    if (!data.email || !data.exp || data.exp < Date.now()) return null
    return { email: data.email }
  } catch {
    return null
  }
}
