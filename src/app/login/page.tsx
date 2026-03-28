"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-md w-full border border-zinc-900 bg-zinc-950 p-10 relative overflow-hidden group hover:border-[rgba(34,211,238,0.3)] transition-colors duration-500">
        <h1 className="text-3xl font-extrabold tracking-widest text-center text-white mb-2 uppercase">
          <span className="text-cyan-400">AUTH</span>_GATEWAY
        </h1>
        <p className="text-zinc-500 text-sm text-center tracking-widest uppercase mb-10">
          Identificación Necesaria
        </p>

        {error && (
          <div className="mb-6 border border-red-500/50 bg-red-500/10 p-4 text-red-500 text-sm text-center font-mono">
            [ERROR_CODE]: {error}
          </div>
        )}

        <form action={handleAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Email</label>
            <input
              type="email"
              name="email"
              required
              className="bg-black border border-zinc-800 p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="user@virtus.sys"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Password</label>
            <input
              type="password"
              name="password"
              required
              className="bg-black border border-zinc-800 p-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full py-4 bg-transparent border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest text-sm hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "VERIFICANDO..." : "INGRESAR AL SISTEMA"}
          </button>
        </form>

      </div>
    </div>
  );
}
