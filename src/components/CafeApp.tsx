import { useState, type CSSProperties, type ReactNode } from 'react'
import logoImg from '@/imports/image.png_202607281008.jpeg'
import PromoTicket, { PROMO_THEMES } from './PromoTicket'
import Icon, { type IconName } from '@/ui/Icon'
import useIsDesktop from '@/ui/useIsDesktop'
import { daysLeft, isExpired, isLive, newPromoCode, toISODate, usePromotions, type Promotion, type PromoTheme } from '@/data/promotions'

type CafeTab = 'dashboard' | 'orders' | 'reservations' | 'promos' | 'menu'
type OrderStatus = 'preparing' | 'ready' | 'completed' | 'cancelled'

interface Order {
  id: number
  customer: string
  items: { name: string; qty: number; price: number }[]
  table: string
  type: 'dine' | 'takeaway' | 'delivery'
  status: OrderStatus
  time: string
  total: number
}

interface Reservation {
  id: number
  name: string
  pax: number
  time: string
  status: 'confirmed' | 'seated' | 'pending' | 'cancelled'
  note?: string
  phone: string
}

const L = {
  bg: '#F5F2EC',
  surface: '#FFFFFF',
  sunken: '#EFEBE3',
  line: '#E8E2D8',
  lineStrong: '#D8D0C3',
  text: '#1C1915',
  dim: '#6F675C',
  faint: '#A39B8F',
  gold: '#B8892B',
  goldSoft: 'rgba(184,137,43,0.1)',
  ink: '#1C1915',
  ivory: '#F6EFE4',
  green: '#3E7B57',
  greenBg: 'rgba(62,123,87,0.1)',
  amber: '#B4761C',
  amberBg: 'rgba(180,118,28,0.1)',
  red: '#B5483A',
  redBg: 'rgba(181,72,58,0.08)',
  blue: '#3B5B85',
  blueBg: 'rgba(59,91,133,0.09)',
}

const F = { display: 'var(--font-display)', ui: 'var(--font-ui)', mono: 'var(--font-mono)' }

const eyebrow: CSSProperties = { fontFamily: F.ui, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: L.faint }
const heading: CSSProperties = { fontFamily: F.display, fontWeight: 500, fontSize: 30, letterSpacing: '-0.025em', lineHeight: 1.05, color: L.text, margin: 0 }
const card: CSSProperties = { background: L.surface, borderRadius: 20, border: `1px solid ${L.line}`, boxShadow: '0 1px 2px rgba(28,25,21,0.04)' }

const INITIAL_ORDERS: Order[] = [
  { id: 1042, customer: 'Ahmad R.', items: [{ name: 'Signature Latte', qty: 1, price: 14 }, { name: 'Butter Croissant', qty: 2, price: 8 }], table: 'T4', type: 'dine', status: 'preparing', time: '10:32', total: 30 },
  { id: 1043, customer: 'Sarah L.', items: [{ name: 'Vanilla Cold Brew', qty: 2, price: 16 }, { name: 'Tiramisu', qty: 1, price: 14 }], table: 'Pick-up', type: 'takeaway', status: 'ready', time: '10:28', total: 46 },
  { id: 1044, customer: 'Reza M.', items: [{ name: 'Oshin Special', qty: 1, price: 17 }, { name: 'Avocado Toast', qty: 1, price: 18 }], table: 'T7', type: 'dine', status: 'preparing', time: '10:41', total: 35 },
  { id: 1041, customer: 'Priya K.', items: [{ name: 'Iced Matcha Latte', qty: 1, price: 14 }], table: 'T2', type: 'dine', status: 'completed', time: '10:15', total: 14 },
  { id: 1040, customer: 'Lee W.', items: [{ name: 'Caramel Macchiato', qty: 2, price: 15 }, { name: 'Banana Cake', qty: 2, price: 9 }], table: 'Pick-up', type: 'takeaway', status: 'completed', time: '10:05', total: 48 },
  { id: 1039, customer: 'Hafiz A.', items: [{ name: 'Club Sandwich', qty: 1, price: 20 }, { name: 'Flat White', qty: 1, price: 13 }], table: 'T1', type: 'dine', status: 'completed', time: '09:52', total: 33 },
]

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 1, name: 'Ahmad Rizwan', pax: 4, time: '12:30', status: 'confirmed', note: 'Anniversary dinner, need cake', phone: '012-345 6789' },
  { id: 2, name: 'Sarah & Friends', pax: 6, time: '13:00', status: 'seated', phone: '011-234 5678' },
  { id: 3, name: 'Priya Kumar', pax: 2, time: '14:00', status: 'confirmed', note: 'Window seat preferred', phone: '019-876 5432' },
  { id: 4, name: 'The Tan Family', pax: 5, time: '19:00', status: 'pending', phone: '017-654 3210' },
  { id: 5, name: 'Reza & Colleagues', pax: 8, time: '19:30', status: 'confirmed', note: 'Corporate lunch, need invoice', phone: '016-543 2109' },
  { id: 6, name: 'Lee Mei Ling', pax: 3, time: '20:00', status: 'pending', phone: '013-210 9876' },
]

const MENU_ITEMS = [
  { id: 1, name: 'Signature Latte', cat: 'Coffee', price: 14, available: true },
  { id: 2, name: 'Caramel Macchiato', cat: 'Coffee', price: 15, available: true },
  { id: 3, name: 'Flat White', cat: 'Coffee', price: 13, available: true },
  { id: 4, name: 'Oshin Special', cat: 'Coffee', price: 17, available: true },
  { id: 5, name: 'Vanilla Cold Brew', cat: 'Cold', price: 16, available: true },
  { id: 6, name: 'Iced Matcha Latte', cat: 'Cold', price: 14, available: true },
  { id: 7, name: 'Taro Bubble Tea', cat: 'Cold', price: 15, available: false },
  { id: 8, name: 'Berry Smoothie', cat: 'Cold', price: 13, available: true },
  { id: 9, name: 'Avocado Toast', cat: 'Food', price: 18, available: true },
  { id: 10, name: 'Club Sandwich', cat: 'Food', price: 20, available: true },
  { id: 11, name: 'Butter Croissant', cat: 'Food', price: 8, available: true },
  { id: 12, name: 'Eggs Benedict', cat: 'Food', price: 22, available: false },
  { id: 13, name: 'Banana Cake', cat: 'Desserts', price: 9, available: true },
  { id: 14, name: 'Tiramisu', cat: 'Desserts', price: 14, available: true },
  { id: 15, name: 'Burnt Cheesecake', cat: 'Desserts', price: 13, available: true },
]

