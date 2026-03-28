"use client";

import { useState, useTransition } from "react";
import { createVideoAction } from "@/actions/admin";

interface CreateVideoFormProps {
  categories: any[];
}

export default function CreateVideoForm({ categories }: CreateVideoFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createVideoAction(formData);
      if (result?.error) setError(result.error);
      if (result?.success) {
        setSuccess(true);
        (document.getElementById("create-video-form") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <form id="create-video-form" action={handleAction} className="flex flex-col gap-5">
      {error && <div className="text-red-500 p-3 bg-red-500/10 border border-red-500/30 text-xs font-mono">{error}</div>}
      {success && <div className="text-cyan-400 p-3 bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-center uppercase tracking-widest">[NUEVO ENLACE CARGADO]</div>}

      <input
        type="text" name="title" placeholder="T\u00edtulo Oficial del Contenido" required
        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
      />
      
      <input
        type="url" name="youtubeLink" placeholder="https://www.youtube.com/watch?v=..." required
        className="w-full bg-black border border-zinc-800 p-3 text-sm text-cyan-200 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
      />

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Categorizaci\u00f3n Din\u00e1mica</label>
            <select 
              name="categoryId" required 
              className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer uppercase tracking-tighter"
            >
              <option value="">Seleccione una categor\u00eda</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Fecha de Publicaci\u00f3n</label>
            <input
              type="date" name="uploadDate"
              className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

      <button
        type="submit" disabled={isPending}
        className="mt-4 w-full py-3 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest text-xs hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50"
      >
        {isPending ? "A\u00d1ADIENDO..." : "INCRUSTAR V\u00cdDEO"}
      </button>
    </form>
  );
}
