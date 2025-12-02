'use client'

import { CustomModule } from '@/types/event'

interface SocialModuleProps {
  module: CustomModule
}

export default function SocialModule({ module }: SocialModuleProps) {
  const handleShare = (platform: string) => {
    // Mock share functionality
    console.log(`Sharing to ${platform}`)
    alert(`Sharing to ${platform}!`)
  }

  return (
    <div style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: '8px',
      border: '2px solid #8b5cf6'
    }}>
      <h4 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#8b5cf6'
      }}>
        📱 Social Share
      </h4>
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => handleShare('Facebook')}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#1877f2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>📘</span>
          Facebook
        </button>
        <button
          onClick={() => handleShare('Twitter')}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#1da1f2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🐦</span>
          Twitter
        </button>
        <button
          onClick={() => handleShare('LinkedIn')}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#0a66c2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>💼</span>
          LinkedIn
        </button>
        <button
          onClick={() => handleShare('Copy Link')}
          style={{
            padding: '0.75rem 1.25rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🔗</span>
          Copy Link
        </button>
      </div>
    </div>
  )
}

