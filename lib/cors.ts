export const CORS_ORIGINS = [
  'https://tarumed-three.vercel.app',
  'https://tarumed.co.ke',
  'https://www.tarumed.co.ke',
  'http://localhost:3000',
]

export function corsOrigin(origin: string | null) {
  if (!origin) return ''
  return CORS_ORIGINS.includes(origin.replace(/\/$/, '')) ? origin.replace(/\/$/, '') : ''
}

export function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Org-Id',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  } as const
}
