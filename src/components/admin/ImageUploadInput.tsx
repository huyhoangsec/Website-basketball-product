"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadImage } from "@/hooks/useAdminWebsite";
import { Upload, Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = "Hình ảnh / Avatar",
  placeholder = "/images/img1.jpg hoặc URL ảnh",
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useUploadImage();
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh (JPG, PNG, WEBP, GIF)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Dung lượng file tối đa 10MB");
      return;
    }

    try {
      const res = await upload(file);
      const uploadedPath = res.path || res.url;
      onChange(uploadedPath);
      toast.success("Tải ảnh từ máy tính thành công!");
    } catch {
      toast.error("Tải ảnh từ máy tính thất bại");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-navy flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-orange" />
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Gỡ ảnh
          </button>
        )}
      </div>

      {/* Preview Box */}
      {value ? (
        <div className="relative w-full h-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={value.startsWith("http") || value.startsWith("/uploads")}
          />
          <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-xs bg-white text-navy hover:bg-slate-100"
              onClick={() => fileInputRef.current?.click()}
            >
              Đổi ảnh khác
            </Button>
          </div>
        </div>
      ) : (
        /* Dropzone Upload Box */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-orange bg-orange/5"
              : "border-slate-300 hover:border-orange/60 bg-slate-50/50"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-3 text-navy">
              <Loader2 className="w-6 h-6 animate-spin text-orange mb-1" />
              <p className="text-xs font-medium">Đang tải ảnh lên máy chủ...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 text-slate-500">
              <Upload className="w-6 h-6 text-orange mb-1" />
              <p className="text-xs font-bold text-navy">Bấm vào đây để chọn ảnh từ máy tính</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hoặc kéo thả file ảnh (JPG, PNG, WEBP) vào đây</p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL Input Fallback */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-slate-200 focus-visible:ring-orange text-xs h-8"
      />
    </div>
  );
}
