import { getStudentVideos } from "@/actions/student";
import Link from "next/link";
import { getSession } from "@/lib/session";
import LegalNotice from "@/components/LegalNotice";
import prisma from "@/lib/prisma";

export default async function CursosPage() {
  const videos = await getStudentVideos();
  const session = await getSession();
  
  // Obtenemos el estado directo de la DB para el interceptor
  const user = await prisma.user.findUnique({
    where: { id: session?.id },
    select: { hasAcceptedLegal: true }
  });

  const nutritionVideos = videos.filter((v: any) => v.category === "NUTRITION");
  const fitnessVideos = videos.filter((v: any) => v.category === "FITNESS");

  const watchedCount = videos.filter((v: any) => v.interactions[0]?.isWatched).length;
  const progressPercent = videos.length > 0 ? Math.round((watchedCount / videos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <LegalNotice userHasAccepted={user?.hasAcceptedLegal || false} />
      {/* Header & Progreso */}
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-light tracking-[0.2em] uppercase">
            BIBLIOTECA <span className="text-cyan-400 font-bold">VOD</span>
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-xs tracking-widest uppercase mt-3">
            Contenidos exclusivos y pautas personalizadas.
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between text-[10px] uppercase tracking-widest mb-2 font-mono">
            <span className="text-zinc-500">Progreso Total</span>
            <span className="text-cyan-400">{progressPercent}%</span>
          </div>
          <div className="h-1 bg-zinc-900 overflow-hidden">
            <div 
              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Grid de Secciones */}
      <div className="flex flex-col gap-16">
        
        {/* Nutrición */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg font-bold tracking-widest uppercase text-cyan-400">Nutrición & Pautas</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutritionVideos.length === 0 ? (
              <p className="text-zinc-700 italic text-sm font-mono">[ No hay contenidos disponibles ]</p>
            ) : (
              nutritionVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            )}
          </div>
        </section>

        {/* Entrenamiento */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-lg font-bold tracking-widest uppercase text-cyan-400">Entrenamiento & Biomecánica</h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessVideos.length === 0 ? (
              <p className="text-zinc-700 italic text-sm font-mono">[ No hay contenidos disponibles ]</p>
            ) : (
              fitnessVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function VideoCard({ video }: { video: any }) {
  const isWatched = video.interactions[0]?.isWatched;
  
  // Extraer ID de youtube para el thumbnail
  const videoIdMatch = video.youtubeLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/);
  const thumbUrl = videoIdMatch ? `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg` : "";

  return (
    <Link 
      href={`/cursos/${video.id}`}
      className="group relative bg-zinc-950 border border-zinc-900 overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
        {thumbUrl ? (
          <img 
            src={thumbUrl} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="text-zinc-700 uppercase font-mono text-[10px]">Sin Thumbnail</span>
          </div>
        )}
        
        {/* Overlay Watched */}
        {isWatched && (
          <div className="absolute top-2 right-2 bg-black/80 border border-cyan-500/30 px-2 py-1 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)]" />
            <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Visto</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 border-t border-zinc-900 group-hover:bg-cyan-500/5 transition-colors">
        <h3 className="text-sm font-bold tracking-widest uppercase text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
          {video.title}
        </h3>
        <div className="mt-3 flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-600">
          <span>{video.category}</span>
          <span className="text-cyan-700 underline group-hover:text-cyan-400 transition-colors">ACCEDER_MÓDULO</span>
        </div>
      </div>
      
      {/* Decor neón */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-cyan-500 w-0 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_#22d3ee]" />
    </Link>
  );
}
