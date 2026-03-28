"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { sendMessageAction, getConversationAction } from "@/actions/chat";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function StudentChatPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("video") || null;

  const [messages, setMessages] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carga inicial y polling
  useEffect(() => {
    async function load() {
      const res = await getConversationAction(undefined, videoId as string);
      if (res.messages) setMessages(res.messages);
    }
    load();
    const interval = setInterval(load, 5000); 
    return () => clearInterval(interval);
  }, [videoId]);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(formData: FormData) {
    setError(null);
    const content = formData.get("content") as string;
    if (!content.trim()) return;

    if (videoId) {
      formData.set("videoId", videoId);
    }

    startTransition(async () => {
      const res = await sendMessageAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        const update = await getConversationAction(undefined, videoId as string);
        if (update.messages) setMessages(update.messages);
      }
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto border border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden relative group">
      {/* Header Chat */}
      <div className="p-4 border-b border-zinc-900 bg-black flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/chat/inbox" className="text-zinc-600 hover:text-cyan-400 transition-colors uppercase text-[9px] tracking-widest font-bold">
            ❮ Mi Buz\u00f3n
          </Link>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              {messages[0]?.video?.title ? `Duda: ${messages[0].video.title}` : 'Soporte VIRTUS'}
            </h2>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Comunicaci\u00f3n Encriptada</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[9px] text-cyan-400 font-mono tracking-widest uppercase">Live_Node</span>
        </div>
      </div>

      {/* Cuerpo del Chat (Scrollable) */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
             <p className="text-xs uppercase tracking-[0.3em] font-light">No hay mensajes previos</p>
             <p className="text-[10px] uppercase tracking-widest">Inicia la conversación para resolver tus dudas</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender.role === "STUDENT";
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[80%] p-4 border ${isMe ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">
                    {isMe ? 'Tú' : 'Administrador'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-zinc-200 leading-relaxed font-light whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input de Mensaje */}
      <div className="p-4 border-t border-zinc-900 bg-black">
        {error && <p className="text-[10px] text-red-500 mb-2 uppercase tracking-widest font-mono text-center">⚠ {error}</p>}
        <form 
          action={handleSend}
          className="flex gap-2"
          onSubmit={(e) => {
            const form = e.currentTarget;
            setTimeout(() => form.reset(), 10);
          }}
        >
          <input 
            type="text" 
            name="content"
            placeholder="ESCRIBE TU MENSAJE AQUÍ..."
            autoComplete="off"
            className="flex-grow bg-zinc-950 border border-zinc-800 p-3 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            disabled={isPending}
            className="px-6 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50"
          >
            {isPending ? "..." : "Enviar"}
          </button>
        </form>
      </div>

      {/* Decoración Estética */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 -z-10 rounded-bl-full pointer-events-none" />
    </div>
  );
}
