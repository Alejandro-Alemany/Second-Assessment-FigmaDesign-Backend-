'use client'

import { QuickLink } from '@/types/event'

interface ModuleSelectorProps {
  quickLinks: QuickLink[]
  onModuleSelect: (quickLink: QuickLink) => void
  onClose: () => void
}

export default function ModuleSelector({ quickLinks, onModuleSelect, onClose }: ModuleSelectorProps) {
  return (
    <div style={{
      marginTop: '1rem',
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: '#fff'
        }}>
          Quick Links - Add Modules
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#fff',
            padding: '0.25rem 0.5rem',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        {quickLinks.map((quickLink) => (
          <button
            key={quickLink.id}
            onClick={() => {
              onModuleSelect(quickLink)
              onClose()
            }}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
              fontWeight: '500',
              color: '#fff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {quickLink.label}
          </button>
        ))}
      </div>
    </div>
  )
}

