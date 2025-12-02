'use client'

import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ButtonConfig } from '@/lib/buttonConfig'

interface ButtonListModalProps {
  isOpen: boolean
  onClose: () => void
  buttons: ButtonConfig[]
  onButtonClick: (buttonId: string) => void
}

export default function ButtonListModal({ 
  isOpen, 
  onClose, 
  buttons, 
  onButtonClick 
}: ButtonListModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredButtons = useMemo(() => {
    if (!searchQuery.trim()) return buttons
    const query = searchQuery.toLowerCase()
    return buttons.filter(button => 
      button.label.toLowerCase().includes(query) ||
      button.description?.toLowerCase().includes(query)
    )
  }, [buttons, searchQuery])

  if (!isOpen) return null

  const handleButtonClick = (buttonId: string) => {
    onButtonClick(buttonId)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '2rem'
      }}
    >
      <div
        style={{
          background: 'rgba(30, 30, 40, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '0',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {/* Palette Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.55 0 1-.45 1-1v-4H7c-.55 0-1-.45-1-1s.45-1 1-1h6V4c0-.55.45-1 1-1s1 .45 1 1v6h4c.55 0 1 .45 1 1s-.45 1-1 1h-4v4c0 .55.45 1 1 1 5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="url(#paletteGradient)"/>
              <defs>
                <linearGradient id="paletteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF6B6B" />
                  <stop offset="25%" stopColor="#4ECDC4" />
                  <stop offset="50%" stopColor="#45B7D1" />
                  <stop offset="75%" stopColor="#FFA07A" />
                  <stop offset="100%" stopColor="#98D8C8" />
                </linearGradient>
              </defs>
            </svg>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#fff',
              margin: 0
            }}>
              Customize
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          padding: '1rem 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.5)" 
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '1rem',
                pointerEvents: 'none'
              }}
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor"/>
            </svg>
            <input
              type="text"
              placeholder="Search for section"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.target.style.background = 'rgba(255, 255, 255, 0.08)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
            />
          </div>
        </div>

        {/* Button List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem 0'
        }}>
          {filteredButtons.map((button) => (
            <div
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                cursor: 'pointer',
                transition: 'background 0.2s',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {/* Icon */}
              <div style={{
                marginRight: '1rem',
                flexShrink: 0,
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {button.icon || (
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                minWidth: 0
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#fff',
                    margin: 0
                  }}>
                    {button.label}
                  </h3>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '4px',
                    background: button.status === 'paid' 
                      ? 'rgba(255, 193, 7, 0.2)' 
                      : 'rgba(76, 175, 80, 0.2)',
                    color: button.status === 'paid' 
                      ? '#FFC107' 
                      : '#4CAF50',
                    fontWeight: '500'
                  }}>
                    {button.status === 'paid' ? '$ Paid' : 'Free'}
                  </span>
                </div>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.4'
                }}>
                  {button.description || `Add ${button.label.toLowerCase()} to your event`}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  {button.eventCount && (
                    <span>{button.eventCount.toLocaleString()} events</span>
                  )}
                  {button.heartCount && (
                    <span>{button.heartCount.toLocaleString()} ♡</span>
                  )}
                </div>
              </div>

              {/* Add Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleButtonClick(button.id)
                }}
                style={{
                  marginLeft: '1rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>

        {filteredButtons.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            No results found
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
