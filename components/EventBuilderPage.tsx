'use client'

import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import LeftPanel from './panels/LeftPanel'
import RightPanel from './panels/RightPanel'

export default function EventBuilderPage() {
  const currentEvent = useRecoilValue(currentEventState)
  
  // Use background image from event, or fallback to gradient
  const defaultGradient = 'linear-gradient(180deg, #E8D5FF 0%, #A78BFA 100%)'
  const backgroundStyle = currentEvent?.backgroundImage
    ? {
        backgroundImage: `url(${currentEvent.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        background: defaultGradient
      }

  return (
    <div style={{
      minHeight: '100vh',
      ...backgroundStyle,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header with branding */}
      <header style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          let's hang
        </div>
      </header>

      {/* Main two-panel layout */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Left Panel - Visual Customization */}
        <LeftPanel />

        {/* Right Panel - Event Details */}
        <RightPanel />
      </main>
    </div>
  )
}

