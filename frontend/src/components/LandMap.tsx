"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { LatLngExpression } from "leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for broken Leaflet marker icon
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/icons/triangle.svg",
    iconUrl: "/icons/remaining.svg",
    shadowUrl: "/icons/resolved.svg",
})

interface LandMapProps {
  lat: number
  lng: number
  zoom?: number
}

const LandMap = ({ lat, lng, zoom = 18 }: LandMapProps) => {
  const position: LatLngExpression = [lat, lng]

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border max-w-2xl">
      <MapContainer center={position} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default LandMap
