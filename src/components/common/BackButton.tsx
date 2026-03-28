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
      className="fixed top-6 right-6 z-[100] flex items-center gap-1 px-2.5 py-1.5 bg-black/80 backdrop-blur-md border border-zinc-900 text-zinc-500 text-[10px] hover:border-cyan-500/50 hover:text-cyan-400 transition-all group"
    >
      <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
      volver
    </button>
  );
}
