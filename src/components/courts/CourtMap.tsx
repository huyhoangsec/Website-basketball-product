"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useCourts } from "@/hooks/usePublicData";
import { Court } from "@/types";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icon issue
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function CourtMap() {
  const { data: courts = [] } = useCourts();
  const center: [number, number] = [20.982, 105.954];

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-border/50">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {courts.map((court: Court) => (
          <Marker
            key={court.id}
            position={[court.latitude, court.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm text-navy mb-1">{court.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{court.address}</p>
                <p className="text-xs text-orange font-medium">{court.classCount} lớp đang hoạt động</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
