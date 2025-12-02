'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  icon?: React.ReactNode
  inputType?: string
  multiline?: boolean
}

export default function InputModal({
  isOpen,
  onClose,
  title,
  value,
  onChange,
  placeholder,
  icon,
  inputType = 'text',
  multiline = false
}: InputModalProps) {
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure modal is rendered
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSave = () => {
    onChange(inputValue)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
    // Only save on Enter if not multiline (textarea)
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          {icon && (
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {icon}
            </div>
          )}
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0
          }}>
            {title}
          </h3>
        </div>

        {/* Input or Textarea */}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            rows={6}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontSize: '1rem',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={inputType === 'datetime-local' ? 'datetime-local' : inputType}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontSize: '1rem',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          />
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at body level, ensuring it covers the entire viewport
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  
  return null
}

