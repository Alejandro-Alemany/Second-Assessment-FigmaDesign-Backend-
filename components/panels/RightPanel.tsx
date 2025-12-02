'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { enhanceButtons, ButtonConfig } from '@/lib/buttonConfig'
import EventForm from './EventForm'
import CustomizeCard from './CustomizeCard'
import ModuleRenderer from '@/components/ModuleRenderer'

export default function RightPanel() {
  const currentEvent = useRecoilValue(currentEventState)
  const [showCustomize, setShowCustomize] = useState(false)
  const buttonHandlerRef = useRef<((buttonId: string) => void) | null>(null)
  const [availableButtons, setAvailableButtons] = useState<ButtonConfig[]>([])

  const handleButtonHandlerReady = useCallback((handler: (buttonId: string) => void, buttons: Array<{ id: string; label: string }>) => {
    buttonHandlerRef.current = handler
    // Enhance buttons with full config
    setAvailableButtons(enhanceButtons(buttons))
  }, [])

  const handleButtonClick = useCallback((buttonId: string) => {
    if (buttonHandlerRef.current) {
      buttonHandlerRef.current(buttonId)
      // The available buttons will be updated when EventForm calls onButtonHandlerReady again
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      padding: '2rem',
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 100px)',
      scrollbarWidth: 'none', // Firefox
      msOverflowStyle: 'none', // IE and Edge
    } as React.CSSProperties}
    className="hide-scrollbar">
      {/* Event Form Section - Glassmorphism Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <EventForm onButtonHandlerReady={handleButtonHandlerReady} />
      </div>

      {/* Customize Card - Already has glassmorphism styling */}
      <CustomizeCard 
        showCustomize={showCustomize} 
        setShowCustomize={setShowCustomize}
        availableButtons={availableButtons}
        onButtonClick={handleButtonClick}
      />

      {/* Display Added Modules - Glassmorphism Cards */}
      {currentEvent && currentEvent.modules.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {currentEvent.modules.map((module) => (
            <div
              key={module.id}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
              }}
            >
              <ModuleRenderer module={module} />
            </div>
          ))}
        </div>
      )}

      {/* Go Live Button - Glassmorphism Style */}
      <button
        onClick={() => {
          if (currentEvent) {
            alert('Event is now live!')
          } else {
            alert('Please create an event first')
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          marginTop: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19l7-7 3 3-7 7-3-3z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 2l7.586 7.586" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="11" r="2" stroke="#fff" strokeWidth="2"/>
        </svg>
        <span>Go live</span>
      </button>
    </div>
  )
}
