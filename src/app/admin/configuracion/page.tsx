"use client";

import { useTransition, useState } from "react";
import { createAdminAction } from "@/actions/admin";

export default function AdminConfigPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function handleAddAdmin(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const res = await createAdminAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (document.getElementById("add-admin-form") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-12 border-b border-zinc-900 pb-8 uppercase tracking-widest">
        <h2 className="text-2xl font-light text-white">
          Configuración <span className="text-cyan-400 font-bold">VIRTUS_CORE</span>
        </h2>
        <p className="text-zinc-600 text-[10px] tracking-[0.4em] mt-2">Gestión de privilegios y categorías de sistema</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Sección: Gestión de Administradores */}
        <section className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none" />
           <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
              Alta de Nuevo Administrador
           </h3>

           <form id="add-admin-form" action={handleAddAdmin} className="space-y-6">
              {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-mono uppercase">[ERROR]: {error}</div>}
              {success && <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase text-center">[ADMIN_CREADO_Y_NOTIFICADO]</div>}

              <div className="flex flex-col gap-2">
                 <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Nombre del Administrador</label>
                 <input name="name" type="text" required placeholder="NOMBRE_COMPLETO" className="bg-black border border-zinc-900 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors uppercase tracking-widest" />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Email Institucional</label>
                 <input name="email" type="email" required placeholder="admin@virtus.sys" className="bg-black border border-zinc-900 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors tracking-wider" />
              </div>

              <p className="text-[9px] text-zinc-600 italic leading-relaxed">
                 * El sistema generará una clave aleatoria encriptada con <b>bcryptjs</b> y la enviará automáticamente al correo especificado.
              </p>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-4 border border-cyan-500/50 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-50"
              >
                 {isPending ? "PROCESANDO_ALTA..." : "Conceder Acceso Admin"}
              </button>
           </form>
        </section>

        {/* Sección: Resumen de Organización */}
        <section className="space-y-8">
           <div className="bg-zinc-950 border border-zinc-900 p-8">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">Categorías de Contenido Activas</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-zinc-900/50 border border-zinc-800">
                    <span className="text-[10px] text-white uppercase tracking-widest">Nutrición & Suplementación</span>
                    <span className="text-[9px] text-zinc-600 font-mono">CODE: NUTRITION</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-zinc-900/50 border border-zinc-800">
                    <span className="text-[10px] text-white uppercase tracking-widest">Entrenamiento & Fuerza</span>
                    <span className="text-[9px] text-zinc-600 font-mono">CODE: FITNESS</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-zinc-900/50 border border-zinc-800">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest">Mindfulness & Foco</span>
                    <span className="text-[9px] text-zinc-600 font-mono">CODE: MINDFULNESS</span>
                 </div>
              </div>
           </div>

           <div className="p-8 border border-zinc-900/50 bg-zinc-950/20">
              <h3 className="text-[10px] text-zinc-700 uppercase tracking-[0.3em] mb-4">Información del Sistema</h3>
              <p className="text-[9px] text-zinc-500 leading-loose uppercase tracking-widest">
                 Plataforma VIRTUS optimizada para entorno servidorless. Todas las contraseñas son hasheadas antes de persistir. La trazabilidad de mensajes está vinculada permanentemente al VIRTUS_ID del usuario.
              </p>
           </div>
        </section>

      </div>
    </div>
  );
}
