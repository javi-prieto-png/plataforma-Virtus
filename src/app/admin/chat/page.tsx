"use client";

import { useEffect, useState } from "react";
import { getAdminInboxAction } from "@/actions/chat";
import Link from "next/link";

export default function AdminInboxPage() {
  const [inbox, setInbox] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getAdminInboxAction();
      if (res.inbox) setInbox(res.inbox);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000); // Polling cada 10 seg
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-2xl font-light tracking-widest text-white uppercase">
          Bandeja de Entrada <span className="text-cyan-400 font-bold">VIRTUS_CHAT</span>
        </h2>
        <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-2">
          Gestión de conversaciones activas con alumnos
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inbox.length === 0 ? (
        <div className="p-20 border border-zinc-900 bg-zinc-950/50 text-center">
          <p className="text-zinc-600 text-xs uppercase tracking-[0.3em]">No hay conversaciones iniciadas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inbox.map((item) => (
            <Link 
              key={item.id} 
              href={`/admin/chat/${item.id}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                  {item.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">
                    Última interacción: {new Date(item.lastMessageAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-4 relative z-10">
                <span className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase">ID: {item.id.slice(0,8)}</span>
                <div className="px-4 py-1 border border-cyan-500/20 text-[9px] text-cyan-400 uppercase tracking-widest font-bold bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors">
                  Abrir Chat
                </div>
              </div>

              {/* Glow sutil */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-bl-full transition-all duration-700 pointer-events-none" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
