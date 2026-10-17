import { useState, type CSSProperties, type ReactNode } from 'react'
import logoImg from '@/imports/image.png_202607281008.jpeg'
import PromoTicket, { endsLabel } from './PromoTicket'
import Icon, { type IconName } from '@/ui/Icon'
import useIsDesktop from '@/ui/useIsDesktop'
import { isExpired, isLive, promoDiscount, promoValueLabel, usePromotions, type Promotion } from '@/data/promotions'

type Tab = 'home' | 'menu' | 'offers' | 'cart' | 'reserve' | 'rewards'
type MenuCat = 'coffee' | 'cold' | 'food' | 'desserts'
type OrderType = 'dine' | 'takeaway' | 'delivery'

interface MenuItem {
  id: number
  name: string
  desc: string
  price: number
  image: string
  popular?: boolean
  tag?: string
}

interface CartItem {
  item: MenuItem
  qty: number
}

const C = {
  bg: '#0C0B0A',
  surface: '#14120F',
  card: '#1A1714',
  raised: '#24201B',
  line: 'rgba(246,239,228,0.08)',
  lineStrong: 'rgba(246,239,228,0.16)',
  text: '#F6EFE4',
  dim: 'rgba(246,239,228,0.64)',
  faint: 'rgba(246,239,228,0.4)',
  gold: '#E2B24F',
  goldSoft: 'rgba(226,178,79,0.12)',
  goldLine: 'rgba(226,178,79,0.3)',
  onGold: '#1A1308',
  green: '#8CC096',
  red: '#E58A73',
}

const F = { display: 'var(--font-display)', ui: 'var(--font-ui)', mono: 'var(--font-mono)' }

const eyebrow: CSSProperties = { fontFamily: F.ui, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.faint }
const title: CSSProperties = { fontFamily: F.display, fontWeight: 500, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1.05, color: C.text, margin: 0 }

