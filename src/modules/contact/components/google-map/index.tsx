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
            url: "/images/store-marker-container.svg",
            scaledSize: new window.google.maps.Size(80, 100),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(40, 100),
          }

          const marker = new window.google.maps.Marker({
            map,
            position: location,
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
              background-size: 100%;
              background-position: center;
              position: absolute;
              top: 6px;
              left: 6px;
              border-radius: 6px;
              z-index: 1;
              opacity: 0;
              animation: fadeIn 0.3s ease-in forwards;
              cursor: pointer;
              transition: transform 0.2s ease-in-out;
            }

            .store-image:hover {
              transform: scale(1.05);
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `
          document.head.appendChild(style)

          // Créer un div pour l'image et l'ajouter au marqueur
          const imageOverlay = document.createElement("div")
          imageOverlay.className = "store-image"
          imageOverlay.addEventListener("click", () => {
            window.open(
              "https://www.google.com/maps/place/La+Bella+Vista/@48.6202061,2.4868062,17z/data=!3m1!4b1!4m6!3m5!1s0x47e5e1d54582bc73:0x99e80ab97417a766!8m2!3d48.6202027!4d2.4916771!16s%2Fg%2F11tdqgv54n?entry=ttu&g_ep=EgoyMDI1MDQwNi4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D",
              "_blank"
            )
          })

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
      // Vérifier si le script est déjà en cours de chargement
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com/maps/api/js"]'
      )
      if (!existingScript) {
        // Charger l'API Google Maps
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
        script.async = true
        script.defer = true
        script.onload = initMap
        document.head.appendChild(script)
      } else {
        // Si le script existe déjà, attendre qu'il soit chargé
        existingScript.addEventListener("load", initMap)
      }

      return () => {
        // Nettoyer le script si le composant est démonté avant le chargement
        const script = document.querySelector(
          'script[src*="maps.googleapis.com/maps/api/js"]'
        )
        if (script) {
          script.removeEventListener("load", initMap)
        }
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
    <div className={`w-full rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

export default GoogleMap
