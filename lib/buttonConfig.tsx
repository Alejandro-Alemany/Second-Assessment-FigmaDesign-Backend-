import React from 'react'

export interface ButtonConfig {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  status?: 'free' | 'paid'
  eventCount?: number
  heartCount?: number
}

export const allButtonsConfig: ButtonConfig[] = [
  { 
    id: 'capacity', 
    label: 'Capacity',
    description: 'Set the maximum number of attendees for your event.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 523,
    heartCount: 412
  },
  { 
    id: 'questionnaires', 
    label: 'Questionnaires',
    description: 'Create questionnaires for your event. Hosts can create questions and view responses.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 446,
    heartCount: 406
  },
  { 
    id: 'newSections', 
    label: 'New section',
    description: 'Add a custom section to showcase anything you want on your event page.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor"/>
        <polyline points="14 2 14 8 20 8" stroke="currentColor"/>
        <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor"/>
        <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 817,
    heartCount: 277
  },
  { 
    id: 'invite', 
    label: 'Invite',
    description: 'Personally invite each and every guest within seconds.',
    icon: (
      <div style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#fff'
      }}>
        RSVP
      </div>
    ),
    status: 'paid',
    eventCount: 340000,
    heartCount: 150000
  },
  { 
    id: 'photoGallery', 
    label: 'Photo gallery',
    description: 'Add photos for guests to view and relive the vibe.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor"/>
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor"/>
        <polyline points="21 15 16 10 5 21" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 342,
    heartCount: 302
  },
  { 
    id: 'links', 
    label: 'Links',
    description: 'Share links to event guides, menus, playlists, and more.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 832,
    heartCount: 292
  },
  { 
    id: 'privacy', 
    label: 'Privacy',
    description: 'Control who can see and join your event.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 612,
    heartCount: 398
  },
  { 
    id: 'announcements', 
    label: 'Announcements',
    description: 'Send updates and announcements to your event guests.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A8 8 0 0 0 6 8c0 4.5 4 8 4 8s4-3.5 4-8z" stroke="currentColor"/>
        <path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor"/>
        <line x1="18" y1="8" x2="21" y2="8" stroke="currentColor"/>
      </svg>
    ),
    status: 'free',
    eventCount: 456,
    heartCount: 321
  }
]

// Helper to get full button config by ID
export const getButtonConfig = (id: string): ButtonConfig | undefined => {
  return allButtonsConfig.find(btn => btn.id === id)
}

// Helper to map simple buttons to full config
export const enhanceButtons = (buttons: Array<{ id: string; label: string }>): ButtonConfig[] => {
  return buttons.map(btn => {
    const config = getButtonConfig(btn.id)
    return config || { id: btn.id, label: btn.label }
  })
}