const ALL_ITEMS: Record<MenuCat, MenuItem[]> = {
  coffee: [
    { id: 1, name: 'Signature Latte', desc: 'Smooth espresso & steamed milk', price: 14, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&auto=format', popular: true, tag: 'Best' },
    { id: 2, name: 'Caramel Macchiato', desc: 'Vanilla & caramel over espresso', price: 15, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop&auto=format' },
    { id: 3, name: 'Flat White', desc: 'Double ristretto & velvety milk', price: 13, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop&auto=format' },
    { id: 4, name: 'Oshin Special', desc: "Chef's secret blend, must try!", price: 17, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&auto=format', popular: true, tag: 'Special' },
  ],
  cold: [
    { id: 5, name: 'Vanilla Cold Brew', desc: 'Slow-steeped for 12 hours', price: 16, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&auto=format', popular: true, tag: 'Popular' },
    { id: 6, name: 'Iced Matcha Latte', desc: 'Japanese matcha, oat milk', price: 14, image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=400&fit=crop&auto=format' },
    { id: 7, name: 'Taro Bubble Tea', desc: 'Creamy taro & tapioca pearls', price: 15, image: 'https://images.unsplash.com/photo-1558857563-c0c85c5d7a56?w=400&h=400&fit=crop&auto=format', popular: true },
    { id: 8, name: 'Berry Smoothie', desc: 'Mixed berries & Greek yoghurt', price: 13, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400&h=400&fit=crop&auto=format' },
  ],
  food: [
    { id: 9, name: 'Avocado Toast', desc: 'Sourdough, feta & cherry tomato', price: 18, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop&auto=format', popular: true },
    { id: 10, name: 'Club Sandwich', desc: 'Grilled chicken, bacon & egg', price: 20, image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&h=400&fit=crop&auto=format' },
    { id: 11, name: 'Butter Croissant', desc: 'Freshly baked, flaky & golden', price: 8, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop&auto=format' },
    { id: 12, name: 'Eggs Benedict', desc: 'Poached eggs & hollandaise', price: 22, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=400&fit=crop&auto=format', popular: true },
  ],
  desserts: [
    { id: 13, name: 'Banana Cake', desc: 'Moist & warm with butter glaze', price: 9, image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=400&h=400&fit=crop&auto=format' },
    { id: 14, name: 'Tiramisu', desc: 'Classic Italian, mascarpone cream', price: 14, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop&auto=format', popular: true },
    { id: 15, name: 'Burnt Cheesecake', desc: 'San Sebastián style', price: 13, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop&auto=format', popular: true, tag: 'Trending' },
    { id: 16, name: 'Mango Panna Cotta', desc: 'Silky smooth, fresh mango', price: 11, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format' },
  ],
}

const BESTSELLERS: MenuItem[] = [ALL_ITEMS.coffee[3], ALL_ITEMS.cold[0], ALL_ITEMS.desserts[2], ALL_ITEMS.desserts[1]]

const TIMES = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '19:00', '19:30', '20:00']

const POINTS = 820

function nextDays(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })
}

const rm = (n: number) => `RM ${n.toFixed(2)}`

export default function CustomerApp() {
  const desktop = useIsDesktop()
  const [tab, setTab] = useState<Tab>('home')
  const [menuCat, setMenuCat] = useState<MenuCat>('coffee')
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<OrderType>('dine')
  const [lastOrder, setLastOrder] = useState<{ id: number; points: number } | null>(null)
  const { promos, redeem } = usePromotions()
  const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null)
  const appliedPromo = promos.find(p => p.id === appliedPromoId && isLive(p)) ?? null

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) return prev.map(c => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      return [...prev, { item, qty: 1 }]
    })
  }

  const changeQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => (c.item.id === id ? { ...c, qty: c.qty + delta } : c)).filter(c => c.qty > 0))
  }

  const applyPromo = (promo: Promotion) => {
    setAppliedPromoId(promo.id)
    setTab('cart')
  }

  // Returns an error message, or null when the code was applied
  const applyCode = (code: string) => {
    const promo = promos.find(p => p.code.toUpperCase() === code.trim().toUpperCase())
    if (!promo || !promo.active) return 'That code isn’t valid'
    if (isExpired(promo)) return 'That offer has ended'
    setAppliedPromoId(promo.id)
    return null
  }

  const placeOrder = (total: number) => {
    if (appliedPromo) redeem(appliedPromo.id)
    setAppliedPromoId(null)
    setLastOrder({ id: 1056 + Math.floor(Math.random() * 40), points: Math.round(total * 2) })
    setCart([])
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0)

  const navItems: { id: Tab; icon: IconName; label: string }[] = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'menu', icon: 'menu', label: 'Menu' },
    { id: 'offers', icon: 'offers', label: 'Offers' },
    { id: 'reserve', icon: 'calendar', label: 'Reserve' },
    { id: 'rewards', icon: 'star', label: 'Rewards' },
  ]

  const go = (t: Tab) => {
    if (t !== 'cart') setLastOrder(null)
    setTab(t)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, color: C.text, fontFamily: F.ui }}>
      {desktop && <TopBar tab={tab} items={navItems} cartCount={cartCount} cartTotal={cartTotal} go={go} />}

      {/* Keyed by tab so each screen opens scrolled to the top */}
      <div key={tab} className="no-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="screen" style={desktop ? { maxWidth: 1240, margin: '0 auto', padding: '8px 20px 56px' } : undefined}>
          {tab === 'home' && <HomeScreen featured={promos.find(isLive) ?? null} onAdd={addToCart} cart={cart} goTab={go} />}
          {tab === 'menu' && <MenuScreen cat={menuCat} setCat={setMenuCat} cart={cart} onAdd={addToCart} onRemove={id => changeQty(id, -1)} subtotal={cartTotal} goCart={() => go('cart')} />}
          {tab === 'offers' && <OffersScreen promos={promos} appliedId={appliedPromo?.id ?? null} onApply={applyPromo} />}
          {tab === 'cart' && (
            <CartScreen
              cart={cart} onChange={changeQty} orderType={orderType} setOrderType={setOrderType} subtotal={cartTotal}
              promo={appliedPromo} onApplyCode={applyCode} onRemovePromo={() => setAppliedPromoId(null)}
              lastOrder={lastOrder} onPlace={placeOrder} goTab={go}
            />
          )}
          {tab === 'reserve' && <ReserveScreen />}
          {tab === 'rewards' && <RewardsScreen />}
        </div>
      </div>

      {/* Floating order bar */}
      {!desktop && cartCount > 0 && tab !== 'cart' && (
        <div style={{ padding: '0 14px 10px', background: 'transparent', flexShrink: 0 }}>
          <button
            className="tap"
            onClick={() => go('cart')}
            style={{ width: '100%', height: 56, borderRadius: 18, border: 'none', cursor: 'pointer', background: C.text, color: C.bg, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', boxShadow: '0 18px 40px -16px rgba(0,0,0,0.8)' }}
          >
            <span style={{ position: 'relative' }}>
              <Icon name="bag" size={22} />
              <span className="num" style={{ position: 'absolute', top: -6, right: -8, minWidth: 17, height: 17, borderRadius: 99, background: C.gold, color: C.onGold, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{cartCount}</span>
            </span>
            <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1, textAlign: 'left', marginLeft: 4 }}>View order</span>
            <span className="num" style={{ fontWeight: 700, fontSize: 14.5 }}>{rm(cartTotal)}</span>
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      )}

      {/* Bottom navigation */}
      {!desktop && <nav style={{ display: 'flex', background: 'rgba(16,14,12,0.86)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)', borderTop: `1px solid ${C.line}`, paddingBottom: 'calc(var(--safe-bottom) + 10px)', flexShrink: 0 }}>
        {navItems.map(({ id, icon, label }) => {
          const active = tab === id
          return (
            <button key={id} className="tap" onClick={() => go(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '12px 0 2px', border: 'none', background: 'transparent', cursor: 'pointer', color: active ? C.gold : C.faint, position: 'relative' }}>
              {active && <span style={{ position: 'absolute', top: 0, width: 20, height: 2, borderRadius: 2, background: C.gold }} />}
              <Icon name={icon} size={22} stroke={active ? 1.8 : 1.5} />
              <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 600, letterSpacing: '0.02em' }}>{label}</span>
            </button>
          )
        })}
      </nav>}
    </div>
  )
}

/* ─── SHARED PIECES ─────────────────────────────────────────── */
function Header({ kicker, heading, right, onBack }: { kicker: string; heading: string; right?: ReactNode; onBack?: () => void }) {
  const desktop = useIsDesktop()
  return (
    <div style={{ padding: desktop ? '40px 20px 32px' : 'calc(var(--safe-top) + 22px) 20px 18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        {onBack && <IconButton icon="arrowLeft" onClick={onBack} label="Back" />}
        <div>
          <div style={{ ...eyebrow, marginBottom: 8 }}>{kicker}</div>
          <h1 style={{ ...title, fontSize: desktop ? 48 : 32 }}>{heading}</h1>
        </div>
      </div>
      {right}
    </div>
  )
}

function IconButton({ icon, onClick, label, dot }: { icon: IconName; onClick?: () => void; label: string; dot?: boolean }) {
  return (
    <button className="tap" onClick={onClick} aria-label={label} style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', border: `1px solid ${C.line}`, background: C.surface, color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
      <Icon name={icon} size={19} />
      {dot && <span style={{ position: 'absolute', top: 10, right: 11, width: 7, height: 7, borderRadius: '50%', background: C.gold, boxShadow: `0 0 0 2px ${C.surface}` }} />}
    </button>
  )
}

function SectionHead({ text, action, onAction }: { text: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 20px', marginBottom: 14 }}>
      <h2 style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', margin: 0, color: C.text }}>{text}</h2>
      {action && (
        <button className="tap" onClick={onAction} style={{ background: 'none', border: 'none', color: C.dim, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
          {action} <Icon name="arrowRight" size={14} />
        </button>
      )}
    </div>
  )
}

function PrimaryButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      className="tap" disabled={disabled} onClick={onClick}
      style={{ width: '100%', height: 56, borderRadius: 18, border: 'none', cursor: disabled ? 'default' : 'pointer', background: disabled ? C.raised : C.gold, color: disabled ? C.faint : C.onGold, fontWeight: 800, fontSize: 15, letterSpacing: '0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: disabled ? 'none' : '0 16px 32px -18px rgba(226,178,79,0.7)' }}
    >
      {children}
    </button>
  )
}

function GhostButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button className="tap" onClick={onClick} style={{ height: 48, padding: '0 24px', borderRadius: 16, border: `1px solid ${C.lineStrong}`, background: 'transparent', color: C.text, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
      {children}
    </button>
  )
}

function Stepper({ qty, onMinus, onPlus, solid }: { qty: number; onMinus: () => void; onPlus: () => void; solid?: boolean }) {
  const btn: CSSProperties = { width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: 2, borderRadius: 99, background: solid ? C.text : 'transparent', color: solid ? C.bg : C.text, border: solid ? 'none' : `1px solid ${C.lineStrong}`, boxShadow: solid ? '0 8px 18px -8px rgba(0,0,0,0.7)' : 'none' }}>
      <button className="tap" onClick={onMinus} aria-label="Remove one" style={btn}><Icon name="minus" size={15} stroke={2} /></button>
      <span className="num" style={{ minWidth: 16, textAlign: 'center', fontWeight: 800, fontSize: 13.5 }}>{qty}</span>
      <button className="tap" onClick={onPlus} aria-label="Add one" style={btn}><Icon name="plus" size={15} stroke={2} /></button>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onChange} style={{ width: 46, height: 28, borderRadius: 99, border: 'none', padding: 0, background: on ? C.gold : C.raised, position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%', background: on ? C.onGold : C.faint, transition: 'left 0.22s cubic-bezier(0.2,0.8,0.2,1)' }} />
    </button>
  )
}

function MemberCard({ large, onClick }: { large?: boolean; onClick?: () => void }) {
  const tier = POINTS >= 1000 ? 'Platinum' : POINTS >= 500 ? 'Gold' : 'Silver'
  const next = POINTS >= 1000 ? null : POINTS >= 500 ? { name: 'Platinum', need: 1000 } : { name: 'Gold', need: 500 }
  const progress = next ? (POINTS / next.need) * 100 : 100

  return (
    <div
      onClick={onClick}
      className={onClick ? 'tap' : undefined}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 24, padding: large ? '24px 22px 22px' : '20px 20px 18px', cursor: onClick ? 'pointer' : 'default',
        background: 'linear-gradient(135deg, #2E251A 0%, #17130E 52%, #2B2217 100%)', border: `1px solid ${C.goldLine}`,
        boxShadow: '0 30px 60px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,236,200,0.08)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, transparent 30%, rgba(255,230,180,0.07) 44%, transparent 58%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: F.display, fontSize: 14, letterSpacing: '0.34em', color: C.gold, fontWeight: 500 }}>OSHIN</span>
          <span style={{ ...eyebrow, color: 'rgba(226,178,79,0.8)', fontSize: 9.5 }}>{tier} member</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: large ? '26px 0 18px' : '18px 0 14px' }}>
          <span className="num" style={{ fontFamily: F.display, fontSize: large ? 52 : 40, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, color: C.text }}>{POINTS}</span>
          <span style={{ fontSize: 13, color: C.dim, fontWeight: 600 }}>points</span>
        </div>
        {next && (
          <>
            <div style={{ height: 3, borderRadius: 3, background: 'rgba(246,239,228,0.1)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, #B98A2E, ${C.gold})`, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: C.dim }}>
              <span className="num">{next.need - POINTS} points to {next.name}</span>
              {onClick ? <span style={{ color: C.gold, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>Redeem <Icon name="arrowRight" size={13} /></span> : <span className="num" style={{ fontFamily: F.mono, letterSpacing: '0.12em', color: C.faint }}>•••• 2048</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── DESKTOP TOP BAR ───────────────────────────────────────── */
function TopBar({ tab, items, cartCount, cartTotal, go }: {
  tab: Tab
  items: { id: Tab; icon: IconName; label: string }[]
  cartCount: number
  cartTotal: number
  go: (t: Tab) => void
}) {
  return (
    <header style={{ flexShrink: 0, borderBottom: `1px solid ${C.line}`, background: 'rgba(12,11,10,0.88)', backdropFilter: 'blur(20px) saturate(140%)', WebkitBackdropFilter: 'blur(20px) saturate(140%)', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', height: 78, display: 'flex', alignItems: 'center', gap: 36 }}>
        <button className="tap" onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <img src={logoImg} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.goldLine}`, padding: 2, boxSizing: 'border-box' }} />
          <span style={{ fontFamily: F.display, fontSize: 17, letterSpacing: '0.3em', color: C.gold }}>OSHIN</span>
        </button>
        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {items.map(({ id, label }) => {
            const active = tab === id
            return (
              <button key={id} className="tap" onClick={() => go(id)} style={{ height: 40, padding: '0 16px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${active ? C.line : 'transparent'}`, background: active ? C.surface : 'transparent', color: active ? C.text : C.dim, fontWeight: 600, fontSize: 14 }}>
                {label}
              </button>
            )
          })}
        </nav>
        <button
          className="tap"
          onClick={() => go('cart')}
          style={{ height: 46, padding: '0 20px 0 16px', borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, border: cartCount ? 'none' : `1px solid ${C.lineStrong}`, background: cartCount ? C.text : 'transparent', color: cartCount ? C.bg : C.text, fontWeight: 700, fontSize: 14 }}
        >
          <span style={{ position: 'relative' }}>
            <Icon name="bag" size={20} />
            {cartCount > 0 && <span className="num" style={{ position: 'absolute', top: -6, right: -8, minWidth: 16, height: 16, borderRadius: 99, background: C.gold, color: C.onGold, fontSize: 9.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{cartCount}</span>}
          </span>
          <span className="num">{cartCount ? rm(cartTotal) : 'Your order'}</span>
        </button>
      </div>
    </header>
  )
}

/* ─── HOME ──────────────────────────────────────────────────── */
function HomeScreen({ featured, onAdd, cart, goTab }: {
  featured: Promotion | null
  onAdd: (item: MenuItem) => void
  cart: CartItem[]
  goTab: (t: Tab) => void
}) {
  const desktop = useIsDesktop()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const special = ALL_ITEMS.coffee[3]
  const inCart = (id: number) => cart.find(c => c.item.id === id)?.qty ?? 0

  const hero = (
    <div style={{ borderRadius: 28, overflow: 'hidden', position: 'relative', height: desktop ? 520 : 340, boxShadow: '0 30px 60px -30px rgba(0,0,0,0.9)' }}>
      <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1400&h=1100&fit=crop&auto=format" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: desktop ? 'linear-gradient(90deg, rgba(12,11,10,0.92) 0%, rgba(12,11,10,0.55) 45%, rgba(12,11,10,0) 75%)' : 'linear-gradient(180deg, rgba(12,11,10,0.2) 0%, rgba(12,11,10,0) 28%, rgba(12,11,10,0.6) 58%, rgba(12,11,10,0.96) 100%)' }} />
      <span style={{ position: 'absolute', top: desktop ? 28 : 16, left: desktop ? 32 : 16, padding: '7px 12px', borderRadius: 99, background: 'rgba(12,11,10,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: `1px solid ${C.line}`, ...eyebrow, color: C.text, fontSize: 9.5 }}>
        Today’s special
      </span>
      <div style={desktop ? { position: 'absolute', left: 40, bottom: 44, maxWidth: 420 } : { position: 'absolute', left: 22, right: 22, bottom: 22 }}>
        <div style={{ fontFamily: F.display, fontSize: desktop ? 64 : 36, fontWeight: 400, letterSpacing: '-0.035em', lineHeight: 0.98 }}>{special.name}</div>
        <div style={{ fontSize: desktop ? 16 : 13.5, color: C.dim, marginTop: desktop ? 16 : 8, lineHeight: 1.55 }}>A house blend with notes of cacao and toasted caramel.</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: desktop ? 'flex-start' : 'space-between', gap: 24, marginTop: desktop ? 28 : 18 }}>
          <span className="num" style={{ fontFamily: F.display, fontSize: desktop ? 32 : 26, color: C.gold, letterSpacing: '-0.02em' }}>RM {special.price}</span>
          {inCart(special.id) ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: C.text }}>
              <Icon name="check" size={16} color={C.gold} stroke={2.2} /> {inCart(special.id)} in your order
            </span>
          ) : (
            <button className="tap" onClick={() => onAdd(special)} style={{ height: desktop ? 52 : 46, padding: '0 22px', borderRadius: 99, border: 'none', background: C.text, color: C.bg, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="plus" size={16} stroke={2.2} /> Add to order
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const quickActions = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {([
        { icon: 'bag', label: 'Order', tab: 'menu' },
        { icon: 'calendar', label: 'Reserve', tab: 'reserve' },
        { icon: 'star', label: 'Rewards', tab: 'rewards' },
        { icon: 'offers', label: 'Offers', tab: 'offers' },
      ] as const).map(a => (
        <button key={a.label} className="tap" onClick={() => goTab(a.tab)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, color: C.text }}>
          <span style={{ width: 58, height: 58, borderRadius: 20, border: `1px solid ${C.line}`, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold }}>
            <Icon name={a.icon} size={22} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.dim }}>{a.label}</span>
        </button>
      ))}
    </div>
  )

  const offer = featured && (
    <button className="tap" onClick={() => goTab('offers')} style={{ width: '100%', borderRadius: 20, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: `linear-gradient(100deg, ${C.goldSoft} 0%, rgba(226,178,79,0.02) 100%)`, border: `1px solid ${C.goldLine}`, color: C.text, textAlign: 'left' }}>
      <span className="num" style={{ fontFamily: F.display, fontSize: 30, color: C.gold, letterSpacing: '-0.03em', minWidth: 62 }}>{promoValueLabel(featured)}</span>
      <span style={{ width: 1, alignSelf: 'stretch', background: C.goldLine }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ ...eyebrow, display: 'block', color: 'rgba(226,178,79,0.85)', fontSize: 9.5, marginBottom: 4 }}>{endsLabel(featured.validUntil)}</span>
        <span style={{ display: 'block', fontFamily: F.display, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{featured.title}</span>
      </span>
      <Icon name="chevronRight" size={18} color={C.gold} />
    </button>
  )

  const bestsellerCard = (item: MenuItem) => (
    <div key={item.id} style={desktop ? undefined : { flexShrink: 0, width: 156 }}>
      <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', height: desktop ? 300 : 184, marginBottom: 12 }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, boxShadow: `inset 0 0 0 1px ${C.line}`, borderRadius: 22 }} />
        <button className="tap" onClick={() => onAdd(item)} aria-label={`Add ${item.name}`} style={{ position: 'absolute', right: 12, bottom: 12, width: 40, height: 40, borderRadius: '50%', border: 'none', background: C.text, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.6)' }}>
          {inCart(item.id) ? <span className="num" style={{ fontWeight: 800, fontSize: 13 }}>{inCart(item.id)}</span> : <Icon name="plus" size={17} stroke={2.2} />}
        </button>
      </div>
      <div style={{ fontSize: desktop ? 16 : 14.5, fontWeight: 700, marginBottom: 3, letterSpacing: '-0.005em' }}>{item.name}</div>
      <div className="num" style={{ fontSize: 13, color: C.dim }}>RM {item.price}</div>
    </div>
  )

  const greetingRow = (
    <div style={{ padding: desktop ? '36px 20px 28px' : 'calc(var(--safe-top) + 20px) 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ ...eyebrow, marginBottom: 6 }}>{greeting}</div>
        <div style={{ fontFamily: F.display, fontSize: desktop ? 40 : 26, fontWeight: 500, letterSpacing: '-0.025em' }}>{desktop ? 'Welcome back, Ahmad' : 'Ahmad Rizwan'}</div>
      </div>
      {!desktop && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconButton icon="bell" label="Notifications" dot />
          <img src={logoImg} alt="Oshin Cafe" style={{ width: 42, height: 42, borderRadius: '50%', border: `1px solid ${C.goldLine}`, padding: 2, boxSizing: 'border-box', objectFit: 'cover' }} />
        </div>
      )}
    </div>
  )

  if (desktop) {
    return (
      <div>
        {greetingRow}
        <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 20, padding: '0 20px', marginBottom: 56 }}>
          {hero}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MemberCard large onClick={() => goTab('rewards')} />
            {offer}
            <div style={{ flex: 1, borderRadius: 24, border: `1px solid ${C.line}`, background: C.surface, padding: '22px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {quickActions}
            </div>
          </div>
        </div>
        <SectionHead text="Bestsellers" action="Full menu" onAction={() => goTab('menu')} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, padding: '0 20px' }}>
          {BESTSELLERS.map(bestsellerCard)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      {greetingRow}
      <div style={{ margin: '0 20px 22px' }}>{hero}</div>
      <div style={{ padding: '0 20px', marginBottom: 24 }}>{quickActions}</div>
      {offer && <div style={{ margin: '0 20px 30px' }}>{offer}</div>}
      <SectionHead text="Bestsellers" action="Full menu" onAction={() => goTab('menu')} />
      <div className="no-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 14, padding: '0 20px 30px' }}>
        {BESTSELLERS.map(bestsellerCard)}
      </div>
      <div style={{ padding: '0 20px' }}>
        <MemberCard onClick={() => goTab('rewards')} />
      </div>
    </div>
  )
}

/* ─── MENU ──────────────────────────────────────────────────── */
function MenuScreen({ cat, setCat, cart, onAdd, onRemove, subtotal, goCart }: {
  cat: MenuCat
  setCat: (c: MenuCat) => void
  cart: CartItem[]
  onAdd: (item: MenuItem) => void
  onRemove: (id: number) => void
  subtotal: number
  goCart: () => void
}) {
  const desktop = useIsDesktop()
  const [query, setQuery] = useState('')
  const cats: { id: MenuCat; label: string; icon: IconName }[] = [
    { id: 'coffee', label: 'Coffee', icon: 'coffee' },
    { id: 'cold', label: 'Cold', icon: 'cold' },
    { id: 'food', label: 'Kitchen', icon: 'food' },
    { id: 'desserts', label: 'Sweets', icon: 'cake' },
  ]
  const q = query.trim().toLowerCase()
  const shown = q ? Object.values(ALL_ITEMS).flat().filter(i => `${i.name} ${i.desc}`.toLowerCase().includes(q)) : ALL_ITEMS[cat]
  const getQty = (id: number) => cart.find(c => c.item.id === id)?.qty ?? 0

  const search = (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, height: 48, borderRadius: 16, background: C.surface, border: `1px solid ${C.line}`, padding: '0 14px', color: C.faint, width: desktop ? 320 : undefined }}>
      <Icon name="search" size={18} />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search drinks & dishes" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: C.text, fontSize: 14 }} />
      {query && <button onClick={() => setQuery('')} aria-label="Clear" style={{ background: 'none', border: 'none', color: C.faint, cursor: 'pointer', padding: 0 }}><Icon name="close" size={16} /></button>}
    </label>
  )

  const items = (
    <div style={desktop ? { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 32 } : undefined}>
      {shown.map((item, i) => {
        const qty = getQty(item.id)
        const last = desktop ? i >= shown.length - (shown.length % 2 || 2) : i === shown.length - 1
        return (
          <div key={item.id} style={{ display: 'flex', gap: 16, padding: desktop ? '26px 0' : '20px 0', borderBottom: last ? 'none' : `1px solid ${C.line}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {item.tag && <div style={{ ...eyebrow, color: C.gold, fontSize: 9.5, marginBottom: 6 }}>{item.tag}</div>}
              <div style={{ fontFamily: F.display, fontSize: 19, fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{item.name}</div>
              <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.5, marginTop: 5 }}>{item.desc}</div>
              <div className="num" style={{ fontSize: 14.5, fontWeight: 700, marginTop: 10 }}>RM {item.price}</div>
            </div>
            <div style={{ position: 'relative', width: desktop ? 116 : 104, height: desktop ? 116 : 104, flexShrink: 0 }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
              <div style={{ position: 'absolute', left: '50%', bottom: -14, transform: 'translateX(-50%)' }}>
                {qty === 0 ? (
                  <button className="tap" onClick={() => onAdd(item)} aria-label={`Add ${item.name}`} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: C.text, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 18px -6px rgba(0,0,0,0.7)' }}>
                    <Icon name="plus" size={17} stroke={2.2} />
                  </button>
                ) : (
                  <Stepper solid qty={qty} onMinus={() => onRemove(item.id)} onPlus={() => onAdd(item)} />
                )}
              </div>
            </div>
          </div>
        )
      })}
      {shown.length === 0 && <div style={{ textAlign: 'center', color: C.dim, fontSize: 13.5, padding: '40px 0', gridColumn: '1 / -1' }}>Nothing matches “{query}”.</div>}
    </div>
  )

  const tabs = !q && (
    <div className="no-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: desktop ? 0 : '0 20px', marginBottom: 6 }}>
      {cats.map(({ id, label, icon }) => {
        const active = cat === id
        return (
          <button key={id} className="tap" onClick={() => setCat(id)} style={{ flexShrink: 0, height: 40, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${active ? C.text : C.line}`, background: active ? C.text : 'transparent', color: active ? C.bg : C.dim, fontWeight: 700, fontSize: 13 }}>
            <Icon name={icon} size={16} /> {label}
          </button>
        )
      })}
    </div>
  )

  if (desktop) {
    return (
      <div>
        <Header kicker="Crafted daily" heading="The Menu" right={search} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, padding: '0 20px', alignItems: 'start' }}>
          <div>
            {tabs}
            {q && <div style={{ ...eyebrow, padding: '6px 0 4px' }}>{shown.length} result{shown.length === 1 ? '' : 's'}</div>}
            {items}
          </div>
          <OrderPanel cart={cart} subtotal={subtotal} onAdd={onAdd} onRemove={onRemove} goCart={goCart} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <Header kicker="Crafted daily" heading="The Menu" />
      <div style={{ padding: '0 20px', marginBottom: 18 }}>{search}</div>
      {tabs}
      <div style={{ padding: '0 20px' }}>
        {q && <div style={{ ...eyebrow, padding: '6px 0 4px' }}>{shown.length} result{shown.length === 1 ? '' : 's'}</div>}
        {items}
      </div>
    </div>
  )
}

// Desktop-only: the order stays visible next to the menu
function OrderPanel({ cart, subtotal, onAdd, onRemove, goCart }: {
  cart: CartItem[]
  subtotal: number
  onAdd: (item: MenuItem) => void
  onRemove: (id: number) => void
  goCart: () => void
}) {
  return (
    <aside style={{ position: 'sticky', top: 8, borderRadius: 24, background: C.surface, border: `1px solid ${C.line}`, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontFamily: F.display, fontSize: 22, letterSpacing: '-0.02em' }}>Your order</div>
        <span className="num" style={{ fontSize: 12, color: C.faint }}>{cart.reduce((s, c) => s + c.qty, 0)} items</span>
      </div>
      {cart.length === 0 ? (
        <div style={{ padding: '36px 0 26px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.faint, margin: '0 auto 14px' }}><Icon name="bag" size={22} /></div>
          <div style={{ fontSize: 13, color: C.dim }}>Add something delicious to begin.</div>
        </div>
      ) : (
        <>
          <div style={{ margin: '8px 0 4px' }}>
            {cart.map(({ item, qty }, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < cart.length - 1 ? `1px solid ${C.line}` : 'none' }}>
                <img src={item.image} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                  <div className="num" style={{ fontSize: 12, color: C.dim }}>{rm(item.price * qty)}</div>
                </div>
                <Stepper qty={qty} onMinus={() => onRemove(item.id)} onPlus={() => onAdd(item)} />
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px dashed ${C.lineStrong}`, margin: '10px 0 16px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <span style={{ color: C.dim, fontSize: 13.5 }}>Subtotal</span>
            <span className="num" style={{ fontFamily: F.display, fontSize: 24 }}>{rm(subtotal)}</span>
          </div>
          <PrimaryButton onClick={goCart}>Checkout <Icon name="arrowRight" size={18} stroke={2} /></PrimaryButton>
        </>
      )}
    </aside>
  )
}

/* ─── CART ──────────────────────────────────────────────────── */
function CartScreen({ cart, onChange, orderType, setOrderType, subtotal, promo, onApplyCode, onRemovePromo, lastOrder, onPlace, goTab }: {
  cart: CartItem[]
  onChange: (id: number, delta: number) => void
  orderType: OrderType
  setOrderType: (t: OrderType) => void
  subtotal: number
  promo: Promotion | null
  onApplyCode: (code: string) => string | null
  onRemovePromo: () => void
  lastOrder: { id: number; points: number } | null
  onPlace: (total: number) => void
  goTab: (t: Tab) => void
}) {
  const desktop = useIsDesktop()
  const [usePoints, setUsePoints] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)

  const tax = Math.round(subtotal * 0.06 * 100) / 100
  const delivery = orderType === 'delivery' ? 5 : 0
  const promoOff = promoDiscount(promo, subtotal)
  const promoShortfall = promo && subtotal < promo.minSpend ? promo.minSpend - subtotal : 0
  const pointsDiscount = usePoints ? Math.min(POINTS * 0.01, subtotal * 0.2) : 0
  const total = Math.max(0, subtotal + tax + delivery - promoOff - pointsDiscount)

  const submitCode = () => {
    if (!code.trim()) return
    const error = onApplyCode(code)
    setCodeError(error)
    if (!error) setCode('')
  }

  if (lastOrder) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: desktop ? '96px 28px 32px' : 'calc(var(--safe-top) + 70px) 28px 32px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', border: `1px solid ${C.goldLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, background: `radial-gradient(circle, ${C.goldSoft} 0%, transparent 70%)` }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.gold, color: C.onGold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={30} stroke={2.2} />
          </div>
        </div>
        <div style={{ ...eyebrow, marginBottom: 10 }}>Order #{lastOrder.id}</div>
        <h1 style={{ ...title, fontSize: 34 }}>Thank you</h1>
        <p style={{ color: C.dim, fontSize: 14, lineHeight: 1.6, margin: '12px 0 28px', maxWidth: 280 }}>We’ve started on your order. We’ll let you know the moment it’s ready.</p>
        <div style={{ width: '100%', borderRadius: 20, border: `1px solid ${C.line}`, background: C.surface, display: 'grid', gridTemplateColumns: '1fr 1px 1fr', marginBottom: 28 }}>
          {[['Ready in', '15–20 min'], null, ['Points earned', `+${lastOrder.points}`]].map((cell, i) =>
            cell ? (
              <div key={i} style={{ padding: '18px 12px' }}>
                <div style={{ ...eyebrow, fontSize: 9.5, marginBottom: 6 }}>{cell[0]}</div>
                <div className="num" style={{ fontFamily: F.display, fontSize: 22, color: i === 2 ? C.gold : C.text }}>{cell[1]}</div>
              </div>
            ) : <div key={i} style={{ background: C.line }} />,
          )}
        </div>
        <GhostButton onClick={() => goTab('home')}>Back to home</GhostButton>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div>
        <Header kicker="Review" heading="Your Order" onBack={() => goTab('menu')} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 32px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.faint, marginBottom: 20 }}>
            <Icon name="bag" size={28} />
          </div>
          <div style={{ fontFamily: F.display, fontSize: 22, marginBottom: 8 }}>Nothing here yet</div>
          <div style={{ fontSize: 13.5, color: C.dim, marginBottom: 24 }}>Your order is waiting for its first cup.</div>
          <GhostButton onClick={() => goTab('menu')}>Browse the menu</GhostButton>
        </div>
      </div>
    )
  }

  const orderTypes: { id: OrderType; label: string; icon: IconName }[] = [
    { id: 'dine', label: 'Dine-in', icon: 'dine' },
    { id: 'takeaway', label: 'Pick-up', icon: 'takeaway' },
    { id: 'delivery', label: 'Delivery', icon: 'delivery' },
  ]

  const summary: [string, string, string?][] = [
    ['Subtotal', rm(subtotal)],
    ['SST (6%)', rm(tax)],
    ...(delivery ? [['Delivery', rm(delivery)] as [string, string]] : []),
    ...(promoOff ? [['Promo', `−${rm(promoOff)}`, C.green] as [string, string, string]] : []),
    ...(pointsDiscount ? [['Points', `−${rm(pointsDiscount)}`, C.green] as [string, string, string]] : []),
  ]

  const itemsBlock = (
    <div>
      <div style={{ display: 'flex', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 4, gap: 4, marginBottom: 12 }}>
        {orderTypes.map(t => {
          const active = orderType === t.id
          return (
            <button key={t.id} className="tap" onClick={() => setOrderType(t.id)} style={{ flex: 1, height: 44, borderRadius: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: active ? C.raised : 'transparent', color: active ? C.text : C.faint, fontWeight: 700, fontSize: 12.5, boxShadow: active ? `inset 0 0 0 1px ${C.lineStrong}` : 'none' }}>
              <Icon name={t.icon} size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      {cart.map(({ item, qty }, i) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: desktop ? '20px 0' : '16px 0', borderBottom: i < cart.length - 1 ? `1px solid ${C.line}` : 'none' }}>
          <img src={item.image} alt={item.name} style={{ width: desktop ? 76 : 62, height: desktop ? 76 : 62, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.display, fontSize: desktop ? 19 : 16.5, letterSpacing: '-0.01em', marginBottom: 4 }}>{item.name}</div>
            <div className="num" style={{ fontSize: 13, color: C.dim }}>{desktop ? `${item.desc} · ` : ''}{rm(item.price * qty)}</div>
          </div>
          <Stepper qty={qty} onMinus={() => onChange(item.id, -1)} onPlus={() => onChange(item.id, 1)} />
        </div>
      ))}
    </div>
  )

  const checkoutBlock = (
    <div>
      <div style={{ marginTop: desktop ? 0 : 18, borderRadius: 20, padding: 16, background: C.surface, border: `1px solid ${promo ? C.goldLine : C.line}` }}>
        {promo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.goldSoft, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="tag" size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{promo.title} · {promoValueLabel(promo)}</div>
              <div className="num" style={{ fontSize: 12, color: promoShortfall ? C.gold : C.dim, marginTop: 2 }}>
                {promoShortfall ? `Add ${rm(promoShortfall)} more to unlock` : `${promo.code} applied · you save ${rm(promoOff)}`}
              </div>
            </div>
            <button className="tap" onClick={onRemovePromo} aria-label="Remove promo" style={{ width: 32, height: 32, borderRadius: '50%', border: `1px solid ${C.line}`, background: 'transparent', color: C.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="close" size={14} />
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(null) }}
                onKeyDown={e => e.key === 'Enter' && submitCode()}
                placeholder="Promo code"
                style={{ flex: 1, minWidth: 0, height: 46, background: C.bg, border: `1px solid ${codeError ? C.red : C.line}`, borderRadius: 14, padding: '0 14px', color: C.text, fontSize: 13.5, letterSpacing: '0.12em', fontFamily: F.mono, outline: 'none' }}
              />
              <button className="tap" onClick={submitCode} style={{ height: 46, padding: '0 18px', borderRadius: 14, border: 'none', background: C.text, color: C.bg, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>Apply</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12 }}>
              <span style={{ color: codeError ? C.red : C.faint }}>{codeError ?? 'Have a code? Enter it above.'}</span>
              <button onClick={() => goTab('offers')} style={{ background: 'none', border: 'none', color: C.gold, fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 12 }}>See offers</button>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 12, borderRadius: 20, padding: '14px 16px', background: C.surface, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: C.raised, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="star" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Use Oshin points</div>
          <div className="num" style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>{POINTS} pts available · up to 20% off</div>
        </div>
        <Toggle on={usePoints} onChange={() => setUsePoints(!usePoints)} />
      </div>

      <div style={{ margin: '22px 0 22px', padding: '0 4px' }}>
        {summary.map(([label, val, color]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13.5 }}>
            <span style={{ color: C.dim }}>{label}</span>
            <span className="num" style={{ color: color ?? C.text, fontWeight: 600 }}>{val}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px dashed ${C.lineStrong}`, margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Total</span>
          <span className="num" style={{ fontFamily: F.display, fontSize: 30, letterSpacing: '-0.02em' }}>{rm(total)}</span>
        </div>
      </div>

      <PrimaryButton onClick={() => onPlace(total)}>
        Place order <Icon name="arrowRight" size={18} stroke={2} />
      </PrimaryButton>
    </div>
  )

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Review" heading="Your Order" onBack={() => goTab('menu')} />
      {desktop ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 48, padding: '0 20px', alignItems: 'start' }}>
          {itemsBlock}
          <div style={{ position: 'sticky', top: 8 }}>{checkoutBlock}</div>
        </div>
      ) : (
        <div style={{ padding: '0 20px' }}>
          {itemsBlock}
          {checkoutBlock}
        </div>
      )}
    </div>
  )
}

/* ─── RESERVE ───────────────────────────────────────────────── */
function ReserveScreen() {
  const desktop = useIsDesktop()
  const days = nextDays(desktop ? 14 : 7)
  const [dayIdx, setDayIdx] = useState(1)
  const [time, setTime] = useState('11:00')
  const [pax, setPax] = useState(2)
  const [note, setNote] = useState('')
  const [reserved, setReserved] = useState(false)
  const day = days[dayIdx]
  const longDate = day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const details = ([
    ['calendar', 'Date', longDate],
    ['clock', 'Time', time],
    ['users', 'Guests', `${pax} ${pax === 1 ? 'guest' : 'guests'}`],
  ] as const).map(([icon, label, value], i) => (
    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < 2 ? `1px solid ${C.line}` : 'none' }}>
      <Icon name={icon} size={19} color={C.gold} />
      <span style={{ fontSize: 13, color: C.dim, width: 64 }}>{label}</span>
      <span className="num" style={{ fontFamily: F.display, fontSize: 17 }}>{value}</span>
    </div>
  ))

  if (reserved) {
    return (
      <div style={{ padding: desktop ? '80px 20px 32px' : 'calc(var(--safe-top) + 60px) 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: C.gold, marginBottom: 12 }}>Reservation confirmed</div>
        <h1 style={{ ...title, fontSize: 34, marginBottom: 10 }}>See you soon</h1>
        <p style={{ color: C.dim, fontSize: 14, margin: '0 0 30px' }}>Your table is held for 15 minutes past arrival.</p>
        <div style={{ width: '100%', borderRadius: 24, border: `1px solid ${C.goldLine}`, background: 'linear-gradient(180deg, #1B1712 0%, #12100D 100%)', padding: '8px 20px', textAlign: 'left', marginBottom: 28 }}>
          {details}
        </div>
        <GhostButton onClick={() => setReserved(false)}>Done</GhostButton>
      </div>
    )
  }

  const form = (
    <div>
      <div style={{ ...eyebrow, marginBottom: 12 }}>{day.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</div>
      <div className="no-scroll" style={desktop ? { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 32 } : { display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px 28px', padding: '0 20px' }}>
        {days.map((d, i) => {
          const active = i === dayIdx
          return (
            <button key={i} className="tap" onClick={() => setDayIdx(i)} style={{ flexShrink: 0, width: desktop ? undefined : 56, height: 76, borderRadius: 18, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, border: `1px solid ${active ? C.text : C.line}`, background: active ? C.text : C.surface, color: active ? C.bg : C.text }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: active ? 0.7 : 0.5 }}>{i === 0 ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              <span className="num" style={{ fontFamily: F.display, fontSize: 22 }}>{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      <div style={{ ...eyebrow, marginBottom: 12 }}>Time</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${desktop ? 6 : 4}, 1fr)`, gap: 8, marginBottom: 28 }}>
        {TIMES.map(t => {
          const active = time === t
          return (
            <button key={t} className="tap num" onClick={() => setTime(t)} style={{ height: 44, borderRadius: 14, cursor: 'pointer', border: `1px solid ${active ? C.gold : C.line}`, background: active ? C.gold : 'transparent', color: active ? C.onGold : C.dim, fontWeight: 700, fontSize: 13.5 }}>
              {t}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderRadius: 20, background: C.surface, border: `1px solid ${C.line}`, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>Guests</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>Up to 12 per booking</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="tap" onClick={() => setPax(Math.max(1, pax - 1))} aria-label="Fewer guests" style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${C.lineStrong}`, background: 'transparent', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="minus" size={16} /></button>
          <span className="num" style={{ fontFamily: F.display, fontSize: 26, minWidth: 24, textAlign: 'center' }}>{pax}</span>
          <button className="tap" onClick={() => setPax(Math.min(12, pax + 1))} aria-label="More guests" style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${C.lineStrong}`, background: 'transparent', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="plus" size={16} /></button>
        </div>
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Special requests — a window seat, an anniversary…"
        rows={3}
        style={{ width: '100%', boxSizing: 'border-box', background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, padding: '16px 18px', color: C.text, fontSize: 13.5, lineHeight: 1.5, resize: 'none', outline: 'none', marginBottom: 22 }}
      />
    </div>
  )

  if (desktop) {
    return (
      <div>
        <Header kicker="Reserve" heading="Book a Table" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, padding: '0 20px', alignItems: 'start' }}>
          {form}
          <aside style={{ position: 'sticky', top: 8, borderRadius: 24, border: `1px solid ${C.goldLine}`, background: 'linear-gradient(180deg, #1B1712 0%, #12100D 100%)', padding: '22px 22px 22px' }}>
            <div style={{ ...eyebrow, color: C.gold }}>Your booking</div>
            <div style={{ margin: '6px 0 18px' }}>{details}</div>
            {note.trim() && <div style={{ fontSize: 12.5, color: C.dim, lineHeight: 1.5, padding: '12px 14px', borderRadius: 14, background: 'rgba(246,239,228,0.04)', marginBottom: 18 }}>“{note.trim()}”</div>}
            <PrimaryButton onClick={() => setReserved(true)}>Confirm reservation</PrimaryButton>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Reserve" heading="Book a Table" />
      <div style={{ padding: '0 20px' }}>
        {form}
        <PrimaryButton onClick={() => setReserved(true)}>
          Reserve · {day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {time}
        </PrimaryButton>
      </div>
    </div>
  )
}

/* ─── OFFERS ────────────────────────────────────────────────── */
function OffersScreen({ promos, appliedId, onApply }: {
  promos: Promotion[]
  appliedId: string | null
  onApply: (p: Promotion) => void
}) {
  const desktop = useIsDesktop()
  const live = promos.filter(isLive)
  const ended = promos.filter(p => p.active && isExpired(p))
  const [featured, ...rest] = live
  const grid = desktop ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 } : { display: 'flex', flexDirection: 'column' as const, gap: 12 }

  const applyButton = (p: Promotion) => {
    const applied = appliedId === p.id
    return (
      <button className="tap" onClick={() => onApply(p)} style={{ flexShrink: 0, height: 32, borderRadius: 99, padding: '0 14px', cursor: 'pointer', fontWeight: 800, fontSize: 11.5, background: applied ? 'transparent' : C.gold, color: applied ? C.gold : C.onGold, border: `1px solid ${C.gold}`, display: 'flex', alignItems: 'center', gap: 5 }}>
        {applied ? <><Icon name="check" size={13} stroke={2.4} /> Applied</> : 'Apply'}
      </button>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Oshin privileges" heading="Offers" />

      <div style={{ padding: '0 20px' }}>
        {!featured && (
          <div style={{ border: `1px dashed ${C.lineStrong}`, borderRadius: 24, padding: '44px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold, margin: '0 auto 16px' }}><Icon name="offers" size={24} /></div>
            <div style={{ fontFamily: F.display, fontSize: 20 }}>New offers are brewing</div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Check back soon — our team adds new ones often.</div>
          </div>
        )}

        {featured && (
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: desktop ? '40px 44px 36px' : '24px 22px 20px', marginBottom: desktop ? 44 : 30, background: 'radial-gradient(140% 120% at 100% 0%, rgba(226,178,79,0.24) 0%, rgba(226,178,79,0.05) 45%, #110F0B 100%)', border: `1px solid ${C.goldLine}`, boxShadow: '0 30px 60px -34px rgba(226,178,79,0.45)' }}>
            {(desktop ? [380, 280, 180] : [170, 124, 78]).map(size => (
              <div key={size} style={{ position: 'absolute', right: -size / 3, top: -size / 3, width: size, height: size, borderRadius: '50%', border: '1px solid rgba(226,178,79,0.14)' }} />
            ))}
            <div style={{ position: 'relative', display: desktop ? 'grid' : 'block', gridTemplateColumns: '1fr 1fr', alignItems: 'end', gap: 40 }}>
              <div>
                <div style={{ ...eyebrow, color: C.gold, fontSize: 9.5 }}>Featured · {endsLabel(featured.validUntil)}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '16px 0 10px' }}>
                  <span className="num" style={{ fontFamily: F.display, fontWeight: 400, fontSize: desktop ? 112 : 68, lineHeight: 0.9, letterSpacing: '-0.05em', background: 'linear-gradient(180deg, #F6D78F 0%, #E2B24F 60%, #B98A2E 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    {promoValueLabel(featured)}
                  </span>
                  <span style={{ ...eyebrow, color: C.dim }}>off</span>
                </div>
                <div style={{ fontFamily: F.display, fontSize: desktop ? 34 : 24, letterSpacing: '-0.02em' }}>{featured.title}</div>
                <div style={{ fontSize: desktop ? 15 : 13, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
                  {featured.subtitle}{featured.minSpend > 0 ? ` · Min. spend RM${featured.minSpend}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: desktop ? 0 : 20, paddingTop: desktop ? 0 : 16, borderTop: desktop ? 'none' : '1px dashed rgba(226,178,79,0.28)', ...(desktop ? { flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' } : {}) }}>
                <div style={desktop ? { textAlign: 'right', marginBottom: 12 } : undefined}>
                  <div style={{ ...eyebrow, fontSize: 9 }}>Code</div>
                  <div style={{ fontFamily: F.mono, fontSize: desktop ? 20 : 15, fontWeight: 600, letterSpacing: '0.16em', marginTop: 4 }}>{featured.code}</div>
                </div>
                {appliedId === featured.id ? applyButton(featured) : (
                  <button className="tap" onClick={() => onApply(featured)} style={{ height: desktop ? 52 : 46, padding: '0 26px', borderRadius: 99, border: 'none', background: C.gold, color: C.onGold, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                    Apply offer
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <>
            <ListLabel text="All offers" count={rest.length} />
            <div style={{ ...grid, marginBottom: 30 }}>
              {rest.map(p => <PromoTicket key={p.id} promo={p} cutout={C.bg} action={applyButton(p)} />)}
            </div>
          </>
        )}

        {ended.length > 0 && (
          <>
            <ListLabel text="Recently ended" count={ended.length} />
            <div style={grid}>
              {ended.map(p => <PromoTicket key={p.id} promo={p} cutout={C.bg} dimmed />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function ListLabel({ text, count }: { text: string; count: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={eyebrow}>{text}</span>
      <span style={{ flex: 1, height: 1, background: C.line }} />
      <span className="num" style={{ fontSize: 11.5, fontWeight: 700, color: C.faint }}>{count}</span>
    </div>
  )
}

/* ─── REWARDS ───────────────────────────────────────────────── */
function RewardsScreen() {
  const desktop = useIsDesktop()
  const [redeemed, setRedeemed] = useState<number[]>([])

  const rewards: { id: number; name: string; pts: number; icon: IconName; desc: string }[] = [
    { id: 1, name: 'Signature Latte', pts: 200, icon: 'coffee', desc: 'Any size, hot or iced' },
    { id: 2, name: '10% off', pts: 150, icon: 'tag', desc: 'On your next order' },
    { id: 3, name: 'A dessert', pts: 300, icon: 'cake', desc: 'Any from the counter' },
    { id: 4, name: 'Size upgrade', pts: 100, icon: 'upgrade', desc: 'Regular to large' },
    { id: 5, name: 'Brunch for two', pts: 1200, icon: 'gift', desc: 'Weekends only' },
  ]

  const history = [
    { date: 'Today', desc: 'Signature Latte, Croissant', pts: 35 },
    { date: 'Yesterday', desc: 'Avocado Toast, Cold Brew', pts: 34 },
    { date: '3 days ago', desc: 'Redeemed a coffee', pts: -200 },
    { date: '5 days ago', desc: 'Eggs Benedict', pts: 22 },
    { date: '1 week ago', desc: 'Oshin Special', pts: 17 },
  ]

  const rewardCards = rewards.map(r => {
    const can = POINTS >= r.pts
    const done = redeemed.includes(r.id)
    return (
      <div key={r.id} style={{ flexShrink: 0, width: desktop ? undefined : 172, borderRadius: 22, padding: 16, background: C.surface, border: `1px solid ${done ? C.goldLine : C.line}`, display: 'flex', flexDirection: 'column', opacity: can || done ? 1 : 0.55 }}>
        <div style={{ width: 42, height: 42, borderRadius: 14, background: C.goldSoft, color: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name={r.icon} size={20} />
        </div>
        <div style={{ fontFamily: F.display, fontSize: 17, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{r.name}</div>
        <div style={{ fontSize: 12, color: C.dim, marginTop: 4, marginBottom: 16 }}>{r.desc}</div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="num" style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>{r.pts} pts</span>
          <button
            className="tap" disabled={!can || done} onClick={() => setRedeemed([...redeemed, r.id])}
            style={{ height: 30, padding: '0 12px', borderRadius: 99, fontSize: 11.5, fontWeight: 800, cursor: can && !done ? 'pointer' : 'default', border: `1px solid ${done ? C.gold : can ? C.text : C.line}`, background: done ? 'transparent' : can ? C.text : 'transparent', color: done ? C.gold : can ? C.bg : C.faint, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {done ? <><Icon name="check" size={12} stroke={2.4} /> Done</> : can ? 'Redeem' : 'Locked'}
          </button>
        </div>
      </div>
    )
  })

  const activity = (
    <div style={{ padding: desktop ? 0 : '0 20px' }}>
      {history.map((h, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < history.length - 1 ? `1px solid ${C.line}` : 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: h.pts > 0 ? C.green : C.red, flexShrink: 0 }}>
            <Icon name={h.pts > 0 ? 'up' : 'down'} size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{h.desc}</div>
            <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{h.date}</div>
          </div>
          <div className="num" style={{ fontSize: 14, fontWeight: 700, color: h.pts > 0 ? C.green : C.red }}>{h.pts > 0 ? '+' : '−'}{Math.abs(h.pts)}</div>
        </div>
      ))}
    </div>
  )

  if (desktop) {
    return (
      <div>
        <Header kicker="Membership" heading="Rewards" />
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 40, padding: '0 20px', alignItems: 'start' }}>
          <div>
            <MemberCard large />
            <h2 style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', margin: '36px 0 8px' }}>Activity</h2>
            {activity}
          </div>
          <div>
            <h2 style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', margin: '0 0 14px' }}>Redeem</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>{rewardCards}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Membership" heading="Rewards" />
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <MemberCard large />
      </div>
      <SectionHead text="Redeem" />
      <div className="no-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 32px' }}>{rewardCards}</div>
      <SectionHead text="Activity" />
      {activity}
    </div>
  )
}
