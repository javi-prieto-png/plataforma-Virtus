"use client";

import { useState, useTransition } from "react";
import { completeProfileAction } from "@/actions/onboarding";

export default function CompletarPerfilPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await completeProfileAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-xl w-full border border-zinc-900 bg-zinc-950 p-10 relative overflow-hidden group">
        <h1 className="text-2xl tracking-widest text-white mb-2 uppercase font-light">
          Identidad <span className="text-cyan-400 font-bold text-shadow-neon">Incompleta</span>
        </h1>
        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-10">
          Requisito mandatario para el acceso de nivel 2.
        </p>

        {error && (
          <div className="mb-6 border border-red-500/50 bg-red-500/10 p-4 text-red-500 text-sm text-center font-mono">
            {error}
          </div>
        )}

        <form action={handleAction} className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <div className="w-24 h-24 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden bg-black text-xs text-zinc-600 uppercase tracking-widest text-center">
              FOTO<br/>PERFIL
            </div>
            <p className="text-xs text-cyan-500 hover:text-cyan-400 cursor-pointer uppercase tracking-widest font-bold transition-colors">
              + SUBIR IMAGEN
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Nombre Completo</label>
            <input
              type="text"
              name="name"
              required
              className="bg-black border border-zinc-800 p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Teléfono de Contacto</label>
            <input
              type="tel"
              name="phone"
              required
              className="bg-black border border-zinc-800 p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full py-4 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest text-sm hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50"
          >
            {isPending ? "PROCESANDO..." : "COMPLETAR PERFIL Y ACCEDER"}
          </button>
        </form>
      </div>
    </div>
  );
}
