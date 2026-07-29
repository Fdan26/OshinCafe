import { useState } from 'react'
import logoImg from '@/imports/image.png_202607281008.jpeg'

type Tab = 'home' | 'menu' | 'cart' | 'reserve' | 'rewards'
type MenuCat = 'coffee' | 'cold' | 'food' | 'desserts'

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
  brand: '#F5B800',
  brandDim: 'rgba(245,184,0,0.15)',
  bg: '#0A0A0A',
  surface: '#111111',
  card: '#1A1A1A',
  card2: '#232323',
  muted: '#6B6B6B',
  mutedLight: '#9A9A9A',
  white: '#FFFFFF',
  red: '#FF5252',
  green: '#4CAF50',
}

const ALL_ITEMS: Record<MenuCat, MenuItem[]> = {
  coffee: [
    { id: 1, name: 'Signature Latte', desc: 'Smooth espresso & steamed milk', price: 14, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300&h=300&fit=crop&auto=format', popular: true, tag: 'Best' },
    { id: 2, name: 'Caramel Macchiato', desc: 'Vanilla & caramel over espresso', price: 15, image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&h=300&fit=crop&auto=format' },
    { id: 3, name: 'Flat White', desc: 'Double ristretto & velvety milk', price: 13, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=300&h=300&fit=crop&auto=format' },
    { id: 4, name: 'Oshin Special', desc: "Chef's secret blend, must try!", price: 17, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop&auto=format', popular: true, tag: 'Special' },
  ],
  cold: [
    { id: 5, name: 'Vanilla Cold Brew', desc: 'Slow-steeped for 12 hours', price: 16, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop&auto=format', popular: true, tag: 'Popular' },
    { id: 6, name: 'Iced Matcha Latte', desc: 'Japanese matcha, oat milk', price: 14, image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=300&h=300&fit=crop&auto=format' },
    { id: 7, name: 'Taro Bubble Tea', desc: 'Creamy taro & tapioca pearls', price: 15, image: 'https://images.unsplash.com/photo-1558857563-c0c85c5d7a56?w=300&h=300&fit=crop&auto=format', popular: true },
    { id: 8, name: 'Berry Smoothie', desc: 'Mixed berries & Greek yoghurt', price: 13, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=300&h=300&fit=crop&auto=format' },
  ],
  food: [
    { id: 9, name: 'Avocado Toast', desc: 'Sourdough, feta & cherry tomato', price: 18, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&h=300&fit=crop&auto=format', popular: true },
    { id: 10, name: 'Club Sandwich', desc: 'Grilled chicken, bacon & egg', price: 20, image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=300&h=300&fit=crop&auto=format' },
    { id: 11, name: 'Butter Croissant', desc: 'Freshly baked, flaky & golden', price: 8, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop&auto=format' },
    { id: 12, name: 'Eggs Benedict', desc: 'Poached eggs & hollandaise', price: 22, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=300&h=300&fit=crop&auto=format', popular: true },
  ],
  desserts: [
    { id: 13, name: 'Banana Cake', desc: 'Moist & warm with butter glaze', price: 9, image: 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?w=300&h=300&fit=crop&auto=format' },
    { id: 14, name: 'Tiramisu', desc: 'Classic Italian, mascarpone cream', price: 14, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop&auto=format', popular: true },
    { id: 15, name: 'Burnt Cheesecake', desc: 'San Sebastián style', price: 13, image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop&auto=format', popular: true, tag: 'Trending' },
    { id: 16, name: 'Mango Panna Cotta', desc: 'Silky smooth, fresh mango', price: 11, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop&auto=format' },
  ],
}

const BESTSELLERS: MenuItem[] = [
  ALL_ITEMS.coffee[3],
  ALL_ITEMS.cold[0],
  ALL_ITEMS.desserts[2],
  ALL_ITEMS.desserts[1],
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DATES = [28, 29, 30, 31, 1, 2, 3]
const TIMES = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '19:00', '19:30', '20:00']

export default function CustomerApp() {
  const [tab, setTab] = useState<Tab>('home')
  const [menuCat, setMenuCat] = useState<MenuCat>('coffee')
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<'dine' | 'takeaway' | 'delivery'>('dine')
  const [selectedDay, setSelectedDay] = useState(2)
  const [selectedTime, setSelectedTime] = useState('11:00')
  const [pax, setPax] = useState(2)
  const [reserved, setReserved] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [points] = useState(820)

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id)
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      return [...prev, { item, qty: 1 }]
    })
    setTab('cart')
  }

  const changeQty = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.item.id === id ? { ...c, qty: c.qty + delta } : c)
        .filter(c => c.qty > 0)
    )
  }

  const cartCount = cart.reduce((s, c) => s + c.qty, 0)
  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0)
  const tax = Math.round(cartTotal * 0.06 * 100) / 100
  const delivery = orderType === 'delivery' ? 5 : 0
  const grandTotal = cartTotal + tax + delivery

  const navItems = [
    { id: 'home' as Tab, icon: '⌂', label: 'Home' },
    { id: 'menu' as Tab, icon: '☰', label: 'Menu' },
    { id: 'cart' as Tab, icon: '⊕', label: 'Order', badge: cartCount },
    { id: 'reserve' as Tab, icon: '◷', label: 'Reserve' },
    { id: 'rewards' as Tab, icon: '★', label: 'Rewards' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, color: C.white, fontFamily: "'Work Sans', sans-serif" }}>
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'home' && (
          <HomeScreen logo={logoImg} points={points} onAddToCart={addToCart} goTab={(t) => setTab(t as Tab)} />
        )}
        {tab === 'menu' && (
          <MenuScreen cat={menuCat} setCat={setMenuCat} items={ALL_ITEMS} cart={cart} onAdd={(item) => { addToCart(item); setTab('menu') }} onRemove={(id) => changeQty(id, -1)} goCart={() => setTab('cart')} cartCount={cartCount} />
        )}
        {tab === 'cart' && (
          <CartScreen cart={cart} onChange={changeQty} orderType={orderType} setOrderType={setOrderType} subtotal={cartTotal} tax={tax} delivery={delivery} total={grandTotal} ordered={ordered} setOrdered={setOrdered} points={points} />
        )}
        {tab === 'reserve' && (
          <ReserveScreen days={DAYS} dates={DATES} times={TIMES} selectedDay={selectedDay} setDay={setSelectedDay} selectedTime={selectedTime} setTime={setSelectedTime} pax={pax} setPax={setPax} reserved={reserved} setReserved={setReserved} />
        )}
        {tab === 'rewards' && (
          <RewardsScreen points={points} />
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{ display: 'flex', background: C.surface, borderTop: `1px solid rgba(255,255,255,0.06)`, paddingBottom: 20, flexShrink: 0 }}>
        {navItems.map(({ id, icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '10px 0 2px', border: 'none', background: 'transparent', cursor: 'pointer',
            }}
          >
            <div style={{ position: 'relative' }}>
              <span style={{ fontSize: 18, color: tab === id ? C.brand : C.muted, lineHeight: 1 }}>{icon}</span>
              {badge ? (
                <div style={{ position: 'absolute', top: -5, right: -8, background: C.brand, color: '#000', fontSize: 9, fontWeight: 800, borderRadius: 100, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito'" }}>
                  {badge}
                </div>
              ) : null}
            </div>
            <span style={{ fontSize: 10, color: tab === id ? C.brand : C.muted, fontWeight: tab === id ? 700 : 400, fontFamily: "'Nunito'" }}>{label}</span>
            {tab === id && <div style={{ width: 16, height: 2, borderRadius: 2, background: C.brand, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── HOME SCREEN ───────────────────────────────────────────── */
function HomeScreen({ logo, points, onAddToCart, goTab }: {
  logo: string
  points: number
  onAddToCart: (item: MenuItem) => void
  goTab: (t: string) => void
}) {
  return (
    <div style={{ background: C.bg, paddingBottom: 8 }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted }}>Good morning ☀️</div>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 19, color: C.white }}>Ahmad Rizwan</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
          <img src={logo} alt="Oshin Cafe" style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${C.brand}` }} />
        </div>
      </div>

      {/* Hero Card */}
      <div style={{ margin: '0 16px 16px', borderRadius: 20, overflow: 'hidden', position: 'relative', height: 170 }}>
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format"
          alt="Oshin Special"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ background: C.brand, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 7, fontFamily: "'Nunito'", letterSpacing: '0.08em' }}>TODAY'S SPECIAL</div>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 21, lineHeight: 1.15, marginBottom: 3 }}>Oshin Special</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 12 }}>Chef's secret blend, must-try!</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 19, color: C.brand }}>RM 17</span>
            <button
              onClick={() => onAddToCart(ALL_ITEMS.coffee[3])}
              style={{ background: C.brand, color: '#000', border: 'none', borderRadius: 100, padding: '7px 18px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { emoji: '🛒', label: 'Order Now', tab: 'cart', color: '#1C1400' },
          { emoji: '📅', label: 'Reserve', tab: 'reserve', color: '#001C10' },
          { emoji: '★', label: 'My Points', tab: 'rewards', color: '#1C0A00' },
          { emoji: '📋', label: 'Menu', tab: 'menu', color: '#0A001C' },
        ].map(({ emoji, label, tab, color }) => (
          <div
            key={tab}
            onClick={() => goTab(tab)}
            style={{ background: C.card, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 16, padding: '14px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color || C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{emoji}</div>
            <span style={{ fontSize: 10, fontFamily: "'Nunito'", fontWeight: 700, color: C.white, textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Bestsellers */}
      <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: C.white }}>Bestsellers</span>
        <span onClick={() => goTab('menu')} style={{ fontSize: 12, color: C.brand, cursor: 'pointer', fontFamily: "'Nunito'", fontWeight: 700 }}>See all →</span>
      </div>
      <div className="no-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 10, padding: '4px 16px 16px' }}>
        {BESTSELLERS.map(item => (
          <div key={item.id} style={{ flexShrink: 0, width: 130, background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.05)` }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: 80, objectFit: 'cover' }} />
            <div style={{ padding: '10px 10px 12px' }}>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 12, marginBottom: 6, lineHeight: 1.3 }}>{item.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: C.brand, fontWeight: 700, fontSize: 12, fontFamily: "'Nunito'" }}>RM {item.price}</span>
                <button
                  onClick={() => onAddToCart(item)}
                  style={{ background: C.brand, border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: '#000', fontWeight: 700, lineHeight: 1 }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Points Banner */}
      <div style={{ margin: '0 16px 8px', background: 'linear-gradient(120deg, #F5B800 0%, #D4A000 100%)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'rgba(0,0,0,0.55)', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.05em' }}>YOUR POINTS</div>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 30, color: '#0A0A0A', lineHeight: 1, margin: '2px 0' }}>{points}</div>
          <div style={{ color: 'rgba(0,0,0,0.55)', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 600 }}>Gold Member 🏅 · 180 pts to Platinum</div>
        </div>
        <button onClick={() => goTab('rewards')} style={{ background: '#0A0A0A', color: C.brand, border: 'none', borderRadius: 100, padding: '9px 16px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>Redeem</button>
      </div>
    </div>
  )
}

/* ─── MENU SCREEN ────────────────────────────────────────────── */
function MenuScreen({ cat, setCat, items, cart, onAdd, onRemove, goCart, cartCount }: {
  cat: MenuCat
  setCat: (c: MenuCat) => void
  items: Record<MenuCat, MenuItem[]>
  cart: CartItem[]
  onAdd: (item: MenuItem) => void
  onRemove: (id: number) => void
  goCart: () => void
  cartCount: number
}) {
  const cats: { id: MenuCat; label: string; emoji: string }[] = [
    { id: 'coffee', label: 'Coffee', emoji: '☕' },
    { id: 'cold', label: 'Cold Drinks', emoji: '🧊' },
    { id: 'food', label: 'Food', emoji: '🍽️' },
    { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  ]

  const getQty = (id: number) => cart.find(c => c.item.id === id)?.qty ?? 0

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 22, color: C.white }}>Menu</div>
        {cartCount > 0 && (
          <button onClick={goCart} style={{ background: C.brand, color: '#000', border: 'none', borderRadius: 100, padding: '7px 16px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
            View Cart ({cartCount})
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="no-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '0 16px 16px' }}>
        {cats.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => setCat(id)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
              background: cat === id ? C.brand : C.card,
              color: cat === id ? '#000' : C.mutedLight,
              fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13,
              transition: 'all 0.15s',
            }}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 16px' }}>
        {items[cat].map(item => {
          const qty = getQty(item.id)
          return (
            <div key={item.id} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid rgba(255,255,255,0.05)`, position: 'relative' }}>
              {item.tag && (
                <div style={{ position: 'absolute', top: 8, left: 8, background: C.brand, color: '#000', fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 100, fontFamily: "'Nunito'" }}>
                  {item.tag}
                </div>
              )}
              <img src={item.image} alt={item.name} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
              <div style={{ padding: '10px 10px 12px' }}>
                <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13, marginBottom: 3, lineHeight: 1.25 }}>{item.name}</div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 10, lineHeight: 1.4 }}>{item.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: C.brand, fontWeight: 800, fontSize: 14, fontFamily: "'Nunito'" }}>RM {item.price}</span>
                  {qty === 0 ? (
                    <button
                      onClick={() => onAdd(item)}
                      style={{ background: C.brand, border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer', color: '#000', fontWeight: 700, lineHeight: 1 }}
                    >
                      +
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => onRemove(item.id)} style={{ background: C.card2, border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: C.white, lineHeight: 1 }}>−</button>
                      <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 13, color: C.brand, minWidth: 14, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => onAdd(item)} style={{ background: C.brand, border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: '#000', lineHeight: 1, fontWeight: 700 }}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── CART SCREEN ────────────────────────────────────────────── */
function CartScreen({ cart, onChange, orderType, setOrderType, subtotal, tax, delivery, total, ordered, setOrdered, points }: {
  cart: CartItem[]
  onChange: (id: number, delta: number) => void
  orderType: 'dine' | 'takeaway' | 'delivery'
  setOrderType: (t: 'dine' | 'takeaway' | 'delivery') => void
  subtotal: number
  tax: number
  delivery: number
  total: number
  ordered: boolean
  setOrdered: (v: boolean) => void
  points: number
}) {
  const [usePoints, setUsePoints] = useState(false)
  const pointsDiscount = usePoints ? Math.min(points * 0.01, subtotal * 0.2) : 0
  const finalTotal = Math.max(0, total - pointsDiscount)

  if (ordered) {
    return (
      <div style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 24, marginBottom: 8, color: C.white }}>Order Placed!</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>Your order #1056 has been received</div>
        <div style={{ background: C.card, borderRadius: 12, padding: '10px 20px', marginBottom: 24 }}>
          <span style={{ color: C.brand, fontFamily: "'Nunito'", fontWeight: 800 }}>+{Math.round(finalTotal * 2)} pts earned! 🎉</span>
        </div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>Estimated time: <strong style={{ color: C.white }}>15–20 min</strong></div>
        <button onClick={() => setOrdered(false)} style={{ marginTop: 24, background: C.brand, color: '#000', border: 'none', borderRadius: 100, padding: '12px 32px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>Track Order</button>
      </div>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100%' }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 22, color: C.white }}>My Order</div>
      </div>

      {/* Order type */}
      <div style={{ margin: '0 16px 16px', display: 'flex', background: C.card, borderRadius: 14, padding: 4, gap: 4 }}>
        {(['dine', 'takeaway', 'delivery'] as const).map(t => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            style={{
              flex: 1, padding: '9px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: orderType === t ? C.brand : 'transparent',
              color: orderType === t ? '#000' : C.muted,
              fontFamily: "'Nunito'", fontWeight: 700, fontSize: 11,
              transition: 'all 0.15s',
            }}
          >
            {t === 'dine' ? '🍽 Dine-in' : t === 'takeaway' ? '🛍 Takeaway' : '🛵 Delivery'}
          </button>
        ))}
      </div>

      {/* Cart items */}
      {cart.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: C.muted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 16, marginBottom: 6, color: C.mutedLight }}>Your cart is empty</div>
          <div style={{ fontSize: 13 }}>Add items from the menu</div>
        </div>
      ) : (
        <div style={{ padding: '0 16px' }}>
          {cart.map(({ item, qty }) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
              <img src={item.image} alt={item.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{item.name}</div>
                <div style={{ color: C.brand, fontFamily: "'Nunito'", fontWeight: 800, fontSize: 13 }}>RM {(item.price * qty).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => onChange(item.id, -1)} style={{ background: C.card2, border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: C.white, lineHeight: 1 }}>−</button>
                <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => onChange(item.id, 1)} style={{ background: C.brand, border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: '#000', fontWeight: 700, lineHeight: 1 }}>+</button>
              </div>
            </div>
          ))}

          {/* Use points toggle */}
          <div style={{ margin: '16px 0', background: C.card, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13, color: C.white }}>Use Points</div>
              <div style={{ fontSize: 11, color: C.muted }}>You have {points} pts · Save RM {(points * 0.01).toFixed(2)}</div>
            </div>
            <div
              onClick={() => setUsePoints(!usePoints)}
              style={{ width: 44, height: 24, borderRadius: 100, background: usePoints ? C.brand : C.card2, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}
            >
              <div style={{ position: 'absolute', top: 3, left: usePoints ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: usePoints ? '#000' : C.muted, transition: 'left 0.2s' }} />
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: C.card, borderRadius: 16, padding: '16px', marginBottom: 16 }}>
            {[
              ['Subtotal', `RM ${subtotal.toFixed(2)}`],
              ['SST (6%)', `RM ${tax.toFixed(2)}`],
              ...(delivery ? [['Delivery', `RM ${delivery.toFixed(2)}`]] : []),
              ...(pointsDiscount ? [['Points Discount', `- RM ${pointsDiscount.toFixed(2)}`]] : []),
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
                <span style={{ fontSize: 13, color: label.includes('Discount') ? '#4CAF50' : C.white, fontFamily: "'Nunito'", fontWeight: 600 }}>{val}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: C.white }}>Total</span>
              <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 17, color: C.brand }}>RM {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setOrdered(true)}
            style={{ width: '100%', background: C.brand, color: '#000', border: 'none', borderRadius: 14, padding: '16px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: 'pointer', marginBottom: 8 }}
          >
            Place Order 🎉
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── RESERVE SCREEN ─────────────────────────────────────────── */
function ReserveScreen({ days, dates, times, selectedDay, setDay, selectedTime, setTime, pax, setPax, reserved, setReserved }: {
  days: string[]
  dates: number[]
  times: string[]
  selectedDay: number
  setDay: (n: number) => void
  selectedTime: string
  setTime: (t: string) => void
  pax: number
  setPax: (n: number) => void
  reserved: boolean
  setReserved: (v: boolean) => void
}) {
  const [note, setNote] = useState('')

  if (reserved) {
    return (
      <div style={{ background: C.bg, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 24, marginBottom: 8, color: C.white }}>Reserved!</div>
        <div style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Your table is confirmed</div>
        <div style={{ background: C.card, borderRadius: 16, padding: '20px 28px', marginBottom: 24, textAlign: 'left' }}>
          <div style={{ marginBottom: 10 }}><span style={{ color: C.muted, fontSize: 12 }}>Date</span><br /><span style={{ fontFamily: "'Nunito'", fontWeight: 800, color: C.white }}>{days[selectedDay]}, {dates[selectedDay]} Jul 2025</span></div>
          <div style={{ marginBottom: 10 }}><span style={{ color: C.muted, fontSize: 12 }}>Time</span><br /><span style={{ fontFamily: "'Nunito'", fontWeight: 800, color: C.white }}>{selectedTime}</span></div>
          <div><span style={{ color: C.muted, fontSize: 12 }}>Guests</span><br /><span style={{ fontFamily: "'Nunito'", fontWeight: 800, color: C.white }}>{pax} {pax === 1 ? 'person' : 'people'}</span></div>
        </div>
        <button onClick={() => setReserved(false)} style={{ background: C.brand, color: '#000', border: 'none', borderRadius: 100, padding: '12px 32px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>Done</button>
      </div>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100%', padding: '16px' }}>
      <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 22, color: C.white, marginBottom: 20 }}>Reserve a Table</div>

      <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.06em', marginBottom: 12 }}>SELECT DATE</div>
      <div className="no-scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20 }}>
        {days.map((day, i) => (
          <div
            key={i}
            onClick={() => setDay(i)}
            style={{
              flexShrink: 0, width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '10px 0', borderRadius: 14, cursor: 'pointer',
              background: selectedDay === i ? C.brand : C.card,
              border: `1px solid ${selectedDay === i ? C.brand : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <span style={{ fontSize: 10, color: selectedDay === i ? '#000' : C.muted, fontFamily: "'Nunito'", fontWeight: 700 }}>{day}</span>
            <span style={{ fontSize: 16, fontFamily: "'Nunito'", fontWeight: 900, color: selectedDay === i ? '#000' : C.white }}>{dates[i]}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.06em', marginBottom: 12 }}>SELECT TIME</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {times.map(t => (
          <button
            key={t}
            onClick={() => setTime(t)}
            style={{
              padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: selectedTime === t ? C.brand : C.card,
              color: selectedTime === t ? '#000' : C.mutedLight,
              fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13,
              transition: 'all 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.06em', marginBottom: 12 }}>NUMBER OF GUESTS</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <button onClick={() => setPax(Math.max(1, pax - 1))} style={{ width: 40, height: 40, borderRadius: 12, background: C.card, border: 'none', fontSize: 20, cursor: 'pointer', color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 28, color: C.white, minWidth: 32, textAlign: 'center' }}>{pax}</span>
        <button onClick={() => setPax(Math.min(12, pax + 1))} style={{ width: 40, height: 40, borderRadius: 12, background: C.card, border: 'none', fontSize: 20, cursor: 'pointer', color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
        <span style={{ color: C.muted, fontSize: 13 }}>{pax === 1 ? 'person' : 'people'}</span>
      </div>

      <div style={{ fontSize: 12, color: C.muted, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.06em', marginBottom: 12 }}>SPECIAL REQUESTS (OPTIONAL)</div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="e.g. Window seat, anniversary celebration..."
        style={{ width: '100%', background: C.card, border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 14, padding: '12px 14px', color: C.white, fontSize: 13, fontFamily: "'Work Sans'", resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
        rows={3}
      />

      <button
        onClick={() => setReserved(true)}
        style={{ width: '100%', background: C.brand, color: '#000', border: 'none', borderRadius: 14, padding: '16px', fontFamily: "'Nunito'", fontWeight: 900, fontSize: 16, cursor: 'pointer' }}
      >
        Book Now 📅
      </button>
    </div>
  )
}

/* ─── REWARDS SCREEN ─────────────────────────────────────────── */
function RewardsScreen({ points }: { points: number }) {
  const [redeemed, setRedeemed] = useState<number | null>(null)
  const tier = points >= 1000 ? 'Platinum' : points >= 500 ? 'Gold' : 'Silver'
  const nextTier = points >= 1000 ? null : points >= 500 ? { name: 'Platinum', need: 1000 } : { name: 'Gold', need: 500 }
  const progress = nextTier ? (points / nextTier.need) * 100 : 100

  const rewards = [
    { id: 1, name: 'Free Signature Latte', pts: 200, emoji: '☕', desc: 'Any size, hot or iced' },
    { id: 2, name: '10% Off Any Order', pts: 150, emoji: '🏷️', desc: 'Valid for one order' },
    { id: 3, name: 'Free Dessert', pts: 300, emoji: '🍰', desc: 'Choose any dessert' },
    { id: 4, name: 'Free Size Upgrade', pts: 100, emoji: '⬆️', desc: 'Upgrade to large' },
  ]

  const history = [
    { date: 'Today', desc: 'Ordered Signature Latte + Croissant', pts: +35 },
    { date: 'Yesterday', desc: 'Ordered Avo Toast + Cold Brew', pts: +34 },
    { date: '3 days ago', desc: 'Redeemed Free Coffee', pts: -200 },
    { date: '5 days ago', desc: 'Ordered Eggs Benedict', pts: +22 },
    { date: '1 week ago', desc: 'Ordered Oshin Special', pts: +17 },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100%', paddingBottom: 16 }}>
      {/* Points card */}
      <div style={{ margin: '16px 16px', background: 'linear-gradient(135deg, #1A1200 0%, #2A1D00 100%)', borderRadius: 20, padding: '24px', border: `1px solid rgba(245,184,0,0.3)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(245,184,0,0.08)' }} />
        <div style={{ position: 'absolute', top: 30, right: 20, fontSize: 48, opacity: 0.15 }}>★</div>
        <div style={{ fontSize: 11, color: C.brand, fontFamily: "'Nunito'", fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>YOUR OSHIN POINTS</div>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 48, color: C.brand, lineHeight: 1, marginBottom: 4 }}>{points}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ background: C.brand, color: '#000', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, fontFamily: "'Nunito'" }}>🏅 {tier} Member</div>
        </div>
        {nextTier && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.muted }}>{points} pts</span>
              <span style={{ fontSize: 11, color: C.muted }}>{nextTier.need} pts to {nextTier.name}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: C.brand, borderRadius: 100, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>{nextTier.need - points} pts to {nextTier.name}</div>
          </>
        )}
      </div>

      {/* Available rewards */}
      <div style={{ padding: '0 16px 12px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: C.white }}>Available Rewards</div>
      <div className="no-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 16px 20px' }}>
        {rewards.map(r => {
          const canRedeem = points >= r.pts
          const isRedeemed = redeemed === r.id
          return (
            <div key={r.id} style={{ flexShrink: 0, width: 140, background: C.card, borderRadius: 16, padding: '16px 14px', border: `1px solid ${canRedeem ? 'rgba(245,184,0,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{r.emoji}</div>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 12, marginBottom: 3, lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>{r.desc}</div>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 13, color: C.brand, marginBottom: 8 }}>{r.pts} pts</div>
              <button
                onClick={() => canRedeem && setRedeemed(r.id)}
                style={{
                  width: '100%', padding: '8px 0', borderRadius: 100, border: 'none', cursor: canRedeem ? 'pointer' : 'default',
                  background: isRedeemed ? '#4CAF50' : canRedeem ? C.brand : C.card2,
                  color: isRedeemed ? '#fff' : canRedeem ? '#000' : C.muted,
                  fontFamily: "'Nunito'", fontWeight: 800, fontSize: 11,
                }}
              >
                {isRedeemed ? '✓ Redeemed' : canRedeem ? 'Redeem' : 'Not enough'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Points history */}
      <div style={{ padding: '0 16px 12px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: C.white }}>Points History</div>
      <div style={{ padding: '0 16px' }}>
        {history.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: i < history.length - 1 ? `1px solid rgba(255,255,255,0.06)` : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: h.pts > 0 ? 'rgba(76,175,80,0.15)' : 'rgba(255,82,82,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 12, flexShrink: 0 }}>
              {h.pts > 0 ? '↑' : '↓'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontFamily: "'Nunito'", fontWeight: 600, marginBottom: 2 }}>{h.desc}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{h.date}</div>
            </div>
            <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 14, color: h.pts > 0 ? '#4CAF50' : C.red }}>
              {h.pts > 0 ? '+' : ''}{h.pts} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
