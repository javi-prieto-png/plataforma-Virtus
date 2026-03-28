"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { sendMessageAction, getConversationAction } from "@/actions/chat";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function AdminConversationPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const res = await getConversationAction(userId as string);
      if (res.messages) setMessages(res.messages);
    }
    load();
    const interval = setInterval(load, 5000); 
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(formData: FormData) {
    setError(null);
    const content = formData.get("content") as string;
    if (!content.trim()) return;

    startTransition(async () => {
      // Forzamos el receiverId para que sea el estudiante actual
      if (!userId) {
        setError("Error: Identificador de usuario no válido.");
        return;
      }
      formData.set("receiverId", userId as string);
      const res = await sendMessageAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        const update = await getConversationAction(userId as string);
        if (update.messages) setMessages(update.messages);
      }
    });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto border border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden relative group">
      {/* Header Chat Admin */}
      <div className="p-4 border-b border-zinc-900 bg-black flex justify-between items-center px-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/chat" className="text-zinc-600 hover:text-cyan-400 transition-colors uppercase text-[10px] tracking-widest font-bold">
            ❮ Volver
          </Link>
          <div className="h-4 w-px bg-zinc-800 mx-2" />
          <div>
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">Chat con Estudiante</h2>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Soporte Directo VIRTUS_ID: {userId?.slice(0,8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[9px] text-cyan-500 font-mono tracking-widest uppercase">Admin_Access_Established</span>
        </div>
      </div>

      {/* Cuerpo del Chat */}
      <div 
        ref={scrollRef}
        className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"
      >
        {messages.map((msg) => {
          const isMe = msg.sender.role === "ADMIN";
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[75%] p-5 border shadow-xl ${isMe ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800 bg-zinc-900/80 backdrop-blur-sm'}`}>
                <div className="flex justify-between items-center gap-6 mb-3">
                   <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">
                    {isMe ? 'Tú (Administrador)' : `Alumno: ${msg.sender.name}`}
                  </p>
                  <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-[13px] text-zinc-200 leading-relaxed font-light whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input de Mensaje Admin */}
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
            placeholder="RESPONDE AL ALUMNO..."
            autoComplete="off"
            className="flex-grow bg-zinc-950 border border-zinc-800 p-3 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-700"
          />
          <button 
            type="submit"
            disabled={isPending}
            className="px-8 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-amber-400 transition-all disabled:opacity-50"
          >
            {isPending ? "ENVIANDO..." : "Enviar Respuesta"}
          </button>
        </form>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 -z-10 rounded-bl-full pointer-events-none" />
    </div>
  );
}
