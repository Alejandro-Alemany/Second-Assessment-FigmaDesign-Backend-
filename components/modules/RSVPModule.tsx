'use client'

import { useState } from 'react'
import { CustomModule } from '@/types/event'

interface RSVPModuleProps {
  module: CustomModule
}

export default function RSVPModule({ module }: RSVPModuleProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setName('')
      setEmail('')
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: '8px',
      border: '2px solid #10b981'
    }}>
      <h4 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#10b981'
      }}>
        ✉️ RSVP Form
      </h4>
      {submitted ? (
        <div style={{
          padding: '1rem',
          background: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '4px',
          color: '#065f46',
          textAlign: 'center'
        }}>
          Thank you for your RSVP! We'll see you there.
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Confirm RSVP
          </button>
        </form>
      )}
    </div>
  )
}

