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
        Size: new (width: number, height: number) => any
        Point: new (x: number, y: number) => any
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
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const locationRef = useRef<any>(null)

  useEffect(() => {
    // Fonction pour charger et initialiser la carte Google Maps
    const initMap = () => {
      if (!window.google || !mapRef.current) return

      // Geocoder pour convertir l'adresse en coordonnées
      const geocoder = new window.google.maps.Geocoder()

      geocoder.geocode({ address }, (results: any, status: string) => {
        if (status === "OK" && results && results[0]) {
          // Vérifier à nouveau que l'élément existe avant de créer la carte
          if (!mapRef.current) return

          const location = results[0].geometry.location
          locationRef.current = location

          const map = new window.google.maps.Map(mapRef.current, {
            center: location,
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

          mapInstanceRef.current = map

          // Créer une icône personnalisée pour le marqueur avec le cadre SVG
          const markerIcon = {
            url: "/images/store-marker-container.svg", // Utiliser le fichier SVG externe
            scaledSize: new window.google.maps.Size(80, 100), // Taille adaptée au conteneur
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(40, 100), // Point d'ancrage (centre en bas)
          }

          const marker = new window.google.maps.Marker({
            map,
            position: location,
            animation: window.google.maps.Animation.DROP,
            title: "Bella Vista Restaurant",
            icon: markerIcon,
          })

          markerRef.current = marker

          // Ajouter un style personnalisé pour l'image
          const style = document.createElement("style")
          style.textContent = `
            .store-image {
              width: 64px;
              height: 68px;
              background-image: url('/images/bellavista-store-hq.jpg');
              background-size: cover;
              background-position: center;
              position: absolute;
              top: 6px;
              left: 6px;
              border-radius: 6px;
              z-index: 1;
            }
          `
          document.head.appendChild(style)

          // Créer un div pour l'image et l'ajouter au marqueur
          const imageOverlay = document.createElement("div")
          imageOverlay.className = "store-image"

          // Attendre que le marqueur soit rendu avant d'ajouter l'overlay
          setTimeout(() => {
            const markerElement = document.querySelector(
              `[title="Bella Vista Restaurant"]`
            )
            if (markerElement) {
              markerElement.appendChild(imageOverlay)
            }
          }, 100)
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

  // Écouter l'événement de recentrage
  useEffect(() => {
    const handleRecenter = () => {
      if (mapInstanceRef.current && locationRef.current) {
        mapInstanceRef.current.setCenter(locationRef.current)
        mapInstanceRef.current.setZoom(16)
      }
    }

    window.addEventListener("recenter-map", handleRecenter)

    return () => {
      window.removeEventListener("recenter-map", handleRecenter)
    }
  }, [])

  return (
    <div
      className={`w-full h-96 rounded-lg overflow-hidden shadow-sm ${className}`}
    >
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default GoogleMap
