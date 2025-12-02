'use client'

import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState, quickLinksState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'
import { CustomModule } from '@/types/event'
import { ButtonConfig } from '@/lib/buttonConfig'
import ModuleSelector from './ModuleSelector'
import ButtonListModal from './ButtonListModal'

interface CustomizeCardProps {
  showCustomize: boolean
  setShowCustomize: (show: boolean) => void
  availableButtons: ButtonConfig[]
  onButtonClick: (buttonId: string) => void
}

export default function CustomizeCard({ 
  showCustomize, 
  setShowCustomize,
  availableButtons,
  onButtonClick 
}: CustomizeCardProps) {
  const currentEvent = useRecoilValue(currentEventState)
  const quickLinks = useRecoilValue(quickLinksState)
  const { addModuleToEvent } = useEventActions()
  const [showButtonListModal, setShowButtonListModal] = useState(false)

  const handleCustomizeClick = () => {
    setShowButtonListModal(true)
  }

  const handleButtonSelect = (buttonId: string) => {
    onButtonClick(buttonId)
    setShowButtonListModal(false)
  }

  const handleModuleSelect = async (quickLink: typeof quickLinks[0]) => {
    if (!currentEvent) return

    const newModule: CustomModule = {
      id: `module-${Date.now()}`,
      type: quickLink.moduleType,
      code: quickLink.code,
      config: {},
    }
    
    await addModuleToEvent(currentEvent.id, newModule)
  }

  return (
    <div>
      {/* Customize Card */}
      <div style={{
        position: 'relative',
        padding: '2rem',
        borderRadius: '16px',
        background: 'rgba(76, 29, 149, 0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        color: '#fff',
        minHeight: '200px',
        overflow: 'hidden'
      }}>
        {/* Decorative Icons */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem',
          opacity: 0.3
        }}>
          {/* Checklist Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4" stroke="currentColor"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor"/>
          </svg>
          
          {/* Megaphone Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A8 8 0 0 0 6 8c0 4.5 4 8 4 8s4-3.5 4-8z" stroke="currentColor"/>
            <path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor"/>
            <line x1="18" y1="8" x2="21" y2="8" stroke="currentColor"/>
          </svg>
          
          {/* Flower Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" stroke="currentColor"/>
            <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke="currentColor"/>
          </svg>
          
          {/* Chain/Link Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"/>
          </svg>
          
          {/* Picture Frame Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor"/>
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor"/>
            <polyline points="21 15 16 10 5 21" stroke="currentColor"/>
          </svg>
          
          {/* RSVP Text */}
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            opacity: 0.5
          }}>
            RSVP
          </div>
        </div>

        {/* Center Text */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Customize your event your way
          </h3>
        </div>

        {/* Customize Button */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleCustomizeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1.5rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor"/>
            </svg>
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Module Selector (shown when customize is clicked) */}
      {showCustomize && (
        <ModuleSelector
          quickLinks={quickLinks}
          onModuleSelect={handleModuleSelect}
          onClose={() => setShowCustomize(false)}
        />
      )}

      {/* Button List Modal */}
      <ButtonListModal
        isOpen={showButtonListModal}
        onClose={() => setShowButtonListModal(false)}
        buttons={availableButtons}
        onButtonClick={handleButtonSelect}
      />
    </div>
  )
}

