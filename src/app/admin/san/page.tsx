"use client";

import { useState } from "react";
import { useAdminCourts } from "@/hooks/useAdmin";
import { Court } from "@/types";
import DataTable from "@/components/admin/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import LocationPickerMap from "@/components/admin/LocationPickerMap";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Trash, MapPin, Image as ImageIcon } from "lucide-react";

export default function AdminCourtsPage() {
  const { courts, createCourt, updateCourt, deleteCourt } = useAdminCourts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(21.0035);
  const [longitude, setLongitude] = useState(105.9520);
  const [mainImage, setMainImage] = useState("");
  const [imagesStr, setImagesStr] = useState("");
  const [facilitiesStr, setFacilitiesStr] = useState("");

  const handleOpenAdd = () => {
    setEditingCourt(null);
    setName("");
    setAddress("");
    setLatitude(21.0035);
    setLongitude(105.9520);
    setMainImage("/images/img5.jpg");
    setImagesStr("/images/img5.jpg, /images/img6.jpg, /images/img7.jpg");
    setFacilitiesStr("Sân thảm FIBA, Đèn LED, Cabin thay đồ");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (court: Court) => {
    setEditingCourt(court);
    setName(court.name);
    setAddress(court.address);
    setLatitude(court.latitude || 21.0035);
    setLongitude(court.longitude || 105.9520);
    const imgs = court.images || [];
    setMainImage(imgs[0] || "/images/img5.jpg");
    setImagesStr(imgs.join(", "));
    setFacilitiesStr(court.facilities.join(", "));
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !latitude || !longitude) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    let images = imagesStr
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img !== "");

    if (mainImage && !images.includes(mainImage)) {
      images = [mainImage, ...images];
    }

    const facilities = facilitiesStr
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    if (editingCourt) {
      // Edit
      updateCourt({
        id: editingCourt.id,
        data: {
          name,
          address,
          latitude: Number(latitude),
          longitude: Number(longitude),
          images: images.length > 0 ? images : ["/images/img5.jpg"],
          facilities,
        }
      });
    } else {
      // Add
      createCourt({
        name,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude),
        facilities,
        images: images.length > 0 ? images : ["/images/img5.jpg"],
        classCount: 0,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (court: Court) => {
    setEditingCourt(court);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (editingCourt) {
      if (editingCourt.id) {
        deleteCourt(editingCourt.id);
      } else {
        toast.error("Không tìm thấy ID của Sân bóng để xóa!");
      }
      setIsDeleteOpen(false);
      setEditingCourt(null);
    }
  };

  const columns: ColumnDef<Court>[] = [
    {
      accessorFn: (_, index) => index + 1,
      id: "index",
      header: "STT",
      cell: (info) => <span className="font-medium text-slate-500">{info.getValue() as number}</span>,
    },
    {
      accessorKey: "name",
      header: "Tên điểm sân",
      cell: ({ row }) => {
        const court = row.original;
        const mainImg = court.images?.[0] || "/images/img5.jpg";
        return (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-9 rounded-md overflow-hidden border border-slate-200 shrink-0">
              <Image src={mainImg} alt={court.name} fill className="object-cover" />
            </div>
            <div className="font-bold text-navy flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-orange shrink-0" />
              {court.name}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Địa chỉ cụ thể",
      cell: ({ row }) => <span className="text-xs text-slate-600 line-clamp-1">{row.original.address}</span>,
    },
    {
      accessorKey: "classCount",
      header: "Số lớp dạy",
      cell: ({ row }) => (
        <Badge variant="outline" className="border-navy text-navy font-bold text-xs bg-slate-50">
          {row.original.classCount} Lớp
        </Badge>
      ),
    },
    {
      accessorKey: "facilities",
      header: "Tiện ích & Danh sách Ảnh",
      cell: ({ row }) => {
        const court = row.original;
        return (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1 max-w-xs">
              {court.facilities.map((fac, idx) => (
                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-600 text-[9px]">
                  {fac}
                </Badge>
              ))}
            </div>
            {court.images && court.images.length > 0 && (
              <p className="text-[10px] text-orange font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> {court.images.length} ảnh sân thực tế
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-slate-600 hover:text-navy"
            onClick={() => handleOpenEdit(row.original)}
            title="Sửa thông tin"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(row.original)}
            title="Xóa sân"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-navy">Quản lý Cụm Sân bóng rổ</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Danh sách sân bóng rổ, chọn vị trí điểm sân trên bản đồ tương tác và tải hình ảnh từ máy tính client
        </p>
      </div>

      <DataTable
        columns={columns}
        data={courts}
        searchKey="name"
        searchPlaceholder="Tìm tên sân bóng..."
        onAdd={handleOpenAdd}
        addLabel="Thêm Sân mới"
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border border-border max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-navy flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange" />
                {editingCourt ? "Cập nhật sân" : "Thêm mới cụm sân"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-xs">
                Chọn vị trí sân bóng trên bản đồ tương tác, chọn vị trí mẫu hoặc nhập thông tin tiện ích.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 text-slate-700 text-sm">
              {/* Image Uploader */}
              <ImageUploadInput
                label="Ảnh bìa sân chính (Tải từ máy tính)"
                value={mainImage}
                onChange={(newUrl) => {
                  setMainImage(newUrl);
                  if (newUrl && !imagesStr.includes(newUrl)) {
                    setImagesStr(imagesStr ? `${newUrl}, ${imagesStr}` : newUrl);
                  }
                }}
              />

              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="court-name" className="text-xs font-bold text-navy">
                  Tên cụm sân *
                </Label>
                <Input
                  id="court-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sân OceanPark 4 - The Bayfront"
                  className="border-slate-200 focus-visible:ring-orange"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <Label htmlFor="court-address" className="text-xs font-bold text-navy">
                  Địa chỉ chi tiết *
                </Label>
                <Input
                  id="court-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Phân khu The Bayfront, Vinhomes Ocean Park..."
                  className="border-slate-200 focus-visible:ring-orange"
                  required
                />
              </div>

              {/* Interactive Location Picker Map */}
              <LocationPickerMap
                latitude={latitude}
                longitude={longitude}
                onChange={(newLat, newLng) => {
                  setLatitude(newLat);
                  setLongitude(newLng);
                }}
              />

              {/* Additional Images */}
              <div className="space-y-1">
                <Label htmlFor="court-images" className="text-xs font-bold text-navy flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-orange" />
                  Danh sách đường dẫn ảnh bổ sung (ngăn cách bằng dấu phẩy)
                </Label>
                <Input
                  id="court-images"
                  value={imagesStr}
                  onChange={(e) => setImagesStr(e.target.value)}
                  placeholder="/images/img5.jpg, /images/img6.jpg"
                  className="border-slate-200 focus-visible:ring-orange text-xs"
                />
              </div>

              {/* Facilities */}
              <div className="space-y-1">
                <Label htmlFor="facilities" className="text-xs font-bold text-navy">
                  Tiện ích cơ sở vật chất (ngăn cách bằng dấu phẩy)
                </Label>
                <Input
                  id="facilities"
                  value={facilitiesStr}
                  onChange={(e) => setFacilitiesStr(e.target.value)}
                  placeholder="Sân thảm FIBA, Đèn LED, Cabin thay đồ..."
                  className="border-slate-200 focus-visible:ring-orange"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-navy hover:bg-navy-light text-white font-semibold">
                Lưu lại
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-border">
          <DialogHeader>
            <DialogTitle className="text-navy flex items-center gap-2">
              Xác nhận xóa sân
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Bạn có chắc chắn muốn xóa cụm sân <strong>{editingCourt?.name}</strong> khỏi hệ thống? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Xác nhận xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
