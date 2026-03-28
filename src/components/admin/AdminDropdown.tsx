"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ShieldAlert, User } from "lucide-react";

export default function AdminDropdown({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const textSize = isMobile ? "text-sm" : "text-xl";
  const iconSize = isMobile ? 18 : 24;

  return (
    <div className={`relative ${isMobile ? "" : "mb-12"}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border-none outline-none group gap-2"
        title="Cambiar Panel"
      >
        <h1 className={`${textSize} font-bold tracking-widest uppercase mb-0`}>
          VIRTUS<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-extrabold">_ADMIN</span>
        </h1>
        <ChevronDown 
          size={iconSize} 
          className={`text-cyan-400 transition-transform ${isOpen ? "rotate-180" : ""} bg-zinc-900 rounded-full p-0.5 group-hover:bg-zinc-800`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-56 bg-black border border-zinc-900 rounded-md shadow-2xl overflow-hidden z-[100]">
          <div className="flex flex-col p-1.5 gap-1">
            <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-950/20 rounded hover:bg-zinc-900 transition-colors"
            >
              <ShieldAlert size={15} />
              Panel Admin
            </Link>
            <Link 
              href="/dashboard" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 rounded transition-colors"
            >
              <User size={15} />
              Panel Usuario
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
