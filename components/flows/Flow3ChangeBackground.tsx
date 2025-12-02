'use client'

import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'

export default function Flow3ChangeBackground() {
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentEvent = useRecoilValue(currentEventState)
  const { updateEventBackground } = useEventActions()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for local files
      const reader = new FileReader()
      reader.onloadend = () => {
        const url = reader.result as string
        setImageUrl(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl || !currentEvent) return

    setIsLoading(true)
    try {
      await updateEventBackground(currentEvent.id, imageUrl)
    } catch (error) {
      console.error('Failed to update background:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImageUrl('')
  }

  return (
    <div>
      <h2 style={{ 
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        borderBottom: '2px solid #eee',
        paddingBottom: '0.5rem'
      }}>
        Flow 3: Change Background Image
      </h2>

      {!currentEvent ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Please create an event first in Flow 1.
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: '600px'
          }}>
            <div>
              <label htmlFor="background-url" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                Background Image URL or Upload
              </label>
              <input
                id="background-url"
                type="text"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="Enter image URL or upload file below"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  marginBottom: '0.5rem'
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                disabled={isLoading || !imageUrl}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isLoading || !imageUrl ? '#ccc' : '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: isLoading || !imageUrl ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Updating...' : 'Update Background'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>
          </form>

          {(currentEvent.backgroundImage || imageUrl) && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Background Preview:
              </h3>
              <div style={{
                width: '100%',
                height: '200px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                background: '#f0f0f0'
              }}>
                <img
                  src={currentEvent.backgroundImage || imageUrl}
                  alt="Event background"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

