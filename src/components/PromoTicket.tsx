import type { ReactNode } from 'react'
import { daysLeft, formatEnds, isExpired, promoValueLabel, type Promotion, type PromoTheme } from '@/data/promotions'

export const PROMO_THEMES: Record<PromoTheme, {
  name: string
  stub: string
  stubText: string
  body: string
  border: string
  title: string
  sub: string
  accent: string
  perf: string
}> = {
  gold: {
    name: 'Gold',
    stub: 'radial-gradient(120% 90% at 20% 10%, #F6D78F 0%, #E2B24F 45%, #B98A2E 100%)',
    stubText: '#140F00',
    body: '#17140C',
    border: 'rgba(226,178,79,0.28)',
    title: '#FFF6DB',
    sub: 'rgba(255,246,219,0.58)',
    accent: '#E2B24F',
    perf: 'rgba(226,178,79,0.35)',
  },
  noir: {
    name: 'Noir',
    stub: 'linear-gradient(160deg, #2A2A2A 0%, #0B0B0B 100%)',
    stubText: '#E2B24F',
    body: '#121212',
    border: 'rgba(255,255,255,0.08)',
    title: '#FFFFFF',
    sub: 'rgba(255,255,255,0.52)',
    accent: '#E2B24F',
    perf: 'rgba(255,255,255,0.16)',
  },
  cream: {
    name: 'Cream',
    stub: 'linear-gradient(160deg, #F5E9CB 0%, #E3CF9C 100%)',
    stubText: '#3B2A00',
    body: '#FFFBF1',
    border: 'rgba(59,42,0,0.12)',
    title: '#2A1F05',
    sub: 'rgba(42,31,5,0.58)',
    accent: '#9A6B00',
    perf: 'rgba(59,42,0,0.22)',
  },
}

const STUB_W = 96
const NOTCH = 16

export function endsLabel(validUntil: string) {
  const left = daysLeft(validUntil)
  if (left < 0) return 'Expired'
  if (left === 0) return 'Ends today'
  if (left <= 7) return `${left} day${left === 1 ? '' : 's'} left`
  return `Until ${formatEnds(validUntil)}`
}

/** Voucher-style card for a promotion. `cutout` must match the page background so the notches read as holes. */
export default function PromoTicket({ promo, cutout, action, dimmed }: {
  promo: Promotion
  cutout: string
  action?: ReactNode
  dimmed?: boolean
}) {
  const t = PROMO_THEMES[promo.theme]
  const expired = isExpired(promo)
  const value = promoValueLabel(promo)

  return (
    <div
      style={{
        position: 'relative', display: 'flex', minHeight: 118, borderRadius: 18, overflow: 'hidden',
        background: t.body, border: `1px solid ${t.border}`,
        boxShadow: '0 14px 30px -18px rgba(0,0,0,0.55)',
        opacity: dimmed ? 0.5 : 1, filter: dimmed ? 'grayscale(0.6)' : 'none', transition: 'opacity 0.2s',
      }}
    >
      {/* Stub */}
      <div style={{ width: STUB_W, flexShrink: 0, background: t.stub, color: t.stubText, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 6px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: value.length > 4 ? 26 : 32, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 9, letterSpacing: '0.32em', marginTop: 6, opacity: 0.75, paddingLeft: '0.32em' }}>OFF</div>
      </div>

      {/* Perforation + notches */}
      <div style={{ position: 'absolute', left: STUB_W, top: NOTCH, bottom: NOTCH, borderLeft: `1.5px dashed ${t.perf}` }} />
      <div style={{ position: 'absolute', left: STUB_W - NOTCH / 2, top: -NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: '50%', background: cutout, boxShadow: `inset 0 -1px 0 ${t.border}` }} />
      <div style={{ position: 'absolute', left: STUB_W - NOTCH / 2, bottom: -NOTCH / 2, width: NOTCH, height: NOTCH, borderRadius: '50%', background: cutout, boxShadow: `inset 0 1px 0 ${t.border}` }} />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, padding: '14px 16px 14px 18px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: expired ? '#E5484D' : t.accent, marginBottom: 5 }}>
          {endsLabel(promo.validUntil)}{promo.minSpend > 0 ? ` · Min RM${promo.minSpend}` : ''}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, lineHeight: 1.2, letterSpacing: '-0.01em', color: t.title, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {promo.title || 'Untitled offer'}
        </div>
        <div style={{ fontSize: 11.5, lineHeight: 1.45, color: t.sub, marginTop: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {promo.subtitle}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: t.title, border: `1px dashed ${t.perf}`, borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
            {promo.code || '—'}
          </span>
          {action}
        </div>
      </div>
    </div>
  )
}
