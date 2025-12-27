"use client";

import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <LogOut className="h-8 w-8 text-text-primary" />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          Đăng xuất
        </h2>

        {/* Question */}
        <p className="mb-6 text-center text-gray-600">
          Bạn có muốn đăng xuất không?
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-accent px-4 py-3 font-medium text-text-primary transition-colors hover:bg-accent/90"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

