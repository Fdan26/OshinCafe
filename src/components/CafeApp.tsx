import { useState } from 'react'
import logoImg from '@/imports/image.png_202607281008.jpeg'

type CafeTab = 'dashboard' | 'orders' | 'reservations' | 'menu'
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
  brand: '#F5B800',
  brandDim: 'rgba(245,184,0,0.12)',
  bg: '#FAF8F3',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#EBEBEB',
  muted: '#9A9A9A',
  mutedDark: '#666666',
  text: '#1A1A1A',
  textLight: '#444444',
  green: '#16A34A',
  greenBg: 'rgba(22,163,74,0.1)',
  red: '#DC2626',
  redBg: 'rgba(220,38,38,0.1)',
  amber: '#D97706',
  amberBg: 'rgba(217,119,6,0.1)',
  blue: '#2563EB',
  blueBg: 'rgba(37,99,235,0.1)',
}

const INITIAL_ORDERS: Order[] = [
  {
    id: 1042, customer: 'Ahmad R.', items: [{ name: 'Signature Latte', qty: 1, price: 14 }, { name: 'Butter Croissant', qty: 2, price: 8 }],
    table: 'T4', type: 'dine', status: 'preparing', time: '10:32 AM', total: 30,
  },
  {
    id: 1043, customer: 'Sarah L.', items: [{ name: 'Vanilla Cold Brew', qty: 2, price: 16 }, { name: 'Tiramisu', qty: 1, price: 14 }],
    table: 'Takeaway', type: 'takeaway', status: 'ready', time: '10:28 AM', total: 46,
  },
  {
    id: 1044, customer: 'Reza M.', items: [{ name: 'Oshin Special', qty: 1, price: 17 }, { name: 'Avocado Toast', qty: 1, price: 18 }],
    table: 'T7', type: 'dine', status: 'preparing', time: '10:41 AM', total: 35,
  },
  {
    id: 1041, customer: 'Priya K.', items: [{ name: 'Iced Matcha Latte', qty: 1, price: 14 }],
    table: 'T2', type: 'dine', status: 'completed', time: '10:15 AM', total: 14,
  },
  {
    id: 1040, customer: 'Lee W.', items: [{ name: 'Caramel Macchiato', qty: 2, price: 15 }, { name: 'Banana Cake', qty: 2, price: 9 }],
    table: 'Takeaway', type: 'takeaway', status: 'completed', time: '10:05 AM', total: 48,
  },
  {
    id: 1039, customer: 'Hafiz A.', items: [{ name: 'Club Sandwich', qty: 1, price: 20 }, { name: 'Flat White', qty: 1, price: 13 }],
    table: 'T1', type: 'dine', status: 'completed', time: '9:52 AM', total: 33,
  },
]

const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 1, name: 'Ahmad Rizwan', pax: 4, time: '12:30 PM', status: 'confirmed', note: 'Anniversary dinner, need cake', phone: '012-345 6789' },
  { id: 2, name: 'Sarah & Friends', pax: 6, time: '1:00 PM', status: 'seated', phone: '011-234 5678' },
  { id: 3, name: 'Priya Kumar', pax: 2, time: '2:00 PM', status: 'confirmed', note: 'Window seat preferred', phone: '019-876 5432' },
  { id: 4, name: 'The Tan Family', pax: 5, time: '7:00 PM', status: 'pending', phone: '017-654 3210' },
  { id: 5, name: 'Reza & Colleagues', pax: 8, time: '7:30 PM', status: 'confirmed', note: 'Corporate lunch, need invoice', phone: '016-543 2109' },
  { id: 6, name: 'Lee Mei Ling', pax: 3, time: '8:00 PM', status: 'pending', phone: '013-210 9876' },
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

