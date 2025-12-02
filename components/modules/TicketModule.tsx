'use client'

import { CustomModule } from '@/types/event'

interface TicketModuleProps {
  module: CustomModule
}

export default function TicketModule({ module }: TicketModuleProps) {
  return (
    <div style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: '8px',
      border: '2px solid #0070f3'
    }}>
      <h4 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#0070f3'
      }}>
        🎫 Ticket Sales
      </h4>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <span>General Admission</span>
          <span style={{ fontWeight: 'bold' }}>$25.00</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '0.75rem',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <span>VIP</span>
          <span style={{ fontWeight: 'bold' }}>$50.00</span>
        </div>
        <button style={{
          padding: '0.75rem',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '0.5rem'
        }}>
          Buy Tickets
        </button>
      </div>
    </div>
  )
}

