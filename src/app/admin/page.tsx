import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const usersCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const videosCount = await prisma.video.count();
  const feedbackCount = await prisma.feedback.count({ where: { isResolved: false } });

  const stats = [
    { label: "Alumnos Activos", value: usersCount, href: "/admin/usuarios", color: "text-cyan-400" },
    { label: "Contenido VOD", value: videosCount, href: "/admin/vod", color: "text-white" },
    { label: "Dudas Pendientes", value: feedbackCount, href: "/admin/inbox", color: "text-red-400" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase italic">
          PANEL DE <span className="text-cyan-400 font-bold">CONTROL</span> VIRTUS
        </h1>
        <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
          Gestión centralizada del ecosistema de alto rendimiento.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link 
            key={stat.label}
            href={stat.href}
            className="group p-8 bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">
              {stat.label}
            </p>
            <p className={`text-4xl font-light ${stat.color} tracking-tighter`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="p-8 border border-zinc-900 bg-black relative">
        <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500/20" />
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-500 mb-6">
          ACCESOS RÁPIDOS_VIRTUS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/vod" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
            <span className="w-1.5 h-1.5 bg-zinc-800 group-hover:bg-cyan-500 transition-colors" />
            Subir nuevo contenido a Biblioteca
          </Link>
          <Link href="/admin/usuarios" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
            <span className="w-1.5 h-1.5 bg-zinc-800 group-hover:bg-cyan-500 transition-colors" />
            VIRTUS_ONBOARDING: Nuevos Alumnos
          </Link>
          <Link href="/admin/chat" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
            <span className="w-1.5 h-1.5 bg-zinc-800 group-hover:bg-cyan-500 transition-colors" />
            Atención Directa: VIRTUS_CHAT
          </Link>
          <Link href="/admin/configuracion" className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-3 group">
            <span className="w-1.5 h-1.5 bg-zinc-800 group-hover:bg-cyan-500 transition-colors" />
            Configuración de Sistema & Roles
          </Link>
        </div>
      </section>
    </div>
  );
}
