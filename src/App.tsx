import { useEffect, useState } from 'react'
import CustomerApp from './components/CustomerApp'
import CafeApp from './components/CafeApp'
import logoImg from '@/imports/image.png_202607281008.jpeg'
import Icon from '@/ui/Icon'
import useIsDesktop from '@/ui/useIsDesktop'

type AppView = 'home' | 'customer' | 'cafe'

const SHELL_BG = { dark: '#0C0B0A', light: '#F5F2EC' }

// Fills the screen; between phone and desktop widths it becomes a centred phone-width column
function MobileAppShell({ children, theme }: { children: React.ReactNode; theme: 'dark' | 'light' }) {
  const desktop = useIsDesktop()
  if (desktop) return <div style={{ height: '100dvh', overflow: 'hidden', background: SHELL_BG[theme] }}>{children}</div>

  return (
    <div style={{ minHeight: '100dvh', background: theme === 'dark' ? '#050504' : '#E9E4DB' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', height: '100dvh', overflow: 'hidden', position: 'relative', background: SHELL_BG[theme], boxShadow: '0 0 80px rgba(0,0,0,0.25)' }}>
        {children}
      </div>
    </div>
  )
}

// Set at build time for the Android APKs (see .env.customer / .env.cafe)
const lockedView = import.meta.env.VITE_APP_MODE === 'customer' || import.meta.env.VITE_APP_MODE === 'cafe'
  ? (import.meta.env.VITE_APP_MODE as Exclude<AppView, 'home'>)
  : null

function getInitialView(): AppView {
  if (lockedView) return lockedView
  if (typeof window === 'undefined') return 'home' as const

  const params = new URLSearchParams(window.location.search)
  const app = params.get('app')

  return app === 'customer' || app === 'cafe' ? app : 'home'
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(getInitialView)

  useEffect(() => {
    if (lockedView) return

    const syncView = () => {
      const params = new URLSearchParams(window.location.search)
      const app = params.get('app')
      setActiveView(app === 'customer' || app === 'cafe' ? app : 'home')
    }

    window.addEventListener('popstate', syncView)
    return () => window.removeEventListener('popstate', syncView)
  }, [])

  const openApp = (view: Exclude<AppView, 'home'>) => {
    setActiveView(view)
    const url = new URL(window.location.href)
    url.searchParams.set('app', view)
    window.history.pushState({}, '', url)
  }

  if (activeView !== 'home') {
    const theme = activeView === 'customer' ? 'dark' : 'light'
    return (
      <MobileAppShell theme={theme}>
        {activeView === 'customer' ? <CustomerApp /> : <CafeApp />}
      </MobileAppShell>
    )
  }

  const choices = [
    { view: 'customer' as const, kicker: 'For guests', name: 'Customer app', desc: 'Menu, ordering, offers, reservations and rewards.', dark: true },
    { view: 'cafe' as const, kicker: 'For the team', name: 'Staff app', desc: 'Live orders, bookings, promotions and availability.', dark: false },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'radial-gradient(120% 80% at 50% 0%, #2A2219 0%, #0C0B0A 60%)', color: '#F6EFE4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <img src={logoImg} alt="Oshin Cafe" style={{ width: 72, height: 72, borderRadius: '50%', border: '1px solid rgba(226,178,79,0.35)', padding: 3, boxSizing: 'border-box', marginBottom: 24 }} />
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(226,178,79,0.85)', marginBottom: 12 }}>Oshin Cafe</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 44, letterSpacing: '-0.03em', lineHeight: 1.05, margin: 0, textAlign: 'center' }}>Choose an experience</h1>
      <p style={{ color: 'rgba(246,239,228,0.6)', fontSize: 14.5, margin: '14px 0 36px', textAlign: 'center' }}>Two apps, one café.</p>

      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {choices.map(c => (
          <button
            key={c.view}
            className="tap"
            onClick={() => openApp(c.view)}
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 20px', borderRadius: 22, cursor: 'pointer', textAlign: 'left', border: c.dark ? '1px solid rgba(226,178,79,0.3)' : 'none', background: c.dark ? 'rgba(20,18,15,0.8)' : '#F6EFE4', color: c.dark ? '#F6EFE4' : '#1C1915' }}
          >
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.55, marginBottom: 6 }}>{c.kicker}</span>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.02em' }}>{c.name}</span>
              <span style={{ display: 'block', fontSize: 13, opacity: 0.65, marginTop: 4, lineHeight: 1.45 }}>{c.desc}</span>
            </span>
            <Icon name="arrowRight" size={20} />
          </button>
        ))}
      </div>
    </div>
  )
}
