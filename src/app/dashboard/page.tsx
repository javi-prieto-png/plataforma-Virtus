import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  if (!session) redirect("/login");

  // Recuperar datos reales para el saludo
  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12">
        <h2 className="text-3xl font-light tracking-[0.2em] text-white uppercase">
          Bienvenido, <span className="text-cyan-400 font-bold">{user?.name.split(' ')[0]}</span>
        </h2>
        <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mt-2">
          Estado del sistema: <span className="text-cyan-500/80 underline decoration-cyan-500/30">Operativo</span> | Protocolo: <span className="text-zinc-300">Entrenamiento_VOD</span>
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* TARJETA NUTRICIÓN */}
        <Link href="/cursos" className="group relative p-10 bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all overflow-hidden block shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-[100px] group-hover:bg-cyan-500/10 transition-colors" />
          <div className="relative z-10">
            <div className="text-[10px] text-cyan-500 tracking-[0.5em] font-bold uppercase mb-4">Módulo 01</div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors uppercase">VOD Nutrición</h3>
            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8 max-w-[280px]">
              Domina tu alimentación con clases magistrales y protocolos específicos de nutrición deportiva.
            </p>
            <span className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase group-hover:translate-x-2 inline-block transition-transform">❯ Acceder a la biblioteca</span>
          </div>
        </Link>

        {/* TARJETA FITNESS */}
        <Link href="/cursos" className="group relative p-10 bg-zinc-950 border border-zinc-900 hover:border-cyan-500/50 transition-all overflow-hidden block shadow-2xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-[100px] group-hover:bg-cyan-500/10 transition-colors" />
          <div className="relative z-10">
            <div className="text-[10px] text-cyan-500 tracking-[0.5em] font-bold uppercase mb-4">Módulo 02</div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors uppercase">VOD Fitness</h3>
            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8 max-w-[280px]">
              Perfecciona tu técnica y potencia tus entrenamientos con nuestra videoteca de ejercicios avanzada.
            </p>
            <span className="text-[10px] text-zinc-400 tracking-[0.3em] uppercase group-hover:translate-x-2 inline-block transition-transform">❯ Acceder a la biblioteca</span>
          </div>
        </Link>
      </section>

      {/* QUICK STATUS (PROGRESO SIMULADO) */}
      <footer className="border-t border-zinc-900 pt-10">
        <h4 className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase font-bold mb-6 text-center">Resumen de Actividad</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <div className="p-4 border border-zinc-900/50 bg-zinc-950/30 text-center">
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Vídeos Completos</p>
              <p className="text-xl font-mono text-cyan-500">0</p>
           </div>
           <div className="p-4 border border-zinc-900/50 bg-zinc-950/30 text-center">
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Dudas Reportadas</p>
              <p className="text-xl font-mono text-cyan-500">0</p>
           </div>
           <div className="p-4 border border-zinc-900/50 bg-zinc-950/30 text-center">
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Días en Sistema</p>
              <p className="text-xl font-mono text-cyan-500">1</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