const ORDER_STATUS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  preparing: { label: 'Preparing', color: L.amber, bg: L.amberBg },
  ready: { label: 'Ready', color: L.green, bg: L.greenBg },
  completed: { label: 'Completed', color: L.dim, bg: L.sunken },
  cancelled: { label: 'Cancelled', color: L.red, bg: L.redBg },
}

const ORDER_TYPE: Record<Order['type'], { label: string; icon: IconName }> = {
  dine: { label: 'Dine-in', icon: 'dine' },
  takeaway: { label: 'Pick-up', icon: 'takeaway' },
  delivery: { label: 'Delivery', icon: 'delivery' },
}

const todayLabel = () => new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

export default function CafeApp() {
  const desktop = useIsDesktop()
  const [tab, setTab] = useState<CafeTab>('dashboard')
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [menu, setMenu] = useState(MENU_ITEMS)
  const promotions = usePromotions()

  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready').length
  const todayRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0)
  const completedToday = orders.filter(o => o.status === 'completed').length

  const updateOrderStatus = (id: number, status: OrderStatus) => setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
  const updateResStatus = (id: number, status: Reservation['status']) => setReservations(prev => prev.map(r => (r.id === id ? { ...r, status } : r)))
  const addWalkIn = (name: string, pax: number) => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setReservations(prev => [{ id: Date.now(), name, pax, time, status: 'seated', phone: 'Walk-in' }, ...prev])
  }
  const toggleMenuItem = (id: number) => setMenu(prev => prev.map(m => (m.id === id ? { ...m, available: !m.available } : m)))

  const navItems: { id: CafeTab; icon: IconName; label: string; badge?: number }[] = [
    { id: 'dashboard', icon: 'dashboard', label: 'Today' },
    { id: 'orders', icon: 'receipt', label: 'Orders', badge: activeOrders },
    { id: 'reservations', icon: 'calendar', label: 'Bookings' },
    { id: 'promos', icon: 'offers', label: 'Promos' },
    { id: 'menu', icon: 'list', label: 'Menu' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: desktop ? 'row' : 'column', background: L.bg, color: L.text, fontFamily: F.ui, position: 'relative' }}>
      {desktop && <Sidebar tab={tab} items={navItems} setTab={setTab} />}

      {/* Keyed by tab so each screen opens scrolled to the top */}
      <div key={tab} className="no-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="screen" style={desktop ? { maxWidth: 1280, margin: '0 auto', padding: '0 20px 48px' } : undefined}>
          {tab === 'dashboard' && <DashboardScreen orders={orders} revenue={todayRevenue} completed={completedToday} active={activeOrders} bookings={reservations.filter(r => r.status !== 'cancelled').length} onUpdateOrder={updateOrderStatus} goTab={setTab} />}
          {tab === 'orders' && <OrdersScreen orders={orders} onUpdate={updateOrderStatus} />}
          {tab === 'reservations' && <ReservationsScreen reservations={reservations} onUpdate={updateResStatus} onWalkIn={addWalkIn} />}
          {tab === 'promos' && <PromosScreen {...promotions} />}
          {tab === 'menu' && <MenuMgmtScreen items={menu} onToggle={toggleMenuItem} />}
        </div>
      </div>

      {!desktop && <nav style={{ display: 'flex', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderTop: `1px solid ${L.line}`, paddingBottom: 'calc(var(--safe-bottom) + 10px)', flexShrink: 0 }}>
        {navItems.map(({ id, icon, label, badge }) => {
          const active = tab === id
          return (
            <button key={id} className="tap" onClick={() => setTab(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '12px 0 2px', border: 'none', background: 'transparent', cursor: 'pointer', color: active ? L.text : L.faint, position: 'relative' }}>
              {active && <span style={{ position: 'absolute', top: 0, width: 20, height: 2, borderRadius: 2, background: L.gold }} />}
              <span style={{ position: 'relative' }}>
                <Icon name={icon} size={22} stroke={active ? 1.8 : 1.5} />
                {badge ? <span className="num" style={{ position: 'absolute', top: -5, right: -9, minWidth: 17, height: 17, padding: '0 4px', boxSizing: 'border-box', borderRadius: 99, background: L.red, color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #fff' }}>{badge}</span> : null}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 600, letterSpacing: '0.02em' }}>{label}</span>
            </button>
          )
        })}
      </nav>}
    </div>
  )
}

/* ─── SHARED PIECES ─────────────────────────────────────────── */
function Header({ kicker, title, right, children }: { kicker: string; title: string; right?: ReactNode; children?: ReactNode }) {
  const desktop = useIsDesktop()
  return (
    <div style={{ padding: desktop ? '40px 20px 28px' : 'calc(var(--safe-top) + 22px) 20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ ...eyebrow, marginBottom: 8 }}>{kicker}</div>
          <h1 style={{ ...heading, fontSize: desktop ? 44 : 30 }}>{title}</h1>
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 24, padding: '0 10px', borderRadius: 99, background: bg, color, fontSize: 11, fontWeight: 700, letterSpacing: '0.02em', flexShrink: 0 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {label}
    </span>
  )
}

function Chip({ icon, children }: { icon?: IconName; children: ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 10, background: L.sunken, color: L.dim, fontSize: 12, fontWeight: 600 }}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  )
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="no-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 18 }}>
      {options.map(o => {
        const active = value === o.id
        return (
          <button key={o.id} className="tap" onClick={() => onChange(o.id)} style={{ flexShrink: 0, height: 38, padding: '0 16px', borderRadius: 99, cursor: 'pointer', border: `1px solid ${active ? L.ink : L.line}`, background: active ? L.ink : L.surface, color: active ? L.ivory : L.dim, fontWeight: 700, fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 6 }}>
            {o.label}
            {o.count !== undefined && <span className="num" style={{ opacity: 0.55 }}>{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

function Switch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onChange} style={{ width: 44, height: 26, borderRadius: 99, border: 'none', padding: 0, background: on ? L.green : L.lineStrong, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.22s cubic-bezier(0.2,0.8,0.2,1)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

function InkButton({ children, onClick, tone = 'ink', grow, disabled }: { children: ReactNode; onClick: () => void; tone?: 'ink' | 'gold' | 'green'; grow?: boolean; disabled?: boolean }) {
  const bg = disabled ? L.lineStrong : tone === 'gold' ? L.gold : tone === 'green' ? L.green : L.ink
  return (
    <button className="tap" disabled={disabled} onClick={onClick} style={{ flex: grow ? 1 : undefined, height: 44, padding: '0 18px', borderRadius: 14, border: 'none', background: bg, color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {children}
    </button>
  )
}

function OutlineIconButton({ icon, onClick, label, tone }: { icon: IconName; onClick: () => void; label: string; tone?: 'red' }) {
  return (
    <button className="tap" onClick={onClick} aria-label={label} style={{ width: 44, height: 44, borderRadius: 14, border: `1px solid ${tone === 'red' ? 'rgba(181,72,58,0.25)' : L.line}`, background: L.surface, color: tone === 'red' ? L.red : L.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
      <Icon name={icon} size={18} />
    </button>
  )
}

/* ─── DESKTOP SIDEBAR ───────────────────────────────────────── */
function Sidebar({ tab, items, setTab }: { tab: CafeTab; items: { id: CafeTab; icon: IconName; label: string; badge?: number }[]; setTab: (t: CafeTab) => void }) {
  return (
    <aside style={{ width: 248, flexShrink: 0, background: L.surface, borderRight: `1px solid ${L.line}`, display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 28px' }}>
        <img src={logoImg} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${L.line}`, padding: 2, boxSizing: 'border-box' }} />
        <div>
          <div style={{ fontFamily: F.display, fontSize: 17, letterSpacing: '-0.01em' }}>Oshin Cafe</div>
          <div style={{ ...eyebrow, fontSize: 9 }}>Staff console</div>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ id, icon, label, badge }) => {
          const active = tab === id
          return (
            <button key={id} className="tap" onClick={() => setTab(id)} style={{ position: 'relative', height: 44, display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: active ? L.sunken : 'transparent', color: active ? L.text : L.dim, fontWeight: active ? 700 : 600, fontSize: 14, textAlign: 'left' }}>
              {active && <span style={{ position: 'absolute', left: -16, top: 12, bottom: 12, width: 3, borderRadius: 3, background: L.gold }} />}
              <Icon name={icon} size={19} stroke={active ? 1.8 : 1.5} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge ? <span className="num" style={{ minWidth: 20, height: 20, padding: '0 6px', boxSizing: 'border-box', borderRadius: 99, background: L.red, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span> : null}
            </button>
          )
        })}
      </nav>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, background: L.bg, border: `1px solid ${L.line}` }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: L.green, boxShadow: `0 0 0 4px ${L.greenBg}` }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>Open now</div>
          <div style={{ fontSize: 11.5, color: L.dim }}>Until 22:00 today</div>
        </div>
      </div>
    </aside>
  )
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
function DashboardScreen({ orders, revenue, completed, active, bookings, onUpdateOrder, goTab }: {
  orders: Order[]
  revenue: number
  completed: number
  active: number
  bookings: number
  onUpdateOrder: (id: number, s: OrderStatus) => void
  goTab: (t: CafeTab) => void
}) {
  const desktop = useIsDesktop()
  const liveOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const hourly = [12, 28, 46, 38, 62, 54, 30, 44] // mock trading curve, 08:00–15:00
  const peak = Math.max(...hourly)

  const revenueCard = (
    <div style={{ borderRadius: 24, padding: desktop ? '28px 28px 22px' : '22px 22px 18px', background: 'linear-gradient(150deg, #2A241D 0%, #1C1915 60%)', color: L.ivory, boxShadow: '0 24px 48px -28px rgba(28,25,21,0.7)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ ...eyebrow, color: 'rgba(246,239,228,0.5)' }}>Revenue today</div>
          <div className="num" style={{ fontFamily: F.display, fontSize: desktop ? 56 : 44, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10 }}>
            <span style={{ fontSize: desktop ? 24 : 20, marginRight: 4, opacity: 0.6 }}>RM</span>{revenue.toFixed(2)}
          </div>
          <div className="num" style={{ fontSize: 12.5, color: 'rgba(246,239,228,0.6)', marginTop: 8 }}>{completed} orders completed</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 26, padding: '0 10px', borderRadius: 99, background: 'rgba(140,192,150,0.14)', color: '#8CC096', fontSize: 11.5, fontWeight: 700 }}>
          <Icon name="up" size={12} stroke={2.2} /> 12%
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: desktop ? 10 : 6, height: desktop ? 96 : 56, marginTop: 'auto', paddingTop: 20 }}>
        {hourly.map((v, i) => (
          <div key={i} style={{ flex: 1, height: `${(v / peak) * 100}%`, borderRadius: 4, background: i === hourly.length - 1 ? '#E2B24F' : 'rgba(246,239,228,0.14)' }} />
        ))}
      </div>
      <div className="num" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'rgba(246,239,228,0.4)', marginTop: 8 }}>
        <span>08:00</span><span>Now</span>
      </div>
    </div>
  )

  const statCards = ([
    { label: 'Active orders', value: active, icon: 'receipt', tab: 'orders' },
    { label: 'Bookings today', value: bookings, icon: 'calendar', tab: 'reservations' },
  ] as const).map(s => (
    <button key={s.label} className="tap" onClick={() => goTab(s.tab)} style={{ ...card, padding: desktop ? 22 : 18, textAlign: 'left', cursor: 'pointer', color: L.text, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: L.faint, width: '100%' }}>
        <Icon name={s.icon} size={18} />
        <Icon name="arrowRight" size={15} />
      </div>
      <div className="num" style={{ fontFamily: F.display, fontSize: desktop ? 44 : 34, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 'auto', paddingTop: 18 }}>{s.value}</div>
      <div style={{ fontSize: 12.5, color: L.dim, marginTop: 6 }}>{s.label}</div>
    </button>
  ))

  const sectionTitle = (text: string, action?: ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ fontFamily: F.display, fontWeight: 500, fontSize: 22, letterSpacing: '-0.02em', margin: 0 }}>{text}</h2>
      {action}
    </div>
  )

  const live = (
    <div>
      {sectionTitle('Live orders', <button className="tap" onClick={() => goTab('orders')} style={{ background: 'none', border: 'none', color: L.dim, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>All orders <Icon name="arrowRight" size={14} /></button>)}
      {liveOrders.length === 0 ? (
        <div style={{ ...card, padding: 28, textAlign: 'center', color: L.dim, fontSize: 13.5 }}>The pass is clear. Nicely done.</div>
      ) : (
        <div style={{ ...card, padding: '4px 16px' }}>
          {liveOrders.map((o, i) => {
            const st = ORDER_STATUS[o.status]
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < liveOrders.length - 1 ? `1px solid ${L.line}` : 'none' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: L.sunken, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 15, flexShrink: 0 }}>{o.table.startsWith('T') ? o.table : <Icon name="takeaway" size={18} color={L.dim} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="num" style={{ fontWeight: 800, fontSize: 14 }}>#{o.id}</span>
                    <span style={{ fontSize: 12.5, color: L.dim }}>{o.customer}</span>
                  </div>
                  <div style={{ fontSize: 12, color: L.faint, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.items.map(i => `${i.qty}× ${i.name}`).join(' · ')}</div>
                </div>
                {o.status === 'preparing' ? (
                  <button className="tap" onClick={() => onUpdateOrder(o.id, 'ready')} style={{ height: 34, padding: '0 12px', borderRadius: 11, border: 'none', background: L.ink, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Mark ready</button>
                ) : (
                  <Pill {...st} />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const shortcuts = (
    <div>
      {sectionTitle('Shortcuts')}
      <div style={{ display: 'grid', gridTemplateColumns: desktop ? '1fr' : '1fr 1fr', gap: desktop ? 10 : 12 }}>
        {([
          { icon: 'walkIn', label: 'New walk-in', tab: 'reservations' },
          { icon: 'offers', label: 'Create promo', tab: 'promos' },
          { icon: 'list', label: 'Sold-out items', tab: 'menu' },
          { icon: 'chart', label: 'Daily summary', tab: 'dashboard' },
        ] as const).map(a => (
          <button key={a.label} className="tap" onClick={() => goTab(a.tab)} style={{ ...card, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: L.text, textAlign: 'left' }}>
            <span style={{ width: 38, height: 38, borderRadius: 12, background: L.goldSoft, color: L.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={a.icon} size={18} /></span>
            <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{a.label}</span>
            {desktop && <Icon name="chevronRight" size={16} color={L.faint} />}
          </button>
        ))}
      </div>
    </div>
  )

  const header = <Header kicker={todayLabel()} title={greeting} right={desktop ? undefined : <img src={logoImg} alt="Oshin Cafe" style={{ width: 44, height: 44, borderRadius: '50%', border: `1px solid ${L.line}`, padding: 2, boxSizing: 'border-box', background: L.surface }} />} />

  if (desktop) {
    return (
      <div>
        {header}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 36, minHeight: 230 }}>
            {revenueCard}
            {statCards}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 24, alignItems: 'start' }}>
            {live}
            {shortcuts}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      {header}
      <div style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: 12 }}>{revenueCard}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 30 }}>{statCards}</div>
        {live}
        <div style={{ marginTop: 30 }}>{shortcuts}</div>
      </div>
    </div>
  )
}

/* ─── ORDERS ────────────────────────────────────────────────── */
function OrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: number, s: OrderStatus) => void }) {
  const st = ORDER_STATUS[order.status]
  const type = ORDER_TYPE[order.type]
  const open = order.status === 'preparing' || order.status === 'ready'
  return (
    <div style={{ ...card, padding: 18, opacity: order.status === 'cancelled' ? 0.6 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="num" style={{ fontFamily: F.display, fontSize: 22, letterSpacing: '-0.02em', lineHeight: 1 }}>#{order.id}</div>
          <div className="num" style={{ fontSize: 12.5, color: L.dim, marginTop: 6 }}>{order.customer} · {order.time}</div>
        </div>
        <Pill {...st} />
      </div>

      {order.items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 6 }}>
          <span><span className="num" style={{ color: L.faint, marginRight: 8 }}>{item.qty}×</span>{item.name}</span>
          <span className="num" style={{ color: L.dim }}>{(item.qty * item.price).toFixed(2)}</span>
        </div>
      ))}

      <div style={{ borderTop: `1px dashed ${L.lineStrong}`, margin: '14px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {order.table.startsWith('T') && <Chip icon="table">{order.table}</Chip>}
          <Chip icon={type.icon}>{type.label}</Chip>
        </div>
        <span className="num" style={{ fontFamily: F.display, fontSize: 20, letterSpacing: '-0.02em' }}><span style={{ fontSize: 12, color: L.faint, marginRight: 4, fontFamily: F.ui, fontWeight: 600 }}>RM</span>{order.total.toFixed(2)}</span>
      </div>

      {open && (
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {order.status === 'preparing'
            ? <InkButton grow onClick={() => onUpdate(order.id, 'ready')}><Icon name="check" size={16} stroke={2.2} /> Mark ready</InkButton>
            : <InkButton grow tone="gold" onClick={() => onUpdate(order.id, 'completed')}><Icon name="check" size={16} stroke={2.2} /> Hand over</InkButton>}
          <OutlineIconButton icon="close" tone="red" label="Cancel order" onClick={() => onUpdate(order.id, 'cancelled')} />
        </div>
      )}
    </div>
  )
}

function OrdersScreen({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: number, s: OrderStatus) => void }) {
  const desktop = useIsDesktop()
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const count = (s: OrderStatus) => orders.filter(o => o.status === s).length

  if (desktop) {
    const columns: { title: string; statuses: OrderStatus[]; color: string }[] = [
      { title: 'Preparing', statuses: ['preparing'], color: L.amber },
      { title: 'Ready', statuses: ['ready'], color: L.green },
      { title: 'Done', statuses: ['completed', 'cancelled'], color: L.faint },
    ]
    return (
      <div>
        <Header kicker="Live service" title="Orders" right={<span className="num" style={{ fontSize: 13, color: L.dim }}>{orders.length} orders today</span>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, padding: '0 20px', alignItems: 'start' }}>
          {columns.map(col => {
            const list = orders.filter(o => col.statuses.includes(o.status))
            return (
              <section key={col.title} style={{ background: L.sunken, borderRadius: 22, padding: 12, minHeight: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 6px 14px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{col.title}</span>
                  <span className="num" style={{ fontSize: 12.5, color: L.faint }}>{list.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {list.map(o => <OrderCard key={o.id} order={o} onUpdate={onUpdate} />)}
                  {list.length === 0 && <div style={{ padding: '28px 12px', textAlign: 'center', fontSize: 12.5, color: L.faint }}>Nothing here</div>}
                </div>
              </section>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Live service" title="Orders">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'All', count: orders.length },
            { id: 'preparing', label: 'Preparing', count: count('preparing') },
            { id: 'ready', label: 'Ready', count: count('ready') },
            { id: 'completed', label: 'Done', count: count('completed') },
          ]}
        />
      </Header>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.length === 0 && <div style={{ ...card, padding: 28, textAlign: 'center', color: L.dim, fontSize: 13.5 }}>No orders here.</div>}
        {shown.map(order => <OrderCard key={order.id} order={order} onUpdate={onUpdate} />)}
      </div>
    </div>
  )
}

/* ─── RESERVATIONS ──────────────────────────────────────────── */
const RES_STATUS: Record<Reservation['status'], { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: L.blue, bg: L.blueBg },
  seated: { label: 'Seated', color: L.green, bg: L.greenBg },
  pending: { label: 'Pending', color: L.amber, bg: L.amberBg },
  cancelled: { label: 'Cancelled', color: L.red, bg: L.redBg },
}

const fieldLabel: CSSProperties = { ...eyebrow, fontSize: 9.5, marginBottom: 8, color: L.dim }
const fieldInput: CSSProperties = { width: '100%', height: 46, background: L.bg, border: `1px solid ${L.line}`, borderRadius: 14, padding: '0 14px', fontSize: 14, color: L.text, outline: 'none', boxSizing: 'border-box' }

function ReservationsScreen({ reservations, onUpdate, onWalkIn }: {
  reservations: Reservation[]
  onUpdate: (id: number, status: Reservation['status']) => void
  onWalkIn: (name: string, pax: number) => void
}) {
  const desktop = useIsDesktop()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [pax, setPax] = useState(2)
  const sorted = [...reservations].sort((a, b) => a.time.localeCompare(b.time))
  const active = reservations.filter(r => r.status !== 'cancelled')
  const guests = active.reduce((s, r) => s + r.pax, 0)

  const submit = () => {
    if (!name.trim()) return
    onWalkIn(name.trim(), pax)
    setName('')
    setPax(2)
    setShowAdd(false)
  }

  const walkInForm = (
    <div style={{ ...card, padding: 18, border: `1px solid ${desktop ? L.line : L.gold}` }}>
      <div style={{ fontFamily: F.display, fontSize: 19, marginBottom: 14 }}>Seat a walk-in</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={fieldLabel}>Name</div>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Guest name" style={fieldInput} />
        </div>
        <div>
          <div style={fieldLabel}>Guests</div>
          <input type="number" min={1} max={12} value={pax} onChange={e => setPax(Math.max(1, Math.min(12, Number(e.target.value) || 1)))} style={fieldInput} />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <InkButton grow disabled={!name.trim()} onClick={submit}><Icon name="check" size={16} stroke={2.2} /> Seat now</InkButton>
      </div>
    </div>
  )

  const timeline = sorted.map((res, i) => {
    const st = RES_STATUS[res.status]
    const open = res.status === 'confirmed' || res.status === 'pending'
    return (
      <div key={res.id} style={{ display: 'flex', gap: 14 }}>
        <div style={{ width: 46, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="num" style={{ fontFamily: F.display, fontSize: 15, paddingTop: 16 }}>{res.time}</div>
          <div style={{ flex: 1, width: 1, background: i < sorted.length - 1 ? L.lineStrong : 'transparent', marginTop: 8 }} />
        </div>
        <div style={{ ...card, flex: 1, minWidth: 0, padding: 16, marginBottom: 12, opacity: res.status === 'cancelled' ? 0.55 : 1, display: desktop ? 'flex' : 'block', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: F.display, fontSize: 17, letterSpacing: '-0.01em' }}>{res.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: 12, color: L.dim }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="users" size={14} /> {res.pax}</span>
                  <span className="num" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} /> {res.phone}</span>
                </div>
              </div>
              {!desktop && <Pill {...st} />}
            </div>
            {res.note && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, padding: '10px 12px', borderRadius: 12, background: L.goldSoft, color: '#7A5B1C', fontSize: 12.5, lineHeight: 1.45 }}>
                <Icon name="note" size={15} style={{ marginTop: 1 }} /> {res.note}
              </div>
            )}
          </div>
          {desktop && <Pill {...st} />}
          {open && (
            <div style={{ display: 'flex', gap: 8, marginTop: desktop ? 0 : 14, flexShrink: 0, width: desktop ? 240 : undefined }}>
              {res.status === 'pending' && (
                <button className="tap" onClick={() => onUpdate(res.id, 'confirmed')} style={{ flex: 1, height: 38, borderRadius: 12, border: `1px solid ${L.line}`, background: L.surface, color: L.text, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
              )}
              <button className="tap" onClick={() => onUpdate(res.id, 'seated')} style={{ flex: 1, height: 38, borderRadius: 12, border: 'none', background: L.ink, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Seat</button>
              <button className="tap" onClick={() => onUpdate(res.id, 'cancelled')} aria-label="Cancel booking" style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid rgba(181,72,58,0.25)', background: L.surface, color: L.red, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}><Icon name="close" size={15} /></button>
            </div>
          )}
          {desktop && !open && <div style={{ width: 240, flexShrink: 0 }} />}
        </div>
      </div>
    )
  })

  if (desktop) {
    const byStatus = (s: Reservation['status']) => reservations.filter(r => r.status === s).length
    return (
      <div>
        <Header kicker={todayLabel()} title="Bookings" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, padding: '0 20px', alignItems: 'start' }}>
          <div>{timeline}</div>
          <div style={{ position: 'sticky', top: 8, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ ...eyebrow, marginBottom: 10 }}>Today</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="num" style={{ fontFamily: F.display, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1 }}>{guests}</span>
                <span style={{ fontSize: 13, color: L.dim }}>guests · {active.length} bookings</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 18 }}>
                {(['pending', 'confirmed', 'seated', 'cancelled'] as const).map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, background: RES_STATUS[s].bg }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: RES_STATUS[s].color }}>{RES_STATUS[s].label}</span>
                    <span className="num" style={{ fontSize: 12.5, fontWeight: 800, color: RES_STATUS[s].color }}>{byStatus(s)}</span>
                  </div>
                ))}
              </div>
            </div>
            {walkInForm}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker={`${todayLabel()} · ${guests} guests`} title="Bookings" right={<InkButton onClick={() => setShowAdd(!showAdd)}><Icon name={showAdd ? 'close' : 'plus'} size={16} stroke={2} /> Walk-in</InkButton>} />
      <div style={{ padding: '0 20px' }}>
        {showAdd && <div style={{ marginBottom: 16 }}>{walkInForm}</div>}
        {timeline}
      </div>
    </div>
  )
}

/* ─── PROMOTIONS ────────────────────────────────────────────── */
type PromoFilter = 'all' | 'live' | 'paused' | 'ended'

function promoStatus(p: Promotion): Exclude<PromoFilter, 'all'> {
  if (isExpired(p)) return 'ended'
  return p.active ? 'live' : 'paused'
}

const PROMO_STATUS: Record<Exclude<PromoFilter, 'all'>, { label: string; color: string; bg: string }> = {
  live: { label: 'Live', color: L.green, bg: L.greenBg },
  paused: { label: 'Paused', color: L.amber, bg: L.amberBg },
  ended: { label: 'Ended', color: L.dim, bg: L.sunken },
}

function PromosScreen({ promos, save, remove, toggle }: ReturnType<typeof usePromotions>) {
  const desktop = useIsDesktop()
  const [filter, setFilter] = useState<PromoFilter>('all')
  const [editing, setEditing] = useState<Promotion | null>(null)

  const live = promos.filter(isLive)
  const endingSoon = live.filter(p => daysLeft(p.validUntil) <= 7).length
  const totalRedeemed = promos.reduce((s, p) => s + p.redemptions, 0)
  const shown = filter === 'all' ? promos : promos.filter(p => promoStatus(p) === filter)
  const count = (f: Exclude<PromoFilter, 'all'>) => promos.filter(p => promoStatus(p) === f).length

  const startNew = () => setEditing({
    id: `p${Date.now()}`, title: '', subtitle: '', code: newPromoCode(), kind: 'percent', value: 10, minSpend: 0,
    validUntil: toISODate(new Date(Date.now() + 14 * 86_400_000)), theme: 'gold', active: true, redemptions: 0,
  })

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Shown in the customer app" title="Promotions" right={<InkButton onClick={startNew}><Icon name="plus" size={16} stroke={2} /> New{desktop ? ' promotion' : ''}</InkButton>}>
        <div style={{ display: desktop ? 'flex' : 'block', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr', marginTop: 18, width: desktop ? 480 : undefined }}>
            {[
              { label: 'Live', value: live.length, color: L.green },
              null,
              { label: 'Redeemed', value: totalRedeemed, color: L.text },
              null,
              { label: 'Ending ≤ 7d', value: endingSoon, color: endingSoon ? L.amber : L.text },
            ].map((s, i) =>
              s ? (
                <div key={i} style={{ padding: '14px 14px 12px' }}>
                  <div className="num" style={{ fontFamily: F.display, fontSize: 26, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ ...eyebrow, fontSize: 9, marginTop: 8 }}>{s.label}</div>
                </div>
              ) : <div key={i} style={{ background: L.line, margin: '12px 0' }} />,
            )}
          </div>
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { id: 'all', label: 'All', count: promos.length },
              { id: 'live', label: 'Live', count: count('live') },
              { id: 'paused', label: 'Paused', count: count('paused') },
              { id: 'ended', label: 'Ended', count: count('ended') },
            ]}
          />
        </div>
      </Header>

      <div style={{ padding: '0 20px', ...(desktop ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 } : {}) }}>
        {shown.length === 0 && (
          <div style={{ ...card, borderStyle: 'dashed', padding: '32px 20px', textAlign: 'center', gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: F.display, fontSize: 19 }}>No promotions here</div>
            <div style={{ fontSize: 13, color: L.dim, marginTop: 6 }}>Create one and it appears in the customer app instantly.</div>
          </div>
        )}
        {shown.map(p => {
          const st = PROMO_STATUS[promoStatus(p)]
          return (
            <div key={p.id} style={{ ...card, padding: 10, marginBottom: desktop ? 0 : 12 }}>
              <PromoTicket promo={p} cutout={L.surface} dimmed={!isLive(p)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 6px 4px' }}>
                <Pill {...st} />
                <span className="num" style={{ fontSize: 12, color: L.dim, flex: 1 }}><strong style={{ color: L.text }}>{p.redemptions}</strong> redeemed</span>
                {!isExpired(p) && <Switch on={p.active} onChange={() => toggle(p.id)} />}
                <button className="tap" onClick={() => setEditing(p)} aria-label="Edit promotion" style={{ width: 36, height: 36, borderRadius: 12, border: `1px solid ${L.line}`, background: L.surface, color: L.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Icon name="edit" size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {editing && (
        <PromoEditor
          initial={editing}
          isNew={!promos.some(p => p.id === editing.id)}
          takenCodes={promos.filter(p => p.id !== editing.id).map(p => p.code.toUpperCase())}
          onClose={() => setEditing(null)}
          onSave={p => { save(p); setEditing(null) }}
          onDelete={id => { remove(id); setEditing(null) }}
        />
      )}
    </div>
  )
}

function PromoEditor({ initial, isNew, takenCodes, onClose, onSave, onDelete }: {
  initial: Promotion
  isNew: boolean
  takenCodes: string[]
  onClose: () => void
  onSave: (p: Promotion) => void
  onDelete: (id: string) => void
}) {
  const desktop = useIsDesktop()
  const [draft, setDraft] = useState(initial)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const set = <K extends keyof Promotion>(key: K, value: Promotion[K]) => setDraft(d => ({ ...d, [key]: value }))

  const errors: string[] = []
  if (!draft.title.trim()) errors.push('Add a title')
  if (!(draft.value > 0)) errors.push('Discount must be more than 0')
  if (draft.kind === 'percent' && draft.value > 100) errors.push('Percentage can’t exceed 100')
  if (draft.minSpend < 0) errors.push('Minimum spend can’t be negative')
  if (!/^[A-Z0-9]{3,12}$/.test(draft.code)) errors.push('Code: 3–12 letters or numbers')
  else if (takenCodes.includes(draft.code)) errors.push('That code is already used')
  if (!draft.validUntil || draft.validUntil < toISODate(new Date())) errors.push('End date must be today or later')

  const num = (v: string) => (v === '' ? 0 : Number(v))
  const submit = () => errors.length === 0 && onSave({ ...draft, title: draft.title.trim(), subtitle: draft.subtitle.trim() })

  const preview = (
    <div style={{ background: '#0C0B0A', borderRadius: 22, padding: '14px 12px 14px', marginBottom: desktop ? 0 : 24 }}>
      <div style={{ ...eyebrow, fontSize: 9, color: 'rgba(246,239,228,0.45)', marginBottom: 12, paddingLeft: 4 }}>Customer preview</div>
      <PromoTicket promo={draft} cutout="#0C0B0A" />
    </div>
  )

  const fields = (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={fieldLabel}>Title</div>
        <input value={draft.title} maxLength={28} onChange={e => set('title', e.target.value)} placeholder="e.g. Golden Hour" style={fieldInput} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={fieldLabel}>Description</div>
        <input value={draft.subtitle} maxLength={60} onChange={e => set('subtitle', e.target.value)} placeholder="e.g. Every handcrafted drink, 3–5 PM" style={fieldInput} />
      </div>

      <div style={fieldLabel}>Discount</div>
      <div style={{ display: 'flex', background: L.sunken, borderRadius: 14, padding: 4, gap: 4, marginBottom: 12 }}>
        {([['percent', 'Percentage'], ['fixed', 'Fixed amount']] as const).map(([kind, label]) => {
          const active = draft.kind === kind
          return (
            <button key={kind} className="tap" onClick={() => set('kind', kind)} style={{ flex: 1, height: 38, borderRadius: 11, border: 'none', cursor: 'pointer', background: active ? L.surface : 'transparent', color: active ? L.text : L.dim, boxShadow: active ? '0 1px 3px rgba(28,25,21,0.12)' : 'none', fontWeight: 700, fontSize: 13 }}>
              {label}
            </button>
          )
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div>
          <div style={fieldLabel}>{draft.kind === 'percent' ? 'Percent off' : 'RM off'}</div>
          <input type="number" inputMode="decimal" min={0} value={draft.value || ''} onChange={e => set('value', num(e.target.value))} placeholder="10" style={fieldInput} />
        </div>
        <div>
          <div style={fieldLabel}>Min spend (RM)</div>
          <input type="number" inputMode="decimal" min={0} value={draft.minSpend || ''} onChange={e => set('minSpend', num(e.target.value))} placeholder="None" style={fieldInput} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div>
          <div style={fieldLabel}>Promo code</div>
          <div style={{ position: 'relative' }}>
            <input value={draft.code} maxLength={12} onChange={e => set('code', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} style={{ ...fieldInput, fontFamily: F.mono, letterSpacing: '0.1em', paddingRight: 40 }} />
            <button onClick={() => set('code', newPromoCode())} aria-label="Generate code" style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, background: 'none', border: 'none', color: L.dim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="refresh" size={16} /></button>
          </div>
        </div>
        <div>
          <div style={fieldLabel}>Ends on</div>
          <input type="date" value={draft.validUntil} min={toISODate(new Date())} onChange={e => set('validUntil', e.target.value)} style={fieldInput} />
        </div>
      </div>

      <div style={fieldLabel}>Card style</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(Object.keys(PROMO_THEMES) as PromoTheme[]).map(theme => {
          const selected = draft.theme === theme
          return (
            <button key={theme} className="tap" onClick={() => set('theme', theme)} style={{ flex: 1, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, cursor: 'pointer', background: L.surface, border: `1.5px solid ${selected ? L.ink : L.line}` }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: PROMO_THEMES[theme].stub, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: L.text }}>{PROMO_THEMES[theme].name}</span>
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: L.bg, border: `1px solid ${L.line}`, borderRadius: 16, padding: '14px 16px', marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Visible to customers</div>
          <div style={{ fontSize: 12, color: L.dim, marginTop: 2 }}>Turn off to pause without deleting</div>
        </div>
        <Switch on={draft.active} onChange={() => set('active', !draft.active)} />
      </div>
    </div>
  )

  const actions = (
    <div>
      {errors.length > 0 && (
        <div style={{ background: L.amberBg, color: L.amber, borderRadius: 14, padding: '12px 14px', fontSize: 12.5, marginBottom: 16, lineHeight: 1.7 }}>
          {errors.map(e => <div key={e}>· {e}</div>)}
        </div>
      )}
      <button className="tap" disabled={errors.length > 0} onClick={submit} style={{ width: '100%', height: 54, background: errors.length ? L.lineStrong : L.ink, color: '#fff', border: 'none', borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: errors.length ? 'default' : 'pointer' }}>
        {isNew ? 'Publish promotion' : 'Save changes'}
      </button>
      {!isNew && (
        <button className="tap" onClick={() => (confirmDelete ? onDelete(draft.id) : setConfirmDelete(true))} style={{ width: '100%', height: 50, marginTop: 10, background: confirmDelete ? L.red : 'transparent', color: confirmDelete ? '#fff' : L.red, border: `1px solid ${confirmDelete ? L.red : 'rgba(181,72,58,0.25)'}`, borderRadius: 16, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon name="trash" size={16} /> {confirmDelete ? 'Click again to delete' : 'Delete promotion'}
        </button>
      )}
    </div>
  )

  const topBar = (
    <div style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 1, padding: desktop ? '18px 28px' : '10px 20px 14px', borderBottom: `1px solid ${L.line}` }}>
      {!desktop && <div style={{ width: 38, height: 4, borderRadius: 4, background: L.lineStrong, margin: '0 auto 14px' }} />}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {desktop ? <div style={{ fontFamily: F.display, fontSize: 22 }}>{isNew ? 'New promotion' : 'Edit promotion'}</div> : <button onClick={onClose} style={{ background: 'none', border: 'none', color: L.dim, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0 }}>Cancel</button>}
        {!desktop && <div style={{ fontFamily: F.display, fontSize: 18 }}>{isNew ? 'New promotion' : 'Edit promotion'}</div>}
        {desktop
          ? <button className="tap" onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${L.line}`, background: L.surface, color: L.dim, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="close" size={16} /></button>
          : <button onClick={submit} style={{ background: 'none', border: 'none', color: errors.length ? L.faint : L.gold, fontSize: 14, fontWeight: 800, cursor: errors.length ? 'default' : 'pointer', padding: 0 }}>Save</button>}
      </div>
    </div>
  )

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: desktop ? 'center' : 'flex-end', alignItems: desktop ? 'center' : 'stretch', background: 'rgba(28,25,21,0.42)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', padding: desktop ? 32 : 0 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className={`no-scroll ${desktop ? 'screen' : 'sheet'}`} style={{ background: L.surface, borderRadius: desktop ? 28 : '28px 28px 0 0', maxHeight: desktop ? '100%' : '92%', width: desktop ? 920 : undefined, maxWidth: '100%', overflowY: 'auto', boxShadow: '0 -24px 48px -24px rgba(0,0,0,0.35)' }}>
        {topBar}
        {desktop ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 28, padding: 28 }}>
            <div style={{ position: 'sticky', top: 90, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {preview}
              {actions}
            </div>
            {fields}
          </div>
        ) : (
          <div style={{ padding: '18px 20px calc(var(--safe-bottom) + 28px)' }}>
            {preview}
            {fields}
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── MENU MANAGEMENT ───────────────────────────────────────── */
function MenuMgmtScreen({ items, onToggle }: { items: typeof MENU_ITEMS; onToggle: (id: number) => void }) {
  const desktop = useIsDesktop()
  const [cat, setCat] = useState('Coffee')
  const cats = ['Coffee', 'Cold', 'Food', 'Desserts']
  const unavailable = items.filter(i => !i.available).length

  const list = (c: string) => {
    const shown = items.filter(i => i.cat === c)
    return (
      <div style={{ ...card, padding: '4px 18px' }}>
        {desktop && (
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '16px 0 6px' }}>
            <span style={{ fontFamily: F.display, fontSize: 20 }}>{c}</span>
            <span className="num" style={{ fontSize: 12, color: L.faint }}>{shown.filter(i => i.available).length}/{shown.length} available</span>
          </div>
        )}
        {shown.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < shown.length - 1 ? `1px solid ${L.line}` : 'none' }}>
            <div style={{ flex: 1, minWidth: 0, opacity: item.available ? 1 : 0.5 }}>
              <div style={{ fontFamily: F.display, fontSize: 17, letterSpacing: '-0.01em', textDecoration: item.available ? 'none' : 'line-through', textDecorationColor: L.faint }}>{item.name}</div>
              <div className="num" style={{ fontSize: 12.5, color: L.dim, marginTop: 3 }}>RM {item.price.toFixed(2)}</div>
            </div>
            {!item.available && <span style={{ ...eyebrow, fontSize: 9, color: L.red }}>Sold out</span>}
            <Switch on={item.available} onChange={() => onToggle(item.id)} />
          </div>
        ))}
      </div>
    )
  }

  const badge = unavailable > 0 ? <Pill label={`${unavailable} sold out`} color={L.red} bg={L.redBg} /> : undefined

  if (desktop) {
    return (
      <div>
        <Header kicker="Availability" title="Menu" right={badge} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 20px', alignItems: 'start' }}>
          {cats.map(c => <div key={c}>{list(c)}</div>)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 28 }}>
      <Header kicker="Availability" title="Menu" right={badge}>
        <Segmented value={cat} onChange={setCat} options={cats.map(c => ({ id: c, label: c, count: items.filter(i => i.cat === c).length }))} />
      </Header>
      <div style={{ padding: '0 20px' }}>{list(cat)}</div>
    </div>
  )
}
