'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface LocationModalProps {
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (value: string) => void
}

interface NominatimResult {
  place_id: number
  display_name: string
  address?: {
    city?: string
    state?: string
    country?: string
    [key: string]: any
  }
}

// Get location suggestions from OpenStreetMap Nominatim API
const getLocationSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim()) {
    // Return empty array when no query - let user type first
    return []
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(query)}&` +
      `format=json&` +
      `addressdetails=1&` +
      `limit=6`,
      {
        headers: {
          'User-Agent': 'EventBuilderApp/1.0' // Required by Nominatim
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch locations')
    }

    const data: NominatimResult[] = await response.json()
    
    // Extract display names from results
    return data.map(item => item.display_name)
  } catch (error) {
    console.error('Error fetching location suggestions:', error)
    return []
  }
}

export default function LocationModal({
  isOpen,
  onClose,
  value,
  onChange
}: LocationModalProps) {
  const [inputValue, setInputValue] = useState(value)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!inputValue.trim()) {
        setSuggestions([])
        setIsLoading(false)
        return
      }
      
      setIsLoading(true)
      try {
        const results = await getLocationSuggestions(inputValue)
        setSuggestions(results)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the API call
    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [inputValue])

  const handleUseTypedText = () => {
    if (inputValue.trim()) {
      onChange(inputValue.trim())
      onClose()
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const hasUseTypedTextOption = inputValue.trim() && !suggestions.includes(inputValue.trim())
    const totalOptions = hasUseTypedTextOption ? suggestions.length + 1 : suggestions.length
    const maxIndex = totalOptions - 1
    
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < maxIndex ? prev + 1 : maxIndex
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > -1 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex === -1 && inputValue.trim()) {
        handleUseTypedText()
      } else if (hasUseTypedTextOption && selectedIndex === 0) {
        handleUseTypedText()
      } else if (selectedIndex >= 0) {
        const suggestionIndex = hasUseTypedTextOption ? selectedIndex - 1 : selectedIndex
        if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[suggestionIndex])
        }
      }
    }
  }

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

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
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          padding: '1.5rem',
          maxWidth: '500px',
          width: '100%',
          height: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0
          }}>
            Location
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
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
            ×
          </button>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a location"
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.05)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        />

        {/* Suggestions List */}
        {!isLoading && inputValue.trim() && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              borderRadius: '8px',
              background: 'transparent',
              padding: '0.5rem'
            }}
          >
            {/* Use typed text option - only show if there's typed text and it doesn't exactly match a suggestion */}
            {inputValue.trim() && !suggestions.includes(inputValue.trim()) && (
              <button
                onClick={handleUseTypedText}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedIndex === 0 || selectedIndex === -1 ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: '#fff',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  setSelectedIndex(0)
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor"/>
                </svg>
                <span>Use "{inputValue.trim()}"</span>
              </button>
            )}

            {/* Location suggestions */}
            {suggestions.map((suggestion, index) => {
              // Adjust index for "Use typed text" option
              const hasUseTypedTextOption = inputValue.trim() && !suggestions.includes(inputValue.trim())
              const adjustedIndex = hasUseTypedTextOption ? index + 1 : index
              
              return (
              <button
                key={`location-${index}-${suggestion.substring(0, 20)}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedIndex === adjustedIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: '#fff',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  setSelectedIndex(adjustedIndex)
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = selectedIndex === adjustedIndex ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#EF4444"/>
                  <circle cx="12" cy="10" r="3" stroke="#EF4444"/>
                </svg>
                <span>{suggestion}</span>
              </button>
            )
            })}
          </div>
        )}

        {isLoading && (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.875rem'
          }}>
            Searching...
          </div>
        )}

        {!isLoading && inputValue.trim() && suggestions.length === 0 && (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.875rem'
          }}>
            No locations found. You can use the typed text.
          </div>
        )}
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  
  return null
}

