"use client";

import { useEffect, useState, useTransition } from "react";
import { updateProfileAction } from "@/actions/profile";

export default function ProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  // Carga inicial del perfil (simulada por ahora, idealmente vendría de un Server Component prop)
  useEffect(() => {
    async function load() {
       const res = await fetch("/api/user"); // O usar una acción para obtener datos
       if (res.ok) {
         const data = await res.json();
         setUserData(data);
       }
    }
    // load(); 
    // Por simplicidad, asumiremos que los campos son controlados por el form.
  }, []);

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const res = await updateProfileAction(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <header className="mb-12 border-b border-zinc-900 pb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light tracking-[0.2em] text-white uppercase">
            Mi Perfil <span className="text-cyan-400 font-bold tracking-normal uppercase">VIRTUS</span>
          </h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-2">
            Gestión de identidad y datos de contacto
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Imagen de Perfil Previsualización */}
        <aside className="lg:col-span-1 flex flex-col items-center">
           <div className="w-32 h-32 rounded-full border-2 border-zinc-900 bg-zinc-950 flex items-center justify-center text-4xl text-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.1)] mb-6 overflow-hidden">
              {userData?.profilePic ? (
                  <img src={userData.profilePic} className="w-full h-full object-cover" />
              ) : (
                  "V"
              )}
           </div>
           <p className="text-[10px] text-zinc-600 uppercase tracking-widest text-center">Identidad de Operador Activa</p>
        </aside>

        {/* Formulario de Edición */}
        <section className="lg:col-span-2">
           <form action={handleAction} className="space-y-6">
              {error && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono uppercase tracking-widest">[ERR]: {error}</div>}
              {success && <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest text-center overflow-hidden relative">
                 <div className="animate-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full" />
                 [SISTEMA ACTUALIZADO_EXITOSAMENTE]
              </div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Nombre Completo</label>
                    <input name="name" type="text" placeholder="Ej: Juan Pérez" className="bg-zinc-950 border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all uppercase tracking-wider" defaultValue={userData?.name} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Teléfono de Contacto</label>
                    <input name="phone" type="tel" placeholder="+34 000 000 000" className="bg-zinc-950 border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all uppercase tracking-wider" defaultValue={userData?.phone} />
                  </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Correo Electrónico (VIRTUS_ID)</label>
                <input name="email" type="email" placeholder="user@virtus.sys" className="bg-zinc-950 border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all tracking-wider" defaultValue={userData?.email} />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">URL Foto de Perfil</label>
                <input name="profilePic" type="url" placeholder="https://..." className="bg-zinc-950 border border-zinc-800 p-3 text-[10px] text-cyan-200 focus:outline-none focus:border-cyan-500 transition-all font-mono" defaultValue={userData?.profilePic} />
              </div>

              <div className="pt-6 border-t border-zinc-900 mt-10">
                 <button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50"
                 >
                    {isPending ? "SINCRONIZANDO..." : "Guardar Cambios de Perfil"}
                 </button>
              </div>
           </form>
        </section>
      </div>

      {/* Grid Decoy Aesthetic */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(34,211,238,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.4)_1px,transparent_1px)] bg-[size:100px_100px]" />
    </div>
  );
}
