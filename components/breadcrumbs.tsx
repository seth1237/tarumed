import Link from 'next/link'

export function Breadcrumbs({
  items,
}: {
  items: Array<{ href?: string; label: string }>
}) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`}>
              {item.href && !last ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
