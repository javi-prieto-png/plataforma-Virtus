"use client";

import { useState, useTransition } from "react";
import { createStudentAction } from "@/actions/admin";

export default function CreateStudentForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await createStudentAction(formData);
      if (result?.error) setError(result.error);
      if (result?.success) {
        setSuccess(true);
        // Reseteo via DOM for formData state clearence
        (document.getElementById("create-student-form") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <form id="create-student-form" action={handleAction} className="flex flex-col gap-5">
      {error && <div className="text-red-500 p-3 bg-red-500/10 border border-red-500/30 text-xs font-mono">{error}</div>}
      {success && <div className="text-cyan-400 p-3 bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-center uppercase tracking-widest">[EXPEDIENTE CREADO. CORREO ENVIADO]</div>}

      <input
        type="text" name="name" placeholder="Nombre completo" required
        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
      />
      <input
        type="email" name="email" placeholder="Correo electrónico" required
        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
      />
      <input
        type="tel" name="phone" placeholder="Teléfono"
        className="w-full bg-black border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
      />

      <button
        type="submit" disabled={isPending}
        className="mt-2 w-full py-3 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest text-xs hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50"
      >
        {isPending ? "INICIANDO PROTOCOLO..." : "DAR DE ALTA"}
      </button>

      <p className="text-[10px] text-zinc-600 leading-tight mt-2 text-center uppercase font-mono tracking-widest">
        Se auto-generará una password y se enviará al correo del usuario.
      </p>
    </form>
  );
}
