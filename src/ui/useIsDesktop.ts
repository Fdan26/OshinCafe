import { useEffect, useState } from 'react'

const QUERY = '(min-width: 960px)'

/** True on laptop/desktop-width screens; phones and the APKs get the mobile layout. */
export default function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return desktop
}
