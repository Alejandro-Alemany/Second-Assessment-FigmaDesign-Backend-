'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface CropModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCrop: (croppedImageUrl: string) => void
  aspectRatio?: number // Width/Height ratio (e.g., 1 for square)
}

export default function CropModal({ isOpen, onClose, imageSrc, onCrop, aspectRatio = 1 }: CropModalProps) {
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 400, height: 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageInfo, setImageInfo] = useState({ 
    naturalWidth: 0, 
    naturalHeight: 0, 
    displayedWidth: 0, 
    displayedHeight: 0,
    offsetX: 0,
    offsetY: 0
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (isOpen && imageSrc && containerRef.current) {
      // Initialize crop area
      const containerWidth = containerRef.current.clientWidth || 600
      const containerHeight = containerRef.current.clientHeight || 600
      const cropSize = Math.min(containerWidth * 0.7, containerHeight * 0.7, 500)
      const cropWidth = cropSize
      const cropHeight = cropSize / aspectRatio
      
      setCropArea({
        x: (containerWidth - cropWidth) / 2,
        y: (containerHeight - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      })
    }
  }, [isOpen, imageSrc, aspectRatio])

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Check if click is within crop area
    if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      setIsDragging(true)
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const containerWidth = rect.width
    const containerHeight = rect.height
    const x = e.clientX - rect.left - dragStart.x
    const y = e.clientY - rect.top - dragStart.y
    
    // Constrain crop area within container bounds
    const maxX = containerWidth - cropArea.width
    const maxY = containerHeight - cropArea.height
    
    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    }))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current || imageInfo.naturalWidth === 0) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Calculate the scale factor between displayed and natural image size
    const scaleX = imageInfo.naturalWidth / imageInfo.displayedWidth
    const scaleY = imageInfo.naturalHeight / imageInfo.displayedHeight
    
    // Calculate crop coordinates relative to image
    const cropX = (cropArea.x - imageInfo.offsetX) * scaleX
    const cropY = (cropArea.y - imageInfo.offsetY) * scaleY
    const cropWidth = cropArea.width * scaleX
    const cropHeight = cropArea.height * scaleY
    
    // Ensure crop coordinates are within image bounds
    const finalCropX = Math.max(0, Math.min(cropX, imageInfo.naturalWidth))
    const finalCropY = Math.max(0, Math.min(cropY, imageInfo.naturalHeight))
    const finalCropWidth = Math.min(cropWidth, imageInfo.naturalWidth - finalCropX)
    const finalCropHeight = Math.min(cropHeight, imageInfo.naturalHeight - finalCropY)
    
    // Set canvas size to crop area (in natural pixels)
    canvas.width = finalCropWidth
    canvas.height = finalCropHeight
    
    // Draw cropped image
    ctx.drawImage(
      imageRef.current,
      finalCropX,
      finalCropY,
      finalCropWidth,
      finalCropHeight,
      0,
      0,
      finalCropWidth,
      finalCropHeight
    )
    
    // Convert to data URL
    const croppedImageUrl = canvas.toDataURL('image/png')
    onCrop(croppedImageUrl)
    onClose()
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '2rem'
      }}
    >
      <div
        style={{
          background: 'rgba(30, 30, 40, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#fff',
            margin: 0
          }}>
            Crop flyer image
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Crop Area */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Image */}
          {imageSrc && (
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '100%',
                maxHeight: '100%',
                userSelect: 'none',
                pointerEvents: 'none',
                objectFit: 'contain'
              }}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement
                const container = containerRef.current
                if (container) {
                  // Wait a tick for image to render and get actual dimensions
                  setTimeout(() => {
                    const containerWidth = container.clientWidth
                    const containerHeight = container.clientHeight
                    const displayedWidth = img.offsetWidth
                    const displayedHeight = img.offsetHeight
                    const offsetX = (containerWidth - displayedWidth) / 2
                    const offsetY = (containerHeight - displayedHeight) / 2
                    
                    setImageInfo({
                      naturalWidth: img.naturalWidth,
                      naturalHeight: img.naturalHeight,
                      displayedWidth,
                      displayedHeight,
                      offsetX,
                      offsetY
                    })
                  }, 100)
                }
              }}
            />
          )}

          {/* Crop area - transparent window with dark overlay */}
          <div
            style={{
              position: 'absolute',
              left: `${cropArea.x}px`,
              top: `${cropArea.y}px`,
              width: `${cropArea.width}px`,
              height: `${cropArea.height}px`,
              border: '2px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              pointerEvents: 'none'
            }}
          >
            {/* Crop grid */}
            <div style={{
              position: 'absolute',
              top: '33.33%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.5)'
            }} />
            <div style={{
              position: 'absolute',
              top: '66.66%',
              left: 0,
              right: 0,
              height: '1px',
              background: 'rgba(255, 255, 255, 0.5)'
            }} />
            <div style={{
              position: 'absolute',
              left: '33.33%',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(255, 255, 255, 0.5)'
            }} />
            <div style={{
              position: 'absolute',
              left: '66.66%',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'rgba(255, 255, 255, 0.5)'
            }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
          >
            Crop
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