export default function CafeApp() {
  const [tab, setTab] = useState<CafeTab>('dashboard')
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS)
  const [menu, setMenu] = useState(MENU_ITEMS)

  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready').length
  const todayRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0)
  const completedToday = orders.filter(o => o.status === 'completed').length

  const updateOrderStatus = (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const updateResStatus = (id: number, status: Reservation['status']) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const toggleMenuItem = (id: number) => {
    setMenu(prev => prev.map(m => m.id === id ? { ...m, available: !m.available } : m))
  }

  const navItems: { id: CafeTab; icon: string; label: string; badge?: number }[] = [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'orders', icon: '◷', label: 'Orders', badge: activeOrders },
    { id: 'reservations', icon: '◻', label: 'Bookings' },
    { id: 'menu', icon: '≡', label: 'Menu' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: L.bg, color: L.text, fontFamily: "'Work Sans', sans-serif" }}>
      <div className="no-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'dashboard' && <DashboardScreen orders={orders} revenue={todayRevenue} completed={completedToday} active={activeOrders} onUpdateOrder={updateOrderStatus} goTab={(t) => setTab(t as CafeTab)} />}
        {tab === 'orders' && <OrdersScreen orders={orders} onUpdate={updateOrderStatus} />}
        {tab === 'reservations' && <ReservationsScreen reservations={reservations} onUpdate={updateResStatus} />}
        {tab === 'menu' && <MenuMgmtScreen items={menu} onToggle={toggleMenuItem} />}
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', background: L.surface, borderTop: `1px solid ${L.border}`, paddingBottom: 20, flexShrink: 0 }}>
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
              <span style={{ fontSize: 18, color: tab === id ? L.brand : L.muted, lineHeight: 1 }}>{icon}</span>
              {badge ? (
                <div style={{ position: 'absolute', top: -5, right: -8, background: L.red, color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 100, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito'" }}>
                  {badge}
                </div>
              ) : null}
            </div>
            <span style={{ fontSize: 10, color: tab === id ? L.brand : L.muted, fontWeight: tab === id ? 700 : 400, fontFamily: "'Nunito'" }}>{label}</span>
            {tab === id && <div style={{ width: 16, height: 2, borderRadius: 2, background: L.brand, marginTop: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
function DashboardScreen({ orders, revenue, completed, active, onUpdateOrder, goTab }: {
  orders: Order[]
  revenue: number
  completed: number
  active: number
  onUpdateOrder: (id: number, s: OrderStatus) => void
  goTab: (t: string) => void
}) {
  const liveOrders = orders.filter(o => o.status === 'preparing' || o.status === 'ready')

  return (
    <div style={{ background: L.bg, minHeight: '100%', paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ background: L.surface, padding: '16px 20px 16px', borderBottom: `1px solid ${L.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div>
            <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 20, color: L.text }}>Good morning! ☀️</div>
            <div style={{ fontSize: 12, color: L.muted }}>Tuesday, 29 July 2025</div>
          </div>
          <img src={logoImg} alt="Oshin Cafe" style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${L.brand}` }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '16px 16px 0' }}>
        {[
          { label: "Today's Revenue", value: `RM ${revenue}`, sub: `${completed} orders`, icon: '💰', color: L.greenBg, textColor: L.green },
          { label: 'Active Orders', value: active.toString(), sub: 'In queue', icon: '🔥', color: 'rgba(245,184,0,0.12)', textColor: L.amber },
          { label: 'Tables Active', value: '6', sub: 'of 12 tables', icon: '🪑', color: L.blueBg, textColor: L.blue },
        ].map(({ label, value, sub, icon, color, textColor }) => (
          <div key={label} style={{ background: L.surface, borderRadius: 16, padding: '14px 12px', border: `1px solid ${L.border}` }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 18, color: textColor, lineHeight: 1, marginBottom: 2 }}>{value}</div>
            <div style={{ fontSize: 9, color: L.muted, lineHeight: 1.3 }}>{label}</div>
            <div style={{ fontSize: 9, color: L.muted }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Live Orders */}
      <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: L.text }}>Live Orders</span>
        <span onClick={() => goTab('orders')} style={{ fontSize: 12, color: L.brand, cursor: 'pointer', fontFamily: "'Nunito'", fontWeight: 700 }}>View all →</span>
      </div>
      <div style={{ padding: '0 16px' }}>
        {liveOrders.length === 0 ? (
          <div style={{ background: L.surface, borderRadius: 14, padding: '20px', textAlign: 'center', color: L.muted, fontSize: 13 }}>No active orders right now</div>
        ) : liveOrders.map(order => (
          <MiniOrderCard key={order.id} order={order} onUpdate={onUpdateOrder} />
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ padding: '20px 16px 0px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: L.text, marginBottom: 12 }}>Quick Actions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px' }}>
        {[
          { icon: '➕', label: 'New Walk-in', color: L.greenBg, textColor: L.green },
          { icon: '📋', label: 'Print Report', color: L.blueBg, textColor: L.blue },
          { icon: '🔔', label: 'Notify Ready', color: 'rgba(245,184,0,0.12)', textColor: L.amber },
          { icon: '📊', label: 'Daily Summary', color: 'rgba(139,92,246,0.1)', textColor: '#7C3AED' },
        ].map(({ icon, label, color, textColor }) => (
          <div key={label} style={{ background: L.surface, borderRadius: 14, padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: `1px solid ${L.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
            <span style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13, color: L.text }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniOrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: number, s: OrderStatus) => void }) {
  const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    preparing: { label: 'Preparing', color: L.amber, bg: L.amberBg },
    ready: { label: 'Ready', color: L.green, bg: L.greenBg },
    completed: { label: 'Completed', color: L.muted, bg: '#F5F5F5' },
    cancelled: { label: 'Cancelled', color: L.red, bg: L.redBg },
  }
  const sc = statusConfig[order.status]

  return (
    <div style={{ background: L.surface, borderRadius: 14, padding: '14px', marginBottom: 10, border: `1px solid ${L.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 14, color: L.text }}>#{order.id}</span>
          <span style={{ fontSize: 11, color: L.muted }}>· {order.customer}</span>
        </div>
        <div style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, fontFamily: "'Nunito'" }}>{sc.label}</div>
      </div>
      <div style={{ fontSize: 12, color: L.textLight, marginBottom: 8 }}>
        {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 11, background: L.bg, padding: '3px 8px', borderRadius: 6, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 600 }}>{order.table}</span>
          <span style={{ fontSize: 11, color: L.muted }}>{order.time}</span>
        </div>
        {order.status === 'preparing' && (
          <button onClick={() => onUpdate(order.id, 'ready')} style={{ background: L.green, color: '#fff', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>Mark Ready</button>
        )}
        {order.status === 'ready' && (
          <button onClick={() => onUpdate(order.id, 'completed')} style={{ background: L.brand, color: '#000', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>Complete</button>
        )}
      </div>
    </div>
  )
}

/* ─── ORDERS SCREEN ──────────────────────────────────────────── */
function OrdersScreen({ orders, onUpdate }: { orders: Order[]; onUpdate: (id: number, s: OrderStatus) => void }) {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all')
  const filters: { id: 'all' | OrderStatus; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'completed', label: 'Done' },
  ]
  const shown = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    preparing: { label: 'Preparing', color: L.amber, bg: L.amberBg },
    ready: { label: 'Ready ✓', color: L.green, bg: L.greenBg },
    completed: { label: 'Completed', color: L.muted, bg: '#F5F5F5' },
    cancelled: { label: 'Cancelled', color: L.red, bg: L.redBg },
  }

  return (
    <div style={{ background: L.bg, minHeight: '100%' }}>
      <div style={{ background: L.surface, padding: '16px 16px 0', borderBottom: `1px solid ${L.border}` }}>
        <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 20, color: L.text, marginBottom: 12 }}>Live Orders</div>
        <div className="no-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12 }}>
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: filter === id ? L.brand : L.bg,
                color: filter === id ? '#000' : L.mutedDark,
                fontFamily: "'Nunito'", fontWeight: 700, fontSize: 12,
                transition: 'all 0.15s',
              }}
            >
              {label} {id !== 'all' && <span style={{ opacity: 0.7 }}>({orders.filter(o => o.status === id).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {shown.map(order => {
          const sc = statusConfig[order.status]
          return (
            <div key={order.id} style={{ background: L.surface, borderRadius: 16, padding: '16px', marginBottom: 10, border: `1px solid ${L.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15, color: L.text }}>Order #{order.id}</div>
                  <div style={{ fontSize: 12, color: L.muted }}>{order.customer} · {order.time}</div>
                </div>
                <div style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, fontFamily: "'Nunito'", flexShrink: 0 }}>{sc.label}</div>
              </div>

              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: L.textLight }}>{item.qty}× {item.name}</span>
                  <span style={{ fontSize: 13, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 600 }}>RM {(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ height: 1, background: L.border, margin: '10px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, background: L.bg, border: `1px solid ${L.border}`, padding: '3px 8px', borderRadius: 6, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 600 }}>{order.table}</span>
                  <span style={{ fontSize: 11, background: L.bg, border: `1px solid ${L.border}`, padding: '3px 8px', borderRadius: 6, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 600 }}>
                    {order.type === 'dine' ? '🍽 Dine-in' : order.type === 'takeaway' ? '🛍 Takeaway' : '🛵 Delivery'}
                  </span>
                </div>
                <span style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 15, color: L.brand }}>RM {order.total.toFixed(2)}</span>
              </div>

              {(order.status === 'preparing' || order.status === 'ready') && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {order.status === 'preparing' && (
                    <button onClick={() => onUpdate(order.id, 'ready')} style={{ flex: 1, background: L.green, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>
                      ✓ Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => onUpdate(order.id, 'completed')} style={{ flex: 1, background: L.brand, color: '#000', border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>
                      ✓ Complete Order
                    </button>
                  )}
                  <button onClick={() => onUpdate(order.id, 'cancelled')} style={{ background: L.redBg, color: L.red, border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── RESERVATIONS SCREEN ────────────────────────────────────── */
function ReservationsScreen({ reservations, onUpdate }: {
  reservations: Reservation[]
  onUpdate: (id: number, status: Reservation['status']) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const statusConfig: Record<Reservation['status'], { label: string; color: string; bg: string }> = {
    confirmed: { label: 'Confirmed', color: L.blue, bg: L.blueBg },
    seated: { label: 'Seated ✓', color: L.green, bg: L.greenBg },
    pending: { label: 'Pending', color: L.amber, bg: L.amberBg },
    cancelled: { label: 'Cancelled', color: L.red, bg: L.redBg },
  }

  return (
    <div style={{ background: L.bg, minHeight: '100%' }}>
      <div style={{ background: L.surface, padding: '16px 16px 16px', borderBottom: `1px solid ${L.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 20, color: L.text }}>Reservations</div>
          <div style={{ fontSize: 12, color: L.muted }}>Tuesday, 29 July — {reservations.length} bookings</div>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: L.brand, color: '#000', border: 'none', borderRadius: 100, padding: '8px 16px', fontFamily: "'Nunito'", fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>+ Walk-in</button>
      </div>

      {showAdd && (
        <div style={{ margin: '12px 16px', background: L.surface, borderRadius: 16, padding: '16px', border: `2px solid ${L.brand}` }}>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 14, marginBottom: 12, color: L.text }}>New Walk-in</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, color: L.muted, marginBottom: 4, fontFamily: "'Nunito'", fontWeight: 700 }}>NAME</div>
              <input placeholder="Customer name" style={{ width: '100%', background: L.bg, border: `1px solid ${L.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, color: L.text, outline: 'none', boxSizing: 'border-box', fontFamily: "'Work Sans'" }} />
            </div>
            <div>
              <div style={{ fontSize: 10, color: L.muted, marginBottom: 4, fontFamily: "'Nunito'", fontWeight: 700 }}>GUESTS</div>
              <input placeholder="2" type="number" style={{ width: '100%', background: L.bg, border: `1px solid ${L.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 12, color: L.text, outline: 'none', boxSizing: 'border-box', fontFamily: "'Work Sans'" }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: L.green, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontSize: 12, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>✓ Add Walkn-in</button>
            <button onClick={() => setShowAdd(false)} style={{ background: L.bg, color: L.muted, border: `1px solid ${L.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 12, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ padding: '12px 16px' }}>
        {reservations.map(res => {
          const sc = statusConfig[res.status]
          return (
            <div key={res.id} style={{ background: L.surface, borderRadius: 16, padding: '14px 16px', marginBottom: 10, border: `1px solid ${L.border}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 14, color: L.text }}>{res.name}</div>
                  <div style={{ fontSize: 12, color: L.muted }}>{res.phone}</div>
                </div>
                <div style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100, fontFamily: "'Nunito'" }}>{sc.label}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: res.note ? 8 : 10 }}>
                <span style={{ fontSize: 11, background: L.bg, border: `1px solid ${L.border}`, padding: '3px 10px', borderRadius: 6, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 700 }}>🕐 {res.time}</span>
                <span style={{ fontSize: 11, background: L.bg, border: `1px solid ${L.border}`, padding: '3px 10px', borderRadius: 6, color: L.mutedDark, fontFamily: "'Nunito'", fontWeight: 700 }}>👥 {res.pax} pax</span>
              </div>
              {res.note && <div style={{ fontSize: 11, color: L.muted, marginBottom: 10, background: 'rgba(245,184,0,0.06)', padding: '6px 10px', borderRadius: 8, borderLeft: `3px solid ${L.brand}` }}>📝 {res.note}</div>}
              {(res.status === 'confirmed' || res.status === 'pending') && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {res.status === 'pending' && (
                    <button onClick={() => onUpdate(res.id, 'confirmed')} style={{ flex: 1, background: L.blueBg, color: L.blue, border: 'none', borderRadius: 8, padding: '8px', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>Confirm</button>
                  )}
                  <button onClick={() => onUpdate(res.id, 'seated')} style={{ flex: 1, background: L.greenBg, color: L.green, border: 'none', borderRadius: 8, padding: '8px', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>Seat Now</button>
                  <button onClick={() => onUpdate(res.id, 'cancelled')} style={{ background: L.redBg, color: L.red, border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontFamily: "'Nunito'", fontWeight: 700, cursor: 'pointer' }}>✕</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── MENU MANAGEMENT ────────────────────────────────────────── */
function MenuMgmtScreen({ items, onToggle }: { items: typeof MENU_ITEMS; onToggle: (id: number) => void }) {
  const [cat, setCat] = useState('Coffee')
  const cats = ['Coffee', 'Cold', 'Food', 'Desserts']
  const shown = items.filter(i => i.cat === cat)
  const unavailable = items.filter(i => !i.available).length

  return (
    <div style={{ background: L.bg, minHeight: '100%' }}>
      <div style={{ background: L.surface, padding: '16px 16px 0', borderBottom: `1px solid ${L.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Nunito'", fontWeight: 900, fontSize: 20, color: L.text }}>Menu Manager</div>
          {unavailable > 0 && <div style={{ background: L.redBg, color: L.red, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, fontFamily: "'Nunito'" }}>{unavailable} unavailable</div>}
        </div>
        <div className="no-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12 }}>
          {cats.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: cat === c ? L.brand : L.bg,
                color: cat === c ? '#000' : L.mutedDark,
                fontFamily: "'Nunito'", fontWeight: 700, fontSize: 12,
                transition: 'all 0.15s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {shown.map(item => (
          <div key={item.id} style={{ background: L.surface, borderRadius: 14, padding: '14px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${L.border}`, opacity: item.available ? 1 : 0.6 }}>
            <div>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 700, fontSize: 14, color: L.text, marginBottom: 2 }}>{item.name}</div>
              <div style={{ fontFamily: "'Nunito'", fontWeight: 800, fontSize: 13, color: L.brand }}>RM {item.price}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {!item.available && <span style={{ fontSize: 10, color: L.red, fontFamily: "'Nunito'", fontWeight: 700 }}>SOLD OUT</span>}
              <div
                onClick={() => onToggle(item.id)}
                style={{
                  width: 44, height: 24, borderRadius: 100,
                  background: item.available ? L.green : '#E5E5E5',
                  cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: item.available ? 23 : 3,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
