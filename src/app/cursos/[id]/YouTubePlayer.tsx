"use client";

import { useEffect, useRef, useState } from "react";
import { markVideoAsWatchedAction } from "@/actions/student";

interface YouTubePlayerProps {
  videoId: string;
  youtubeUrl: string;
}

export default function YouTubePlayer({ videoId, youtubeUrl }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWatched, setIsWatched] = useState(false);
  
  // Extraer el ID real de YouTube de la URL
  const ytIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/);
  const ytId = ytIdMatch ? ytIdMatch[1] : null;

  useEffect(() => {
    if (!ytId) return;

    // Cargar la API de IFrame de YouTube si no está ya cargada
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let player: any;

    const onPlayerReady = (event: any) => {
      // Omitimos autoplay por ahora
    };

    const onPlayerStateChange = async (event: any) => {
      // event.data === 0 significa que el video ha terminado (ENDED)
      if (event.data === 0 && !isWatched) {
        console.log("Video finalizado. Registrando progreso...");
        const result = await markVideoAsWatchedAction(videoId);
        if (result?.success) {
          setIsWatched(true);
        }
      }
    };

    // Inicializar el reproductor cuando la API esté lista
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player(`player-${videoId}`, {
        height: '100%',
        width: '100%',
        videoId: ytId,
        playerVars: {
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Si la API ya está cargada, inicializamos directamente
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, [ytId, videoId, isWatched]);

  if (!ytId) {
    return (
      <div className="aspect-video bg-zinc-950 border border-zinc-900 flex items-center justify-center text-red-500 font-mono text-xs uppercase">
        Error en enlace de YouTube
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black group overflow-hidden border border-zinc-900 shadow-[0_10px_50px_rgba(0,0,0,1)]">
      {/* Container del Player */}
      <div id={`player-${videoId}`} className="w-full h-full" />
      
      {/* Overlay de Carga/Estética */}
      <div className="absolute inset-0 pointer-events-none border-t border-cyan-500/10" />
      
      {/* Check visual con micro-animación suave */}
      <div 
        className={`absolute bottom-4 right-4 bg-black/60 border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-1000 ease-in-out ${
          isWatched 
            ? "border-cyan-500 text-cyan-400 opacity-100 shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse" 
            : "border-zinc-800 text-zinc-600 opacity-40"
        }`}
      >
        {isWatched ? "✓ Módulo Completado" : "Módulo Pendiente"}
      </div>
    </div>
  );
}

// Extensión global para TypeScript
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}
