import { useEffect, useState } from 'react'
import { sendDonorLocation } from '../socket'

export function useLiveTracking(requestId: string | null, isActive: boolean) {
  const [error, setError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    let watchId: number

    if (isActive && requestId) {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser')
        return
      }

      setIsSharing(true)
      
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          // Validate coordinates before sending to backend
          if (typeof longitude === 'number' && typeof latitude === 'number' && 
              !isNaN(longitude) && !isNaN(latitude)) {
            sendDonorLocation(requestId, [longitude, latitude])
          }
        },
        (err) => {
          console.error("Location tracking error:", err)
          setError(err.message)
          setIsSharing(false)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      )
    } else {
      setIsSharing(false)
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [isActive, requestId])

  return { isSharing, error }
}
