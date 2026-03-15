import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-black p-8">
      <main className="max-w-3xl w-full flex flex-col items-center border border-zinc-900 bg-zinc-950/50 p-12 rounded-2xl relative overflow-hidden group hover:border-[rgba(34,211,238,0.3)] transition-colors duration-500">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-cyan-500/10 blur-[80px] -z-10 group-hover:bg-cyan-500/20 transition-colors duration-500" />

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase mb-6 text-center">
          <span className="text-zinc-600">SYS_</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">ANTIGRAVITY</span>
        </h1>
        
        <p className="text-zinc-400 text-center max-w-xl mb-12 text-lg font-light tracking-wide leading-relaxed">
          Plataforma privada de nutrición y fitness. Entorno seguro, acceso estrictamente controlado.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <a
            href="/login"
            className="px-10 py-3 bg-cyan-500 text-black font-bold uppercase tracking-widest text-sm rounded-none hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] text-center relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Iniciar Sesión</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
          </a>
          <a
            href="/admin"
            className="px-10 py-3 bg-transparent border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-sm rounded-none hover:border-cyan-500 hover:text-cyan-400 transition-all text-center"
          >
            Portal Admin
          </a>
        </div>
      </main>
      
      <footer className="mt-16 text-zinc-700 text-xs font-mono tracking-widest uppercase">
        © {new Date().getFullYear()} Gatekeeper Protocol Active.
      </footer>
    </div>
  );
}
