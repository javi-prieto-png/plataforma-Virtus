export const dynamic = 'force-dynamic';
import { getStudentVideos } from "@/actions/student";
import Link from "next/link";
import { getSession } from "@/lib/session";
import LegalNotice from "@/components/LegalNotice";
import prisma from "@/lib/prisma";

export default async function CursosPage() {
  const videos = await getStudentVideos();
  const session = await getSession();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
  
  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: { hasAcceptedLegal: true, name: true }
  });

  const watchedCount = videos.filter((v: any) => v.interactions[0]?.isWatched).length;
  const progressPercent = videos.length > 0 ? Math.round((watchedCount / videos.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 animate-in fade-in duration-1000">
      <LegalNotice userHasAccepted={user?.hasAcceptedLegal || false} />

      {/* Hero Header */}
      <header className="mb-12 border-b border-zinc-900 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase">
              BIBLIOTECA <span className="text-cyan-400 font-extrabold drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">VIRTUS</span>
            </h1>
            <p className="text-zinc-500 text-[10px] md:text-xs tracking-[0.4em] uppercase">
              Protocolo de Entrenamiento y Salud Hol\u00edstica v2.0
            </p>
          </div>
          
          <div className="w-full md:w-80 bg-zinc-950/50 border border-zinc-900 p-6 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] mb-3 font-mono">
              <span className="text-zinc-500">Progreso Operativo</span>
              <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-500 shadow-[0_0_15px_#22d3ee] transition-all duration-[2000ms] ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors" />
          </div>
        </div>
      </header>

      {/* Secciones de Contenido Din\u00e1mico */}
      <div className="space-y-24 pb-20">
        {categories.map((cat: any) => {
          const catVideos = videos.filter((v: any) => v.categoryId === cat.id);
          return (
            <VideoSection 
              key={cat.id}
              title={cat.name} 
              description={`M\u00f3dulos de acceso nivel ${cat.name.length % 3 + 1}`} 
              videos={catVideos} 
            />
          );
        })}

        {/* Fallback para videos sin categor\u00eda (si existieran) */}
        {videos.some((v:any) => !v.categoryId) && (
          <VideoSection 
            title="Otros Contenidos" 
            description="M\u00f3dulos pendientes de clasificaci\u00f3n." 
            videos={videos.filter((v: any) => !v.categoryId)} 
          />
        )}
      </div>
    </div>
  );
}

function VideoSection({ title, description, videos }: { title: string, description: string, videos: any[] }) {
  return (
    <section className="relative">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10 border-l-2 border-cyan-500 pl-6">
        <div>
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-white">{title}</h2>
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase mt-1">{description}</p>
        </div>
        <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-zinc-900 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {videos.length === 0 ? (
          <div className="col-span-full py-12 border border-dashed border-zinc-900 flex items-center justify-center">
             <p className="text-zinc-700 italic text-xs font-mono uppercase tracking-widest">[ No hay módulos activos en esta categoría ]</p>
          </div>
        ) : (
          videos.map((video: any) => (
            <VideoCard key={video.id} video={video} />
          ))
        )}
      </div>
    </section>
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
          <span>{video.category?.name}</span>
          <span className="text-cyan-700 underline group-hover:text-cyan-400 transition-colors">ACCEDER_MÓDULO</span>
        </div>
      </div>
      
      {/* Decor neón */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-cyan-500 w-0 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_#22d3ee]" />
    </Link>
  );
}
