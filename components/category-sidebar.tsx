'use client'

import type { CatalogCategory } from '@/lib/catalog'

export function CategorySidebar({
  categories,
  totalCount,
  activeId = '',
  onSelect,
}: {
  categories: CatalogCategory[]
  totalCount: number
  activeId?: string
  onSelect: (id: string | null) => void
}) {
  const items = categories.filter((category) => category.count > 0)
  if (!items.length) return null

  return (
    <aside className="category-sidebar" aria-label="Product categories">
      <div className="category-sidebar-head">
        <p className="kicker">Browse</p>
        <h3>Categories</h3>
      </div>
      <nav className="category-sidebar-list">
        <button
          type="button"
          className={!activeId ? 'category-nav-item active' : 'category-nav-item'}
          onClick={() => onSelect(null)}
        >
          <span>All products</span>
          <small>{totalCount}</small>
        </button>
        {items.map((item) => (
          <button
            key={item._id}
            type="button"
            className={activeId === item._id ? 'category-nav-item active' : 'category-nav-item'}
            onClick={() => onSelect(item._id)}
          >
            <span>{item.name}</span>
            <small>{item.count}</small>
          </button>
        ))}
      </nav>
    </aside>
  )
}
