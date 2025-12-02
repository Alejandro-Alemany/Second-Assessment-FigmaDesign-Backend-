'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'
import InputModal from './InputModal'
import DateTimeModal from './DateTimeModal'
import LocationModal from './LocationModal'
import PhotoGalleryModal from './PhotoGalleryModal'
import PrivacyModal from './PrivacyModal'

type ModalType = 'title' | 'dateTime' | 'location' | 'cost' | 'description' | 'capacity' | 'photoGallery' | 'links' | 'privacy' | 'questionnaires' | 'announcements' | 'invite' | 'newSections' | null

interface EventFormProps {
  onButtonHandlerReady?: (handler: (buttonId: string) => void, availableButtons: Array<{ id: string; label: string }>) => void
}

export default function EventForm({ onButtonHandlerReady }: EventFormProps = {}) {
  const currentEvent = useRecoilValue(currentEventState)
  const { createEvent, updateEvent } = useEventActions()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [location, setLocation] = useState('')
  const [costPerPerson, setCostPerPerson] = useState('')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState('')
  const [showCapacity, setShowCapacity] = useState(false)
  const [photoGallery, setPhotoGallery] = useState<string[]>([])
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
  const [links, setLinks] = useState<Array<{ title: string; url: string }>>([])
  const [showLinks, setShowLinks] = useState(false)
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'invite-only'>('public')
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [questionnaires, setQuestionnaires] = useState('')
  const [showQuestionnaires, setShowQuestionnaires] = useState(false)
  const [announcements, setAnnouncements] = useState<string[]>([])
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [invite, setInvite] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [newSections, setNewSections] = useState<Array<{ title: string; content: string }>>([])
  const [showNewSections, setShowNewSections] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [openModal, setOpenModal] = useState<ModalType>(null)
  
  // Available buttons list
  const allButtons = [
    { id: 'capacity', label: 'Capacity' },
    { id: 'photoGallery', label: 'Photo gallery' },
    { id: 'links', label: 'Links' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'questionnaires', label: 'Questionnaires' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'invite', label: 'Invite' },
    { id: 'newSections', label: 'New Sections' }
  ]
  
  const [usedButtons, setUsedButtons] = useState<string[]>([]) // Track which buttons have been used

  // Sync form with current event
  useEffect(() => {
    if (currentEvent) {
      setPhoneNumber(currentEvent.phoneNumber || '')
      setEventTitle(currentEvent.title || '')
      setDateTime(currentEvent.dateTime || '')
      setLocation(currentEvent.location || '')
      setCostPerPerson(currentEvent.costPerPerson || '')
      setDescription(currentEvent.description || '')
      setCapacity(currentEvent.capacity || '')
      setPhotoGallery(currentEvent.photoGallery || [])
      setLinks(currentEvent.links || [])
      setPrivacy(currentEvent.privacy || 'public')
      setQuestionnaires(currentEvent.questionnaires || '')
      setAnnouncements(currentEvent.announcements || [])
      setInvite(currentEvent.invite || '')
      setNewSections(currentEvent.newSections || [])
      
      // Show rows for fields that are set
      setShowCapacity(!!currentEvent.capacity)
      setShowPhotoGallery(!!(currentEvent.photoGallery && currentEvent.photoGallery.length > 0))
      setShowLinks(!!(currentEvent.links && currentEvent.links.length > 0))
      setShowPrivacy(!!currentEvent.privacy)
      setShowQuestionnaires(!!currentEvent.questionnaires)
      setShowAnnouncements(!!(currentEvent.announcements && currentEvent.announcements.length > 0))
      setShowInvite(!!currentEvent.invite)
      setShowNewSections(!!(currentEvent.newSections && currentEvent.newSections.length > 0))
      
      // Mark buttons as used if they're already set
      const used: string[] = []
      if (currentEvent.capacity) used.push('capacity')
      if (currentEvent.photoGallery && currentEvent.photoGallery.length > 0) used.push('photoGallery')
      if (currentEvent.links && currentEvent.links.length > 0) used.push('links')
      if (currentEvent.privacy) used.push('privacy')
      if (currentEvent.questionnaires) used.push('questionnaires')
      if (currentEvent.announcements && currentEvent.announcements.length > 0) used.push('announcements')
      if (currentEvent.invite) used.push('invite')
      if (currentEvent.newSections && currentEvent.newSections.length > 0) used.push('newSections')
      setUsedButtons(used)
    } else {
      // Reset all state when no event
      setUsedButtons([])
      setShowCapacity(false)
      setShowPhotoGallery(false)
      setShowLinks(false)
      setShowPrivacy(false)
      setShowQuestionnaires(false)
      setShowAnnouncements(false)
      setShowInvite(false)
      setShowNewSections(false)
    }
  }, [currentEvent])

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) return
    
    // Create or update event with phone number
    if (!currentEvent) {
      await createEvent({
        title: eventTitle || 'Untitled Event',
        description: description,
        phoneNumber: phoneNumber.trim(),
        dateTime: dateTime || undefined,
        location: location || undefined,
        costPerPerson: costPerPerson || undefined,
        capacity: capacity || undefined,
      })
    } else {
      await updateEvent(currentEvent.id, {
        phoneNumber: phoneNumber.trim(),
        title: eventTitle || currentEvent.title,
        description: description || currentEvent.description,
        dateTime: dateTime || currentEvent.dateTime,
        location: location || currentEvent.location,
        costPerPerson: costPerPerson || currentEvent.costPerPerson,
        capacity: capacity || currentEvent.capacity,
      })
    }
  }

  const handleInputChange = async (field: string, value: string) => {
    switch (field) {
      case 'title':
        setEventTitle(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { title: value || 'Untitled Event' })
        }
        break
      case 'dateTime':
        setDateTime(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { dateTime: value || undefined })
        }
        break
      case 'location':
        setLocation(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { location: value || undefined })
        }
        break
      case 'cost':
        setCostPerPerson(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { costPerPerson: value || undefined })
        }
        break
      case 'description':
        setDescription(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { description: value || '' })
        }
        break
      case 'capacity':
        setCapacity(value)
        if (currentEvent) {
          await updateEvent(currentEvent.id, { capacity: value || undefined })
        }
        break
    }
  }

  const handlePhotoGalleryChange = async (newPhotos: string[]) => {
    setPhotoGallery(newPhotos)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { photoGallery: newPhotos.length > 0 ? newPhotos : undefined })
    }
  }

  const handleLinksChange = async (newLinks: Array<{ title: string; url: string }>) => {
    setLinks(newLinks)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { links: newLinks.length > 0 ? newLinks : undefined })
    }
  }

  const handlePrivacyChange = async (value: 'public' | 'private' | 'invite-only') => {
    setPrivacy(value)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { privacy: value })
    }
  }

  const handleQuestionnairesChange = async (value: string) => {
    setQuestionnaires(value)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { questionnaires: value || undefined })
    }
  }

  const handleAnnouncementsChange = async (newAnnouncements: string[]) => {
    setAnnouncements(newAnnouncements)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { announcements: newAnnouncements.length > 0 ? newAnnouncements : undefined })
    }
  }

  const handleInviteChange = async (value: string) => {
    setInvite(value)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { invite: value || undefined })
    }
  }

  const handleNewSectionsChange = async (newSections: Array<{ title: string; content: string }>) => {
    setNewSections(newSections)
    if (currentEvent) {
      await updateEvent(currentEvent.id, { newSections: newSections.length > 0 ? newSections : undefined })
    }
  }


  const handleAddCapacity = useCallback(() => {
    setShowCapacity(true)
    setUsedButtons(prev => prev.includes('capacity') ? prev : [...prev, 'capacity'])
    setTimeout(() => setOpenModal('capacity'), 100)
  }, [])

  const handleAddPhotoGallery = useCallback(() => {
    setShowPhotoGallery(true)
    setUsedButtons(prev => prev.includes('photoGallery') ? prev : [...prev, 'photoGallery'])
    setTimeout(() => setOpenModal('photoGallery'), 100)
  }, [])

  const handleAddLinks = useCallback(() => {
    setShowLinks(true)
    setUsedButtons(prev => prev.includes('links') ? prev : [...prev, 'links'])
    setTimeout(() => setOpenModal('links'), 100)
  }, [])

  const handleAddPrivacy = useCallback(() => {
    setShowPrivacy(true)
    setUsedButtons(prev => prev.includes('privacy') ? prev : [...prev, 'privacy'])
    setTimeout(() => setOpenModal('privacy'), 100)
  }, [])

  const handleAddQuestionnaires = useCallback(() => {
    setShowQuestionnaires(true)
    setUsedButtons(prev => prev.includes('questionnaires') ? prev : [...prev, 'questionnaires'])
    setTimeout(() => setOpenModal('questionnaires'), 100)
  }, [])

  const handleAddAnnouncements = useCallback(() => {
    setShowAnnouncements(true)
    setUsedButtons(prev => prev.includes('announcements') ? prev : [...prev, 'announcements'])
    setTimeout(() => setOpenModal('announcements'), 100)
  }, [])

  const handleAddInvite = useCallback(() => {
    setShowInvite(true)
    setUsedButtons(prev => prev.includes('invite') ? prev : [...prev, 'invite'])
    setTimeout(() => setOpenModal('invite'), 100)
  }, [])

  const handleAddNewSections = useCallback(() => {
    setShowNewSections(true)
    setUsedButtons(prev => prev.includes('newSections') ? prev : [...prev, 'newSections'])
    setTimeout(() => setOpenModal('newSections'), 100)
  }, [])

  const handleButtonClick = useCallback((buttonId: string) => {
    // Mark button as used
    setUsedButtons(prev => {
      if (prev.includes(buttonId)) return prev
      return [...prev, buttonId]
    })
    
    // Route to appropriate handler
    switch (buttonId) {
      case 'capacity':
        handleAddCapacity()
        break
      case 'photoGallery':
        handleAddPhotoGallery()
        break
      case 'links':
        handleAddLinks()
        break
      case 'privacy':
        handleAddPrivacy()
        break
      case 'questionnaires':
        handleAddQuestionnaires()
        break
      case 'announcements':
        handleAddAnnouncements()
        break
      case 'invite':
        handleAddInvite()
        break
      case 'newSections':
        handleAddNewSections()
        break
      default:
        console.log(`Button ${buttonId} clicked`)
    }
  }, [handleAddCapacity, handleAddPhotoGallery, handleAddLinks, handleAddPrivacy, handleAddQuestionnaires, handleAddAnnouncements, handleAddInvite, handleAddNewSections])

  // Get available buttons (not used yet)
  const availableButtons = allButtons.filter(btn => !usedButtons.includes(btn.id))
  
  // Expose button handler to parent
  useEffect(() => {
    if (onButtonHandlerReady) {
      onButtonHandlerReady(handleButtonClick, availableButtons)
    }
  }, [handleButtonClick, availableButtons, onButtonHandlerReady])
  
  // Show 3 buttons initially, or all when showMore is true
  // When showing 3, always show exactly 3 (or as many as available if less than 3)
  const visibleButtons = showMore 
    ? availableButtons 
    : availableButtons.slice(0, Math.min(3, availableButtons.length))

  // Glassmorphism input style
  const inputRowStyle = {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    color: '#fff',
    boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    minHeight: '56px'
  } as React.CSSProperties

  const formatDateTime = (dateTimeString: string): string => {
    if (!dateTimeString) return 'Date and time'
    try {
      const date = new Date(dateTimeString)
      if (isNaN(date.getTime())) return 'Date and time'
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = months[date.getMonth()]
      const day = date.getDate()
      const year = date.getFullYear()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      const displayMinutes = minutes.toString().padStart(2, '0')
      
      return `${month} ${day}, ${year} at ${displayHours}:${displayMinutes} ${ampm}`
    } catch {
      return 'Date and time'
    }
  }

  const getDisplayValue = (field: ModalType) => {
    switch (field) {
      case 'title': return eventTitle || 'Event title'
      case 'dateTime': return formatDateTime(dateTime)
      case 'location': return location || 'Location'
      case 'cost': return costPerPerson || 'Cost per person'
      case 'description': return description || 'Describe your event'
      case 'capacity': return capacity || 'Capacity'
      case 'photoGallery': return photoGallery.length > 0 ? `${photoGallery.length} photo${photoGallery.length !== 1 ? 's' : ''}` : 'Photo gallery'
      case 'links': return links.length > 0 ? `${links.length} link${links.length !== 1 ? 's' : ''}` : 'Links'
      case 'privacy': return privacy === 'public' ? 'Public' : privacy === 'private' ? 'Private' : 'Invite only'
      case 'questionnaires': return questionnaires || 'Questionnaires'
      case 'announcements': return announcements.length > 0 ? `${announcements.length} announcement${announcements.length !== 1 ? 's' : ''}` : 'Announcements'
      case 'invite': return invite || 'Invite'
      case 'newSections': return newSections.length > 0 ? `${newSections.length} section${newSections.length !== 1 ? 's' : ''}` : 'New Sections'
      default: return ''
    }
  }

  // Helper function to render an input row
  const renderInputRow = (
    field: ModalType,
    show: boolean,
    icon: React.ReactNode,
    label: string
  ) => {
    if (!show) return null
    
    return (
      <div 
        key={field}
        style={{ position: 'relative' }}
        onClick={() => setOpenModal(field)}
      >
        <div style={{
          ...inputRowStyle,
          color: getDisplayValue(field) !== label ? '#fff' : 'rgba(255, 255, 255, 0.7)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
        }}
        >
          {getDisplayValue(field)}
        </div>
        <div style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'rgba(255, 255, 255, 0.8)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section Title */}
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '1rem',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}>
          Name your event
        </h2>

        {/* Event Title Input Row - Clickable */}
        <div 
          style={{ position: 'relative' }}
          onClick={() => setOpenModal('title')}
        >
          <div style={{
            ...inputRowStyle,
            color: eventTitle ? '#fff' : 'rgba(255, 255, 255, 0.7)',
            fontWeight: eventTitle ? '500' : 'normal'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          >
            {getDisplayValue('title')}
          </div>
        </div>

        {/* Phone Number Input - Keep as is (special submit behavior) */}
        <div style={{ position: 'relative' }}>
          <input
            type="tel"
            placeholder="Enter phone number to save the draft"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePhoneSubmit()
              }
            }}
            style={{
              width: '100%',
              padding: '1rem 3.5rem 1rem 3rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#fff',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'text'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <button
            onClick={handlePhoneSubmit}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Date and Time Input Row - Clickable */}
        <div 
          style={{ position: 'relative' }}
          onClick={() => setOpenModal('dateTime')}
        >
          <div style={{
            ...inputRowStyle,
            color: dateTime ? '#fff' : 'rgba(255, 255, 255, 0.7)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          >
            {getDisplayValue('dateTime')}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.8)',
              pointerEvents: 'none'
            }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        {/* Location Input Row - Clickable */}
        <div 
          style={{ position: 'relative' }}
          onClick={() => setOpenModal('location')}
        >
          <div style={{
            ...inputRowStyle,
            color: location ? '#fff' : 'rgba(255, 255, 255, 0.7)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          >
            {getDisplayValue('location')}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#FF6B6B',
              pointerEvents: 'none'
            }}
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        {/* Cost Per Person Input Row - Clickable */}
        <div 
          style={{ position: 'relative' }}
          onClick={() => setOpenModal('cost')}
        >
          <div style={{
            ...inputRowStyle,
            color: costPerPerson ? '#fff' : 'rgba(255, 255, 255, 0.7)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          >
            {getDisplayValue('cost')}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.8)',
              pointerEvents: 'none'
            }}
          >
            <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Description Input Row - Clickable */}
        <div 
          style={{ position: 'relative' }}
          onClick={() => setOpenModal('description')}
        >
          <div style={{
            ...inputRowStyle,
            color: description ? '#fff' : 'rgba(255, 255, 255, 0.7)',
            minHeight: '80px',
            alignItems: description ? 'flex-start' : 'center',
            paddingTop: description ? '1rem' : '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          >
            {getDisplayValue('description')}
          </div>
        </div>

        {/* Dynamic Feature Rows */}
        {renderInputRow('capacity', showCapacity, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/>
          </svg>
        ), 'Capacity')}

        {renderInputRow('photoGallery', showPhotoGallery, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor"/>
            <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor"/>
            <polyline points="21 15 16 10 5 21" stroke="currentColor"/>
          </svg>
        ), 'Photo gallery')}

        {renderInputRow('links', showLinks, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"/>
          </svg>
        ), 'Links')}

        {renderInputRow('privacy', showPrivacy, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor"/>
          </svg>
        ), 'Privacy')}

        {renderInputRow('questionnaires', showQuestionnaires, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor"/>
          </svg>
        ), 'Questionnaires')}

        {renderInputRow('announcements', showAnnouncements, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A8 8 0 0 0 6 8c0 4.5 4 8 4 8s4-3.5 4-8z" stroke="currentColor"/>
            <path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor"/>
            <line x1="18" y1="8" x2="21" y2="8" stroke="currentColor"/>
          </svg>
        ), 'Announcements')}

        {renderInputRow('invite', showInvite, (
          <div style={{
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            fontSize: '0.625rem',
            fontWeight: '600',
            color: '#fff'
          }}>
            RSVP
          </div>
        ), 'Invite')}

        {renderInputRow('newSections', showNewSections, (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor"/>
            <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor"/>
            <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor"/>
          </svg>
        ), 'New Sections')}

        {/* Module Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {visibleButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.id)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }}
            >
              + {button.label}
            </button>
          ))}
          
          {availableButtons.length > 3 && (
            <span
              onClick={() => setShowMore(!showMore)}
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.9)',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {showMore ? 'Show less' : 'Show more'}
            </span>
          )}
        </div>
      </div>

      {/* Modals */}
      <InputModal
        isOpen={openModal === 'title'}
        onClose={() => setOpenModal(null)}
        title="Event Title"
        value={eventTitle}
        onChange={(value) => handleInputChange('title', value)}
        placeholder="Event title"
        inputType="text"
      />

      <DateTimeModal
        isOpen={openModal === 'dateTime'}
        onClose={() => setOpenModal(null)}
        value={dateTime}
        onChange={(value) => handleInputChange('dateTime', value)}
      />

      <LocationModal
        isOpen={openModal === 'location'}
        onClose={() => setOpenModal(null)}
        value={location}
        onChange={(value) => handleInputChange('location', value)}
      />

      <InputModal
        isOpen={openModal === 'cost'}
        onClose={() => setOpenModal(null)}
        title="Cost per Person"
        value={costPerPerson}
        onChange={(value) => handleInputChange('cost', value)}
        placeholder="Cost per person"
        inputType="text"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeLinecap="round"/>
          </svg>
        }
      />

      <InputModal
        isOpen={openModal === 'description'}
        onClose={() => setOpenModal(null)}
        title="Event Description"
        value={description}
        onChange={(value) => handleInputChange('description', value)}
        placeholder="Describe your event"
        inputType="text"
        multiline={true}
      />

      <InputModal
        isOpen={openModal === 'capacity'}
        onClose={() => setOpenModal(null)}
        title="Capacity"
        value={capacity}
        onChange={(value) => handleInputChange('capacity', value)}
        placeholder="Enter maximum capacity"
        inputType="number"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor"/>
          </svg>
        }
      />

      <PhotoGalleryModal
        isOpen={openModal === 'photoGallery'}
        onClose={() => setOpenModal(null)}
        photos={photoGallery}
        onChange={handlePhotoGalleryChange}
      />

      <InputModal
        isOpen={openModal === 'links'}
        onClose={() => setOpenModal(null)}
        title="Links"
        value={links.map(l => `${l.title}: ${l.url}`).join(', ')}
        onChange={(value) => {
          // Simple parsing: "Title: URL, Title2: URL2"
          const parsed = value.split(', ').map(link => {
            const [title, ...urlParts] = link.split(': ')
            return { title: title.trim(), url: urlParts.join(': ').trim() }
          }).filter(l => l.title && l.url)
          handleLinksChange(parsed)
        }}
        placeholder="Add links (Title: URL, Title2: URL2)"
        inputType="text"
        multiline={true}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"/>
          </svg>
        }
      />

      <PrivacyModal
        isOpen={openModal === 'privacy'}
        onClose={() => setOpenModal(null)}
        value={privacy}
        onChange={handlePrivacyChange}
      />

      <InputModal
        isOpen={openModal === 'questionnaires'}
        onClose={() => setOpenModal(null)}
        title="Questionnaires"
        value={questionnaires}
        onChange={(value) => handleQuestionnairesChange(value)}
        placeholder="Add questionnaires"
        inputType="text"
        multiline={true}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor"/>
          </svg>
        }
      />

      <InputModal
        isOpen={openModal === 'announcements'}
        onClose={() => setOpenModal(null)}
        title="Announcements"
        value={announcements.join('\n')}
        onChange={(value) => handleAnnouncementsChange(value.split('\n').filter(a => a.trim()))}
        placeholder="Add announcements (one per line)"
        inputType="text"
        multiline={true}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A8 8 0 0 0 6 8c0 4.5 4 8 4 8s4-3.5 4-8z" stroke="currentColor"/>
            <path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor"/>
            <line x1="18" y1="8" x2="21" y2="8" stroke="currentColor"/>
          </svg>
        }
      />

      <InputModal
        isOpen={openModal === 'invite'}
        onClose={() => setOpenModal(null)}
        title="Invite"
        value={invite}
        onChange={(value) => handleInviteChange(value)}
        placeholder="Invite configuration"
        inputType="text"
        multiline={true}
      />

      <InputModal
        isOpen={openModal === 'newSections'}
        onClose={() => setOpenModal(null)}
        title="New Sections"
        value={newSections.map(s => `${s.title}: ${s.content}`).join('\n---\n')}
        onChange={(value) => {
          const parsed = value.split('\n---\n').map(section => {
            const [title, ...contentParts] = section.split(': ')
            return { title: title.trim(), content: contentParts.join(': ').trim() }
          }).filter(s => s.title && s.content)
          handleNewSectionsChange(parsed)
        }}
        placeholder="Add sections (Title: Content, separated by ---)"
        inputType="text"
        multiline={true}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor"/>
            <polyline points="14 2 14 8 20 8" stroke="currentColor"/>
            <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor"/>
            <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor"/>
          </svg>
        }
      />
    </>
  )
}
