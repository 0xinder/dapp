import { useEffect, useState } from "react"

export interface Coordinates {
  lat: number
  lng: number
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [load, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
  }, [])

  return { location, error, load }
}
