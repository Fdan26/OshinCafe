import { useEffect, useState } from 'react'
import CustomerApp from './components/CustomerApp'
import CafeApp from './components/CafeApp'

type AppView = 'home' | 'customer' | 'cafe'

function MobileAppShell({ children, theme = 'dark' }: { children: React.ReactNode; theme?: 'dark' | 'light' }) {
  const bg = theme === 'dark' ? '#0A0A0A' : '#FAF8F3'

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100dvh',
        background: bg,
        overflow: 'hidden',
        position: 'relative',
        color: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
      }}
    >
      <div style={{ height: '100dvh', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function getInitialView() {
  if (typeof window === 'undefined') return 'home' as const

  const params = new URLSearchParams(window.location.search)
  const app = params.get('app')

  return app === 'customer' || app === 'cafe' ? app : 'home'
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(getInitialView)

  useEffect(() => {
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

  const viewTheme = activeView === 'customer' ? 'dark' : 'light'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: viewTheme === 'dark' ? '#0A0A0A' : '#FAF8F3',
        fontFamily: "'Work Sans', sans-serif",
        overflow: 'hidden',
      }}
    >
      {activeView === 'home' ? (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, padding: 24, background: '#FAF8F3' }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 26, color: '#1A1A1A', textAlign: 'center' }}>
            Oshin Cafe Demo
          </div>
          <div style={{ fontSize: 14, color: '#6B6B6B', textAlign: 'center', maxWidth: 320 }}>
            Select a mobile experience to open directly.
          </div>
          <button onClick={() => openApp('customer')} style={{ border: 'none', borderRadius: 999, background: '#F5B800', color: '#0A0A0A', padding: '12px 20px', fontWeight: 800, cursor: 'pointer', minWidth: 220 }}>
            Open Customer App
          </button>
          <button onClick={() => openApp('cafe')} style={{ border: 'none', borderRadius: 999, background: '#0A0A0A', color: '#FFFFFF', padding: '12px 20px', fontWeight: 800, cursor: 'pointer', minWidth: 220 }}>
            Open Staff App
          </button>
        </div>
      ) : (
        <MobileAppShell theme={viewTheme}>
          {activeView === 'customer' ? <CustomerApp /> : <CafeApp />}
        </MobileAppShell>
      )}
    </div>
  )
}
