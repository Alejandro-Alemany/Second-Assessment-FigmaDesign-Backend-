'use client'

import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'
import FlyerCard from './FlyerCard'

export default function LeftPanel() {
  const currentEvent = useRecoilValue(currentEventState)
  const { updateEventBackground, createEvent } = useEventActions()

  const handleBackgroundChange = async () => {
    // Create a file input for background image
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const url = reader.result as string
          
          // Create event if it doesn't exist
          if (!currentEvent) {
            await createEvent({
              title: 'Untitled Event',
              description: '',
              backgroundImage: url,
            })
          } else {
            updateEventBackground(currentEvent.id, url)
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem'
    }}>
      {/* Flyer Card */}
      <FlyerCard />

      {/* Change Background Button */}
      <button
        onClick={handleBackgroundChange}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: '500',
          color: '#6B21A8',
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="7 10 12 15 17 10" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Change background</span>
      </button>
    </div>
  )
}

