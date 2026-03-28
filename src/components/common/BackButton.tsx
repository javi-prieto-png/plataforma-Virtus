"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // No mostrar en la ra\u00edz, login o dashboard principal
  const hiddenRoutes = ["/", "/login", "/dashboard", "/admin"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <button
      onClick={() => router.back()}
      className="fixed bottom-8 left-8 z-[60] flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all group"
    >
      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
      Volver al Nivel Anterior
    </button>
  );
}
