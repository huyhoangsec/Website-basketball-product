"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

const presetLocations = [
  { name: "Vinhomes Ocean Park 1 (Ngọc Trai, Gia Lâm)", lat: 21.0035, lng: 105.9520 },
  { name: "Vinhomes Ocean Park 2 (Chà Là, Hưng Yên)", lat: 20.9780, lng: 105.9810 },
  { name: "Vinhomes Ocean Park 3 (Phố Biển, Hưng Yên)", lat: 20.9650, lng: 105.9920 },
  { name: "Vinhomes Times City (Minh Khai, Hai Bà Trưng)", lat: 20.9950, lng: 105.8670 },
  { name: "Vinhomes Royal City (Nguyễn Trãi, Thanh Xuân)", lat: 21.0030, lng: 105.8150 },
];

const DynamicMap = dynamic(
  () => import("./MapPickerCore"),
  { ssr: false, loading: () => <div className="w-full h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">Đang tải bản đồ tương tác...</div> }
);

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationPickerMap({ latitude, longitude, onChange }: LocationPickerProps) {
  const [latInput, setLatInput] = useState(String(latitude || 21.0035));
  const [lngInput, setLngInput] = useState(String(longitude || 105.9520));

  useEffect(() => {
    setLatInput(String(latitude));
    setLngInput(String(longitude));
  }, [latitude, longitude]);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = presetLocations.find((p) => p.name === e.target.value);
    if (selected) {
      setLatInput(String(selected.lat));
      setLngInput(String(selected.lng));
      onChange(selected.lat, selected.lng);
    }
  };

  const handleManualLat = (val: string) => {
    setLatInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) onChange(parsed, parseFloat(lngInput) || 105.9520);
  };

  const handleManualLng = (val: string) => {
    setLngInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) onChange(parseFloat(latInput) || 21.0035, parsed);
  };

  return (
    <div className="space-y-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-navy flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-orange" />
          Vị trí tọa độ trên bản đồ (Click bản đồ để chọn)
        </Label>
        <span className="text-[10px] text-slate-500 font-medium">
          Lat: {latitude} | Lng: {longitude}
        </span>
      </div>

      {/* Preset Location Quick Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-navy" /> Chọn nhanh vị trí điểm sân mẫu:
        </label>
        <select
          onChange={handlePresetChange}
          className="w-full text-xs p-2 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange"
        >
          <option value="">-- Chọn khu vực Vinhomes Ocean Park --</option>
          {presetLocations.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Interactive Map Picker Container */}
      <div className="w-full h-52 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
        <DynamicMap
          lat={latitude || 21.0035}
          lng={longitude || 105.9520}
          onSelectLocation={(newLat, newLng) => {
            setLatInput(String(newLat.toFixed(5)));
            setLngInput(String(newLng.toFixed(5)));
            onChange(Number(newLat.toFixed(5)), Number(newLng.toFixed(5)));
          }}
        />
      </div>

      {/* Numerical Coordinate Inputs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[10px] font-medium text-slate-500">Vĩ độ (Latitude)</label>
          <Input
            value={latInput}
            onChange={(e) => handleManualLat(e.target.value)}
            className="text-xs h-8 border-slate-200 focus-visible:ring-orange"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-slate-500">Kinh độ (Longitude)</label>
          <Input
            value={lngInput}
            onChange={(e) => handleManualLng(e.target.value)}
            className="text-xs h-8 border-slate-200 focus-visible:ring-orange"
          />
        </div>
      </div>
    </div>
  );
}
