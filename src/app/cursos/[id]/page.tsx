import { getStudentVideo } from "@/actions/student";
import { notFound } from "next/navigation";
import YouTubePlayer from "./YouTubePlayer";
import FeedbackSystem from "./FeedbackSystem";
import Link from "next/link";

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const video = await getStudentVideo(params.id);

  if (!video) return notFound();

  const interaction = video.interactions[0];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Nav Minified */}
      <nav className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50 p-4 flex justify-between items-center">
        <Link 
          href="/cursos" 
          className="text-[10px] text-zinc-500 hover:text-cyan-400 flex items-center gap-2 group transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          VOLVER_A_BIBLIOTECA
        </Link>
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase">
          ANTIGRAVITY <span className="text-cyan-500">VOD</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-12 lg:p-20">
        
        {/* Header del Video */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono border border-zinc-800 px-2 py-0.5">
              {video.category}
            </span>
            {interaction?.isWatched && (
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5">
                Módulo Completado
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-5xl font-light tracking-tight text-white uppercase italic">
            {video.title}
          </h1>
        </header>

        {/* Zona del Reproductor */}
        <section className="mb-20">
          <YouTubePlayer 
            videoId={video.id} 
            youtubeUrl={video.youtubeLink} 
          />
        </section>

        {/* Zona de Interacción Social & Dudas */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3">
            <FeedbackSystem 
              videoId={video.id} 
              initialStatus={interaction?.likeStatus}
            />
          </div>

          <aside className="lg:col-span-2 bg-zinc-950/50 border border-zinc-900 p-8">
            <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-500 mb-6 border-b border-zinc-900 pb-4">
              Protocolo de Estudio
            </h3>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="text-cyan-500 font-mono text-xs">01</span>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Visualiza el contenido completo sin interrupciones para el Check automático.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-cyan-500 font-mono text-xs">02</span>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Usa el sistema de feedback para valorar la claridad del módulo.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-cyan-500 font-mono text-xs">03</span>
                <p className="text-xs text-zinc-500 leading-relaxed uppercase">Si tienes dudas técnicas, usa el buzón privado. Respuesta en <span className="text-white">24-48h</span>.</p>
              </li>
            </ul>
          </aside>
        </section>

      </div>
      
      {/* Footer Minimal */}
      <footer className="mt-40 border-t border-zinc-900 p-12 text-center">
        <p className="text-[9px] text-zinc-700 uppercase tracking-[0.5em]">Antigravity System — Protocol Layer V5</p>
      </footer>
    </div>
  );
}
