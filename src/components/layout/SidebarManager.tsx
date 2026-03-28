"use client";

import { useState, ReactNode } from "react";
import { Menu, X } from "lucide-react";

interface SidebarManagerProps {
  sidebarContent: ReactNode;
  children: ReactNode;
  isAdmin?: boolean;
}

export default function SidebarManager({ sidebarContent, children, isAdmin }: SidebarManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white relative">
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 w-full h-16 bg-black border-b border-zinc-900 z-[60] flex items-center justify-between px-6">
        <h1 className="text-sm font-bold tracking-widest uppercase">
          VIRTUS<span className={isAdmin ? "text-amber-500" : "text-cyan-400"}>{isAdmin ? "_ADMIN" : "."}</span>
        </h1>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-zinc-900 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {sidebarContent}
      </aside>

      {/* OVERLAY for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow pt-16 lg:pt-0 min-h-screen overflow-x-hidden">
        <div className="p-6 lg:p-12 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
