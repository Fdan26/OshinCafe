import type { CSSProperties } from 'react'

// Single-weight line icons (24px grid) so both apps share one visual language
const PATHS = {
  home: 'M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9',
  menu: 'M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Zm0 13a3 3 0 0 1 3-3h11M8 8h6',
  offers: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8ZM7.5 7.5h.01',
  bag: 'M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2',
  calendar: 'M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4a2 2 0 0 0 4 0',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrowRight: 'M5 12h14m-6-6 6 6-6 6',
  arrowLeft: 'M19 12H5m6-6-6 6 6 6',
  chevronRight: 'm9 6 6 6-6 6',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  close: 'M6 6l12 12M18 6 6 18',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0m1-10a3 3 0 1 0 0-6m2 16a6 6 0 0 0-3-5.2',
  dashboard: 'M4 4h7v9H4V4Zm9 0h7v5h-7V4Zm0 7h7v9h-7v-9ZM4 15h7v5H4v-5Z',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h4',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4',
  coffee: 'M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6V9Zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3m4-3v3',
  cold: 'M7 4h10l-1.5 16h-7L7 4Zm.5 5h9M12 4l2-2',
  food: 'M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10m10-18c-2 1-3 4-3 7h3v11',
  cake: 'M4 21h16v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8Zm0-5c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0M12 11V7m0-3.5c.8.9.8 2 0 2.5-.8-.5-.8-1.6 0-2.5Z',
  dine: 'M3 12h18M5 12a7 7 0 0 1 14 0M12 5V3M4 16h16',
  takeaway: 'M6 7h12l-1 14H7L6 7Zm3 0V5a3 3 0 0 1 6 0v2m-5 6h4',
  delivery: 'M3 6h11v10H3V6Zm11 4h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  gift: 'M4 11h16v10H4V11Zm-1-4h18v4H3V7Zm9 0v14M12 7S10.5 3 8.5 3.5 7.5 7 12 7Zm0 0s1.5-4 3.5-3.5S16.5 7 12 7Z',
  upgrade: 'M12 20V8m-5 5 5-5 5 5M6 4h12',
  tag: 'M3 12V4h8l9 9-8 8-9-9Zm4.5-4.5h.01',
  sparkle: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  refresh: 'M20 11a8 8 0 0 0-14.9-3M4 4v4h4m-4 5a8 8 0 0 0 14.9 3M20 20v-4h-4',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4',
  walkIn: 'M13 4a1.5 1.5 0 1 0 0-.01M10 21l2-6 3 3v3m-5-12 4-1 3 3 3 1m-10-3-2 5',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7v-7Z',
  chart: 'M4 20V10m6 10V4m6 16v-7m4 7H3',
  note: 'M5 4h14v12l-4 4H5V4Zm10 12v4m0-4h4M9 9h6m-6 4h3',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
  table: 'M4 9h16M6 9v11m12-11v11M8 5h8l2 4H6l2-4Z',
  up: 'M12 19V5m-6 6 6-6 6 6',
  down: 'M12 5v14m6-6-6 6-6-6',
} as const

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 20, stroke = 1.6, color = 'currentColor', style }: {
  name: IconName
  size?: number
  stroke?: number
  color?: string
  style?: CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: 'block', ...style }} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}
