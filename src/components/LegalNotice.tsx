"use client";

import { useState, useTransition } from "react";
import { acceptLegalAction } from "@/actions/legal";

interface LegalNoticeProps {
  userHasAccepted: boolean;
}

export default function LegalNotice({ userHasAccepted }: LegalNoticeProps) {
  const [isOpen, setIsOpen] = useState(!userHasAccepted);
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      const result = await acceptLegalAction();
      if (result.success) {
        setIsOpen(false);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-zinc-950 border border-zinc-900 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Decorativo Neón */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
        
        <header className="mb-8">
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] text-white uppercase italic">
            AVISO <span className="text-cyan-400 font-bold">LEGAL & SALUD</span>
          </h2>
          <div className="w-12 h-1 bg-cyan-500 mt-4" />
        </header>

        <div className="space-y-6 text-zinc-400 text-sm leading-relaxed max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
          <p className="uppercase tracking-widest text-[10px] text-cyan-600 font-bold mb-4">
            [ PROTOCOLO DE SEGURIDAD ANTIGRAVITY ]
          </p>
          
          <p>
            Al acceder a los contenidos de esta plataforma, el usuario reconoce y acepta que los programas de entrenamiento y nutrición proporcionados son de carácter informativo y educativo.
          </p>
          
          <p className="border-l border-zinc-800 pl-4 py-2 italic text-zinc-500">
            "La actividad física intensa y los cambios dietéticos conllevan riesgos inherentes. Es responsabilidad del usuario consultar con un profesional de la salud antes de iniciar cualquier protocolo."
          </p>
          
          <p>
            Antigravity System y sus administradores no se hacen responsables de lesiones, daños o perjuicios derivados de la implementación incorrecta de las pautas mostradas. El usuario declara estar en condiciones físicas óptimas para la realización de los ejercicios.
          </p>

          <p>
            Queda estrictamente prohibida la reproducción, distribución o retransmisión de cualquier contenido VOD sin consentimiento expreso previo.
          </p>
        </div>

        <footer className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
            SISTEMA DE CONSENTIMIENTO DIGITAL LAYER V1
          </p>
          
          <button
            onClick={handleAccept}
            disabled={isPending}
            className="w-full md:w-auto px-10 py-4 bg-cyan-500 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 disabled:opacity-50"
          >
            {isPending ? "PROCESANDO..." : "ACEPTO LOS TÉRMINOS"}
          </button>
        </footer>
      </div>
    </div>
  );
}
