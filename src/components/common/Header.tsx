'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-orange-500 flex items-center gap-2">
          <span>🏀 Ocean Basketball</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-400 transition">Trang chủ</Link>
          <Link href="/hoc-thu" className="hover:text-orange-400 transition">Đăng ký học thử</Link>
          <Link href="/dashboard" className="hover:text-orange-400 transition">Quản lý lớp học</Link>
        </nav>
        <button 
          aria-label="Toggle Navigation"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white"
        >
          ☰
        </button>
      </div>
    </header>
  );
}