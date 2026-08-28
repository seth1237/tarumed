'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatKes, type CatalogProduct } from '@/lib/catalog'
import { COMPANY } from '@/lib/utils'
import { ProductShare } from '@/components/product-share'
import { useQuoteCart } from '@/components/quote-cart'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function whatsappHref(product: CatalogProduct) {
  const text = `Hello Tarumed, I would like a quote for ${product.name} (${product.categoryName}).`
  return `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(text)}`
}

export function QuoteForm({ product }: { product: CatalogProduct }) {
  const [mode, setMode] = useState<'choose' | 'system'>('choose')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { add, has } = useQuoteCart()
  const inCart = has(product.id)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setStatus('sending')
    setMessage('')
    try {
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: data.get('clientName'),
          clientNumber: data.get('clientNumber'),
          clientLocation: data.get('clientLocation'),
          contactPerson: data.get('contactPerson'),
          email: data.get('email'),
          items: [{
            productId: product.id,
            quantity: Number(data.get('quantity') || 1),
            unitPrice: product.price,
          }],
        }),
      })
      const payload = await response.json()
      if (!response.ok || payload.success === false) {
        throw new Error(payload.message || 'Quote request failed')
      }
      setStatus('sent')
      setMessage('Quote request sent. Our team will follow up shortly.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Quote request failed')
    }
  }

  if (mode === 'choose') {
    return (
      <div className="quote-form compact">
        <div className="quote-form-head">
          <h2>Request a quote</h2>
          <p>{product.name} · {product.categoryName}</p>
        </div>
        <div className="quote-options">
          <button type="button" className={inCart ? 'button button-outline button-compact' : 'button button-primary button-compact'} onClick={() => add(product)}>
            {inCart ? 'Added to quote cart' : 'Add to quote cart'}
          </button>
          <Link href="/quote" className="button button-outline button-compact">View quote cart</Link>
          <a className="wa-button" href={whatsappHref(product)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Ask on WhatsApp
          </a>
          <button type="button" className="button button-outline button-compact" onClick={() => setMode('system')}>
            Request from the system
          </button>
          <ProductShare product={product} />
        </div>
      </div>
    )
  }

  return (
    <form className="quote-form compact" onSubmit={onSubmit}>
      <div className="quote-form-head">
        <button type="button" className="text-link" onClick={() => setMode('choose')}>
          <ArrowLeft size={14} /> Back to options
        </button>
        <h2>Request from the system</h2>
        <p>{product.name} · {formatKes(product.price)}</p>
      </div>
      <label>Facility / company<input name="clientName" required placeholder="Hospital or clinic name" /></label>
      <label>Contact person<input name="contactPerson" placeholder="Your name" /></label>
      <label>Phone<input name="clientNumber" required placeholder="+254 7.." /></label>
      <label>Email<input name="email" type="email" placeholder="you@hospital.co.ke" /></label>
      <label>Location<input name="clientLocation" required placeholder="Eldoret, Kenya" /></label>
      <label>Quantity<input name="quantity" type="number" min={1} max={1000} defaultValue={1} /></label>
      <button className="button button-primary button-compact" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send quote request'}
      </button>
      {message && <p className={status === 'error' ? 'form-error' : 'form-success'}>{message}</p>}
    </form>
  )
}
