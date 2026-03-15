"use client";

import { useTransition, useState } from "react";
import { requestPasswordResetAction } from "@/actions/auth_recovery";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordResetAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setMessage(result.message || "Solicitud procesada.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,1)] relative">
        {/* Decorativo Neón */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-light tracking-[0.3em] text-white uppercase italic">
            RECUPERAR <span className="text-cyan-400 font-bold">ACCESO</span>
          </h1>
          <div className="w-10 h-0.5 bg-cyan-500 mx-auto mt-4" />
        </div>

        {message ? (
          <div className="text-center space-y-6">
            <p className="text-cyan-400 text-sm font-mono tracking-widest uppercase animate-pulse">
              [ {message} ]
            </p>
            <Link 
              href="/login" 
              className="inline-block text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest border-b border-zinc-800 pb-1 mt-8"
            >
              Volver al Login
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="email" className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold ml-1">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="usuario@ejemplo.com"
                className="w-full bg-black border border-zinc-800 p-4 text-white text-sm focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all placeholder:text-zinc-800"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] text-center uppercase tracking-widest font-mono">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-transparent border border-cyan-500 text-cyan-400 text-xs font-bold uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 disabled:opacity-50"
            >
              {isPending ? "PROCESANDO..." : "SOLICITAR REINICIO"}
            </button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-[10px] text-zinc-600 hover:text-cyan-400 uppercase tracking-widest transition-colors"
              >
                Volver al Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
