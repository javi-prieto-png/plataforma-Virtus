"use client";

import { useEffect, useState } from "react";
import { getStudentInboxAction } from "@/actions/chat";
import Link from "next/link";

export default function StudentInboxPage() {
  const [inbox, setInbox] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getStudentInboxAction();
      if (res.inbox) setInbox(res.inbox);
      setLoading(false);
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-light tracking-widest text-white uppercase">
            Mi Buz\u00f3n <span className="text-cyan-400 font-bold">MENSAJES_VIRTUS</span>
          </h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-2">
            Seguimiento de tus dudas y consultas directas
          </p>
        </div>
        <Link 
          href="/dashboard/chat" 
          className="px-6 py-2 border border-zinc-800 text-[10px] text-zinc-400 uppercase tracking-widest hover:border-cyan-500 hover:text-cyan-400 transition-all font-bold"
        >
          Chat General
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inbox.length === 0 ? (
        <div className="p-20 border border-zinc-900 bg-zinc-950/50 text-center">
          <p className="text-zinc-600 text-xs uppercase tracking-[0.3em] mb-4">No tienes conversaciones activas</p>
          <Link href="/cursos" className="text-cyan-500 text-[10px] uppercase tracking-widest hover:underline">Ir a los cursos para preguntar dudas</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inbox.map((item, idx) => (
            <Link 
              key={idx} 
              href={`/dashboard/chat${item.videoId ? `?video=${item.videoId}` : ''}`}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                   {item.videoId ? '\u25b6' : '\u2709'}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                      {item.videoTitle}
                    </h3>
                    <span className="text-[8px] border border-zinc-800 px-2 py-0.5 text-zinc-500 uppercase font-mono">
                      {item.videoId ? 'Consulta V\u00eddeo' : 'Soporte Directo'}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1 line-clamp-1 italic max-w-xl">
                    "{item.lastMessage.slice(0, 80)}{item.lastMessage.length > 80 ? '...' : ''}"
                  </p>
                  <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] mt-1 font-bold">
                    \u00daltima respuesta: {new Date(item.lastMessageAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-4 relative z-10">
                <div className="px-5 py-2 border border-cyan-500/20 text-[9px] text-cyan-400 uppercase tracking-[0.2em] font-bold bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors">
                  Continuar Chat
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-bl-full transition-all duration-700 pointer-events-none" />
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-10 p-6 border border-dashed border-zinc-900 text-center">
         <p className="text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
           Cualquier duda enviada desde la p\u00e1gina de un v\u00eddeo aparecer\u00e1 autom\u00e1ticamente en este listado como un hilo independiente.
         </p>
      </div>
    </div>
  );
}
