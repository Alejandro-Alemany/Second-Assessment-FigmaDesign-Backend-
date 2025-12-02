'use client'

import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { currentEventState } from '@/lib/recoil/atoms'
import { useEventActions } from '@/lib/recoil/actions'
import CropModal from './CropModal'

export default function FlyerCard() {
  const currentEvent = useRecoilValue(currentEventState)
  const { updateEventFlyer, createEvent } = useEventActions()
  const [showEdit, setShowEdit] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string>('')

  const defaultGradient = 'linear-gradient(135deg, #FF6B9D 0%, #FFA07A 25%, #C471ED 50%, #4ECDC4 75%, #44A3FF 100%)'
  const flyerBackground = currentEvent?.flyerImage || defaultGradient

  const handleImageChange = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const url = reader.result as string
          // Show crop modal instead of directly saving
          setTempImageSrc(url)
          setShowCropModal(true)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    // Create event if it doesn't exist
    if (!currentEvent) {
      await createEvent({
        title: 'Untitled Event',
        description: '',
        flyerImage: croppedImageUrl,
      })
    } else {
      updateEventFlyer(currentEvent.id, croppedImageUrl)
    }
    setShowCropModal(false)
    setTempImageSrc('')
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        borderRadius: '24px',
        background: typeof flyerBackground === 'string' && flyerBackground.startsWith('linear-gradient')
          ? flyerBackground
          : `url(${flyerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
    >
      {/* Edit Button */}
      {showEdit && (
        <button
          onClick={handleImageChange}
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Crop Modal */}
      <CropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false)
          setTempImageSrc('')
        }}
        imageSrc={tempImageSrc}
        onCrop={handleCropComplete}
        aspectRatio={1} // Square aspect ratio for flyer
      />
    </div>
  )
}

