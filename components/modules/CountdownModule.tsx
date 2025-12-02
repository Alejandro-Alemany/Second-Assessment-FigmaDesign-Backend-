'use client'

import { useState, useEffect } from 'react'
import { CustomModule } from '@/types/event'

interface CountdownModuleProps {
  module: CustomModule
}

export default function CountdownModule({ module }: CountdownModuleProps) {
  // Default to 30 days from now
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + 30)
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: '8px',
      border: '2px solid #f59e0b'
    }}>
      <h4 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#f59e0b'
      }}>
        ⏰ Countdown Timer
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f59e0b'
          }}>
            {timeLeft.days}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#92400e',
            marginTop: '0.25rem'
          }}>
            Days
          </div>
        </div>
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f59e0b'
          }}>
            {timeLeft.hours}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#92400e',
            marginTop: '0.25rem'
          }}>
            Hours
          </div>
        </div>
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f59e0b'
          }}>
            {timeLeft.minutes}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#92400e',
            marginTop: '0.25rem'
          }}>
            Minutes
          </div>
        </div>
        <div style={{
          padding: '1rem',
          background: '#fef3c7',
          borderRadius: '8px'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#f59e0b'
          }}>
            {timeLeft.seconds}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#92400e',
            marginTop: '0.25rem'
          }}>
            Seconds
          </div>
        </div>
      </div>
    </div>
  )
}

