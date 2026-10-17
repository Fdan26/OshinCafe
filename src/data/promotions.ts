import { useEffect, useState } from 'react'

export type PromoKind = 'percent' | 'fixed'
export type PromoTheme = 'gold' | 'noir' | 'cream'

export interface Promotion {
  id: string
  title: string
  subtitle: string
  code: string
  kind: PromoKind
  value: number
  minSpend: number
  validUntil: string // YYYY-MM-DD, valid through the end of that day
  theme: PromoTheme
  active: boolean
  redemptions: number
}

const STORAGE_KEY = 'oshin.promotions.v1'

function daysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function toISODate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const SEED: Promotion[] = [
  { id: 'p1', title: 'Golden Hour', subtitle: 'Every handcrafted drink, 3–5 PM daily', code: 'GOLDEN20', kind: 'percent', value: 20, minSpend: 0, validUntil: daysFromNow(14), theme: 'gold', active: true, redemptions: 128 },
  { id: 'p2', title: 'Weekend Brunch', subtitle: 'Toast, eggs and a coffee for two', code: 'BRUNCH10', kind: 'fixed', value: 10, minSpend: 50, validUntil: daysFromNow(9), theme: 'noir', active: true, redemptions: 46 },
  { id: 'p3', title: 'First Visit', subtitle: 'A welcome from the Oshin team', code: 'HELLO15', kind: 'percent', value: 15, minSpend: 20, validUntil: daysFromNow(60), theme: 'cream', active: true, redemptions: 212 },
  { id: 'p4', title: 'Monsoon Warmers', subtitle: 'Hot drinks for rainy afternoons', code: 'RAINY5', kind: 'fixed', value: 5, minSpend: 25, validUntil: daysFromNow(-3), theme: 'noir', active: true, redemptions: 87 },
]

function load(): Promotion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Promotion[]
  } catch {
    // Storage unavailable or corrupt; fall back to the seed data
  }
  return SEED
}

/** Promotions shared by the customer and staff apps, persisted on this device. */
export function usePromotions() {
  const [promos, setPromos] = useState<Promotion[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(promos))
    } catch {
      // Ignore: promotions still work for this session
    }
  }, [promos])

  // Keep two open tabs (e.g. customer + staff on the web demo) in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPromos(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = (promo: Promotion) =>
    setPromos(prev => (prev.some(p => p.id === promo.id) ? prev.map(p => (p.id === promo.id ? promo : p)) : [promo, ...prev]))
  const remove = (id: string) => setPromos(prev => prev.filter(p => p.id !== id))
  const toggle = (id: string) => setPromos(prev => prev.map(p => (p.id === id ? { ...p, active: !p.active } : p)))
  const redeem = (id: string) => setPromos(prev => prev.map(p => (p.id === id ? { ...p, redemptions: p.redemptions + 1 } : p)))

  return { promos, save, remove, toggle, redeem }
}

export function isExpired(p: Promotion, now = new Date()) {
  return p.validUntil < toISODate(now)
}

export function isLive(p: Promotion) {
  return p.active && !isExpired(p)
}

export function promoValueLabel(p: Pick<Promotion, 'kind' | 'value'>) {
  return p.kind === 'percent' ? `${p.value}%` : `RM${p.value}`
}

export function formatEnds(validUntil: string) {
  const d = new Date(`${validUntil}T00:00:00`)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function daysLeft(validUntil: string) {
  const end = new Date(`${validUntil}T23:59:59`).getTime()
  return Math.ceil((end - Date.now()) / 86_400_000)
}

/** Discount in RM for a subtotal, or 0 when the promo doesn't apply. */
export function promoDiscount(p: Promotion | null, subtotal: number) {
  if (!p || !isLive(p) || subtotal < p.minSpend) return 0
  const raw = p.kind === 'percent' ? (subtotal * p.value) / 100 : p.value
  return Math.round(Math.min(raw, subtotal) * 100) / 100
}

export function newPromoCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'OSHIN' + Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}
