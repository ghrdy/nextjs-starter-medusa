"use client"

import { useEffect, useRef } from "react"

// Déclaration des types pour Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any
        Marker: new (options: any) => any
        Geocoder: new () => {
          geocode: (
            request: { address: string },
            callback: (
              results: Array<{
                geometry: {
                  location: {
                    lat: () => number
                    lng: () => number
                  }
                }
              }>,
              status: string
            ) => void
          ) => void
        }
        Animation: {
          DROP: number
        }
      }
    }
  }
}

type GoogleMapProps = {
  address: string
  apiKey: string
  className?: string
}

const GoogleMap = ({ address, apiKey, className = "" }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fonction pour charger et initialiser la carte Google Maps
    const initMap = () => {
      if (!window.google || !mapRef.current) return

      // Geocoder pour convertir l'adresse en coordonnées
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          // Vérifier à nouveau que l'élément existe avant de créer la carte
          if (!mapRef.current) return

          const map = new window.google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 16,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          })

          new window.google.maps.Marker({
            map,
            position: results[0].geometry.location,
            animation: window.google.maps.Animation.DROP,
            title: "Bella Vista Restaurant",
          })
        } else {
          console.error("Geocode error: " + status)
        }
      })
    }

    // Vérifier si l'API Google Maps est déjà chargée
    if (window.google && window.google.maps) {
      initMap()
    } else {
      // Charger l'API Google Maps
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)

      return () => {
        // Nettoyer le script si le composant est démonté avant le chargement
        document.head.removeChild(script)
      }
    }
  }, [address, apiKey])

  return (
    <div
      className={`w-full h-96 rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default GoogleMap
