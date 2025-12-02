'use client'

import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState, quickLinksState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'
import { CustomModule, QuickLink } from '@/types/event'
import ModuleRenderer from '@/components/ModuleRenderer'

export default function Flow4CustomModules() {
  const [selectedQuickLink, setSelectedQuickLink] = useState<QuickLink | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const currentEvent = useRecoilValue(currentEventState)
  const quickLinks = useRecoilValue(quickLinksState)
  const { addModuleToEvent } = useEventActions()

  const handleQuickLinkClick = async (quickLink: QuickLink) => {
    if (!currentEvent) return

    setIsLoading(true)
    try {
      const newModule: CustomModule = {
        id: `module-${Date.now()}`,
        type: quickLink.moduleType,
        code: quickLink.code,
        config: {},
      }
      
      await addModuleToEvent(currentEvent.id, newModule)
      setSelectedQuickLink(quickLink)
    } catch (error) {
      console.error('Failed to add module:', error)
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
        Flow 4: Add Customizable Modules
      </h2>

      {!currentEvent ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          Please create an event first in Flow 1.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontWeight: 'bold',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              Quick Links:
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {quickLinks.map((quickLink) => (
                <button
                  key={quickLink.id}
                  onClick={() => handleQuickLinkClick(quickLink)}
                  disabled={isLoading}
                  style={{
                    padding: '1rem',
                    background: '#f5f5f5',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontWeight: '500',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = '#e8f4f8'
                      e.currentTarget.style.borderColor = '#0070f3'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.background = '#f5f5f5'
                      e.currentTarget.style.borderColor = '#ddd'
                    }
                  }}
                >
                  {quickLink.label}
                </button>
              ))}
            </div>
          </div>

          {currentEvent.modules.length > 0 && (
            <div>
              <h3 style={{ 
                fontWeight: 'bold',
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                Added Modules ({currentEvent.modules.length}):
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                {currentEvent.modules.map((module) => (
                  <div
                    key={module.id}
                    style={{
                      padding: '1.5rem',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#666',
                      fontWeight: '500'
                    }}>
                      Module Type: {module.type}
                    </div>
                    <ModuleRenderer module={module} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentEvent.modules.length === 0 && (
            <p style={{ 
              color: '#666',
              fontStyle: 'italic',
              padding: '2rem',
              textAlign: 'center',
              background: '#f9fafb',
              borderRadius: '8px'
            }}>
              No modules added yet. Click a quick link above to add a module.
            </p>
          )}
        </>
      )}
    </div>
  )
}

