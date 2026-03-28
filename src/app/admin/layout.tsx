import React from "react";
import Link from "next/link";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SidebarManager from "@/components/layout/SidebarManager";
import BackButton from "@/components/common/BackButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  // Redundancia de seguridad para blindar la ruta
  if (!session || session.role !== "ADMIN") redirect("/dashboard");

  const sidebarContent = (
    <div className="flex flex-col p-8 h-full bg-black justify-between">
      <div>
        <h1 className="text-xl font-bold mb-12 tracking-widest uppercase">
          VIRTUS<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-extrabold">_ADMIN</span>
        </h1>
        <nav className="flex flex-col space-y-6">
          <Link href="/admin" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 hover:translate-x-1 transition-all">\u276f Dashboard</Link>
          <Link href="/admin/usuarios" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 hover:translate-x-1 transition-all">\u276f Alumnos</Link>
          <Link href="/admin/vod" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-cyan-400 hover:translate-x-1 transition-all">\u276f Biblioteca de VIRTUS</Link>
          <Link href="/admin/chat" className="relative group text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 hover:translate-x-1 transition-all flex items-center gap-2">
            \u276f Buz\u00f3n (Chat)
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" title="Conversaciones Activas" />
          </Link>
          <Link href="/admin/configuracion" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-cyan-400 hover:translate-x-1 transition-all">\u276f Configuraci\u00f3n</Link>
        </nav>
      </div>
      
      <div className="text-[10px] text-zinc-700 font-mono tracking-widest uppercase">
        PROTOCOL: GATEKEEPER<br/>
        ENV: STRICT
      </div>
    </div>
  );

  return (
    <SidebarManager sidebarContent={sidebarContent} isAdmin>
      {children}
      <BackButton />
    </SidebarManager>
  );
}
