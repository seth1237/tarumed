const PLACEHOLDER = '/product-placeholder.svg'

export function isPlaceholderSrc(src: string | null | undefined) {
  if (!src) return true
  return src.includes('product-placeholder') || src.endsWith('.svg')
}

export function optimizedMediaUrl(src: string | null | undefined, width = 800) {
  if (!src) return PLACEHOLDER
  if (src.startsWith('/') || src.startsWith('data:')) return src
  const marker = '/image/upload/'
  const at = src.indexOf(marker)
  if (at === -1) return src
  const rest = src.slice(at + marker.length)
  if (/(^|\/)f_auto,/.test(rest) || rest.startsWith('f_auto')) return src
  return `${src.slice(0, at + marker.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`
}
