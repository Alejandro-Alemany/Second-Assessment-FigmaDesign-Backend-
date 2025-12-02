'use client'

import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'

export default function Flow1CreateEvent() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const currentEvent = useRecoilValue(currentEventState)
  const { createEvent } = useEventActions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      await createEvent({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
    } catch (error) {
      console.error('Failed to create event:', error)
    } finally {
      setIsLoading(false)
    }
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
        Flow 1: Create Basic Event
      </h2>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '500px'
      }}>
        <div>
          <label htmlFor="title" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="description" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500'
          }}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: isLoading || !title.trim() ? 'not-allowed' : 'pointer',
            maxWidth: '200px'
          }}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </form>

      {currentEvent && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f0f9ff',
          borderRadius: '4px',
          border: '1px solid #bae6fd'
        }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Current Event:
          </h3>
          <p><strong>Title:</strong> {currentEvent.title}</p>
          <p><strong>Description:</strong> {currentEvent.description || 'N/A'}</p>
          <p><strong>ID:</strong> {currentEvent.id}</p>
        </div>
      )}
    </div>
  )
}

