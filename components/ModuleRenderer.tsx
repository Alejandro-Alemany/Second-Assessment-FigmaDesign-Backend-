'use client'

import { CustomModule } from '@/types/event'
import TicketModule from './modules/TicketModule'
import RSVPModule from './modules/RSVPModule'
import CountdownModule from './modules/CountdownModule'
import SocialModule from './modules/SocialModule'

interface ModuleRendererProps {
  module: CustomModule
}

export default function ModuleRenderer({ module }: ModuleRendererProps) {
  // Render different modules based on the code passed from backend
  // This allows the backend to control what gets rendered
  switch (module.code) {
    case 'ticket-module':
      return <TicketModule module={module} />
    
    case 'rsvp-module':
      return <RSVPModule module={module} />
    
    case 'countdown-module':
      return <CountdownModule module={module} />
    
    case 'social-module':
      return <SocialModule module={module} />
    
    default:
      return (
        <div style={{
          padding: '1rem',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          color: '#856404'
        }}>
          Unknown module type: {module.code}
        </div>
      )
  }
}

