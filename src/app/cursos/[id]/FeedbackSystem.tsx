"use client";

import { useTransition, useState } from "react";
import { submitVideoFeedbackAction } from "@/actions/student";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackSystemProps {
  videoId: string;
  initialStatus?: string | null;
}

export default function FeedbackSystem({ videoId, initialStatus }: FeedbackSystemProps) {
  const [likeStatus, setLikeStatus] = useState<string | null>(initialStatus || null);
  const [showDislikeMotivo, setShowDislikeMotivo] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleFeedback = (status: "LIKE" | "DISLIKE") => {
    setLikeStatus(status);
    setStatusMsg(null);
    
    if (status === "DISLIKE") {
      setShowDislikeMotivo(true);
    } else {
      setShowDislikeMotivo(false);
      // Enviar like inmediatamente
      const formData = new FormData();
      formData.append("videoId", videoId);
      formData.append("likeStatus", status);
      startTransition(async () => {
        await submitVideoFeedbackAction(formData);
        setStatusMsg("GRACIAS POR TU VALORACIÓN");
      });
    }
  };

  const handleSubmitQuestion = async (formData: FormData) => {
    setStatusMsg(null);
    startTransition(async () => {
      const result = await submitVideoFeedbackAction(formData);
      if (result.success) {
        setStatusMsg("CONSULTA RECIBIDA. COORDINA EN EL BUZÓN GLOBAL.");
        (document.getElementById("feedback-form") as HTMLFormElement)?.reset();
        setShowDislikeMotivo(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Botones de Feedback */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => handleFeedback("LIKE")}
          className={`flex items-center justify-center gap-2 p-4 border transition-all duration-300 w-14 h-14 ${
            likeStatus === "LIKE" 
              ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.6)]" 
              : "border-zinc-800 text-zinc-500 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
          }`}
          title="ME GUSTA"
        >
          <ThumbsUp size={20} fill={likeStatus === "LIKE" ? "currentColor" : "none"} />
        </button>
        <button 
          onClick={() => handleFeedback("DISLIKE")}
          className={`flex items-center justify-center gap-2 p-4 border transition-all duration-300 w-14 h-14 ${
            likeStatus === "DISLIKE" 
              ? "bg-red-500 border-red-400 text-black shadow-[0_0_20px_rgba(239,68,68,0.6)]" 
              : "border-zinc-800 text-zinc-500 hover:border-red-500/50 hover:text-red-400 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          }`}
          title="NO ME GUSTA / CONFUSO"
        >
          <ThumbsDown size={20} fill={likeStatus === "DISLIKE" ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Formulario de Dudas o Motivo Dislike */}
      <form id="feedback-form" action={handleSubmitQuestion} className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl relative transition-all duration-500">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden transition-all duration-500 ease-in-out">
            <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors duration-500 ${showDislikeMotivo ? 'text-red-400' : 'text-cyan-400'}`}>
              <div className={`w-1 h-3 transition-colors duration-500 ${showDislikeMotivo ? 'bg-red-500' : 'bg-cyan-500'}`} />
              {showDislikeMotivo ? "Motivo del Descontento (Obligatorio)" : "Buzón de Dudas Privado"}
            </label>
          </div>
          
          <input type="hidden" name="videoId" value={videoId} />
          <input type="hidden" name="likeStatus" value={likeStatus || ""} />

          <textarea 
            name="content"
            required={showDislikeMotivo}
            placeholder={showDislikeMotivo ? "Explica brevemente qué podemos mejorar..." : "Escribe aquí tu duda. Será enviada directamente al administrador de forma privada."}
            className={`w-full bg-black border p-4 text-sm text-zinc-300 focus:outline-none transition-all duration-500 min-h-[120px] resize-none placeholder:text-zinc-700 ${
              showDislikeMotivo ? 'border-red-900/50 focus:border-red-500' : 'border-zinc-800 focus:border-cyan-500'
            }`}
          />

          <button 
            type="submit"
            disabled={isPending}
            className={`self-end px-8 py-3 bg-transparent border text-xs font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 ${
              showDislikeMotivo 
                ? 'border-red-500 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]'
            }`}
          >
            {isPending ? "ENVIANDO..." : (showDislikeMotivo ? "ENVIAR RESTRICCIÓN" : "ENVIAR CONSULTA")}
          </button>
        </div>

        {statusMsg && (
          <div className="absolute -bottom-10 left-0 right-0 text-center text-cyan-500 text-[10px] font-mono tracking-widest uppercase animate-fade-in">
            [ {statusMsg} ]
          </div>
        )}
      </form>
      
      <p className="text-[10px] text-zinc-600 font-mono text-center uppercase tracking-widest">
        Toda comunicación es cifrada y solo compartida con el equipo directivo.
      </p>
    </div>
  );
}
