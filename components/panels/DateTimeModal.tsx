'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface DateTimeModalProps {
  isOpen: boolean
  onClose: () => void
  value: string // ISO date string or empty
  onChange: (value: string) => void
}

export default function DateTimeModal({
  isOpen,
  onClose,
  value,
  onChange
}: DateTimeModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState('19:00') // Default 7:00 PM
  const [endTime, setEndTime] = useState('21:00') // Default 9:00 PM
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [activeInput, setActiveInput] = useState<'start' | 'end'>('start')
  const [validationError, setValidationError] = useState<string>('')

  // Parse initial value
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          setStartDate(date)
          setEndDate(new Date(date.getTime() + 2 * 60 * 60 * 1000)) // Add 2 hours
          setSelectedDate(date)
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          setStartTime(`${hours}:${minutes}`)
          
          const end = new Date(date.getTime() + 2 * 60 * 60 * 1000)
          const endHours = end.getHours().toString().padStart(2, '0')
          const endMinutes = end.getMinutes().toString().padStart(2, '0')
          setEndTime(`${endHours}:${endMinutes}`)
        }
      } catch (e) {
        // Invalid date
      }
    } else {
      // Default to today
      const now = new Date()
      setStartDate(now)
      setEndDate(new Date(now.getTime() + 2 * 60 * 60 * 1000))
      setSelectedDate(now)
      setCurrentMonth(now)
    }
  }, [value])

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const validateDates = (start: Date | null, end: Date | null): string => {
    if (!start || !end) return ''
    if (end < start) {
      return 'End date/time must be after start date/time'
    }
    return ''
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setValidationError('') // Clear error when selecting new date
    
    if (activeInput === 'start') {
      const newStart = new Date(date)
      const [hours, minutes] = startTime.split(':')
      newStart.setHours(parseInt(hours), parseInt(minutes))
      setStartDate(newStart)
      
      // Auto-update end date if it's before start
      if (endDate && newStart >= endDate) {
        const newEnd = new Date(newStart.getTime() + 2 * 60 * 60 * 1000)
        setEndDate(newEnd)
        const endHours = newEnd.getHours().toString().padStart(2, '0')
        const endMinutes = newEnd.getMinutes().toString().padStart(2, '0')
        setEndTime(`${endHours}:${endMinutes}`)
      }
      
      // Validate after update
      const error = validateDates(newStart, endDate)
      setValidationError(error)
    } else {
      const newEnd = new Date(date)
      const [hours, minutes] = endTime.split(':')
      newEnd.setHours(parseInt(hours), parseInt(minutes))
      setEndDate(newEnd)
      
      // Validate
      const error = validateDates(startDate, newEnd)
      setValidationError(error)
    }
  }

  const handleTimeChange = (time: string, type: 'start' | 'end') => {
    setValidationError('') // Clear error when changing time
    
    if (type === 'start') {
      setStartTime(time)
      if (startDate) {
        const [hours, minutes] = time.split(':')
        const newStart = new Date(startDate)
        newStart.setHours(parseInt(hours), parseInt(minutes))
        setStartDate(newStart)
        
        // Validate
        const error = validateDates(newStart, endDate)
        setValidationError(error)
      }
    } else {
      setEndTime(time)
      if (endDate) {
        const [hours, minutes] = time.split(':')
        const newEnd = new Date(endDate)
        newEnd.setHours(parseInt(hours), parseInt(minutes))
        setEndDate(newEnd)
        
        // Validate
        const error = validateDates(startDate, newEnd)
        setValidationError(error)
      }
    }
  }

  const handleSave = () => {
    // Final validation before saving
    const error = validateDates(startDate, endDate)
    if (error) {
      setValidationError(error)
      return // Don't save if validation fails
    }
    
    if (startDate) {
      onChange(startDate.toISOString())
      setValidationError('')
    }
    onClose()
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
    const days = []
    
    // Previous month days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} style={{
          padding: '0.75rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          cursor: 'default'
        }}>
          {prevMonthDays - i}
        </div>
      )
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateSelect(date)}
          style={{
            padding: '0.75rem',
            textAlign: 'center',
            cursor: 'pointer',
            color: isSelected ? '#fff' : 'rgba(255, 255, 255, 0.9)',
            fontWeight: isSelected ? 'bold' : 'normal',
            background: isSelected ? '#3B82F6' : 'transparent',
            borderRadius: isSelected ? '50%' : '0',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.borderRadius = '50%'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderRadius = '0'
            }
          }}
        >
          {day}
        </div>
      )
    }
    
    // Next month days
    const totalCells = 42 // 6 weeks * 7 days
    const remainingCells = totalCells - days.length
    for (let day = 1; day <= remainingCells && day <= 14; day++) {
      days.push(
        <div key={`next-${day}`} style={{
          padding: '0.75rem',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.3)',
          cursor: 'default'
        }}>
          {day}
        </div>
      )
    }
    
    return days
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

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
          background: 'rgba(31, 41, 55, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          padding: '2rem',
          maxWidth: '600px',
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
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0
          }}>
            Date and time
          </h3>
          <button
            onClick={handleSave}
            disabled={!!validationError}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              color: validationError ? 'rgba(255, 255, 255, 0.3)' : '#3B82F6',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: validationError ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: validationError ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!validationError) {
                e.currentTarget.style.opacity = '0.8'
              }
            }}
            onMouseLeave={(e) => {
              if (!validationError) {
                e.currentTarget.style.opacity = '1'
              }
            }}
          >
            Save
          </button>
        </div>

        {/* Starts Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', fontWeight: '500' }}>
            Starts
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setActiveInput('start')
                if (startDate) setSelectedDate(startDate)
              }}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: activeInput === 'start' && selectedDate ? '#3B82F6' : 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {formatDate(startDate)}
            </button>
            <input
              type="time"
              value={startTime}
              onChange={(e) => handleTimeChange(e.target.value, 'start')}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            />
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '0.875rem',
              minWidth: '100px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {formatTime(startTime)}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem'
          }}>
            <h4 style={{
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#fff',
              margin: 0
            }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
                }}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                &lt;
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
                }}
                style={{
                  padding: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{
                padding: '0.5rem',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem'
          }}>
            {renderCalendar()}
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#EF4444',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" stroke="currentColor"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor"/>
            </svg>
            {validationError}
          </div>
        )}

        {/* Ends Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', fontWeight: '500' }}>
            Ends
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setActiveInput('end')
                if (endDate) setSelectedDate(endDate)
              }}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: validationError ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                background: activeInput === 'end' && selectedDate ? '#3B82F6' : validationError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {formatDate(endDate)}
            </button>
            <input
              type="time"
              value={endTime}
              onChange={(e) => handleTimeChange(e.target.value, 'end')}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: validationError ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                background: validationError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.875rem',
                cursor: 'pointer',
                minWidth: '120px'
              }}
            />
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: validationError ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              background: validationError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              fontSize: '0.875rem',
              minWidth: '100px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {formatTime(endTime)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  
  return null
}

