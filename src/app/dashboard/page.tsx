import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  // Redirigimos explícitamente a Login si accedió de forma anómala (redundancia técnica)
  if (!session) redirect("/login");

  const isAdmin = session.role === "ADMIN";

  return (
    <div className="min-h-screen bg-black text-white p-8 selection:bg-cyan-500 selection:text-black font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center border-b border-zinc-900 pb-6 mb-12 relative">
        <h1 className="text-xl font-bold tracking-widest uppercase">
          SYS<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">ANTIGRAVITY</span>
        </h1>
        <div className="flex gap-4 items-center">
          <span className="text-zinc-500 text-xs tracking-widest uppercase font-mono">
            ID: {session.userId.slice(0, 8)} | ROL: {session.role}
          </span>
          <form action="/api/auth/logout" method="POST">
            {/* TODO: implementar action de logout */}
            <button className="text-xs text-red-500 hover:text-red-400 font-mono border border-red-500/30 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 transition-all uppercase tracking-widest">
              [ ABORTAR_SESION ]
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {isAdmin && (
          <a href="/admin" className="group p-8 bg-zinc-950 border border-zinc-900 hover:border-cyan-500 transition-all relative overflow-hidden block">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full group-hover:bg-cyan-500/20 transition-colors" />
            <h2 className="text-xl font-bold mb-2 uppercase text-cyan-400">Portal Admin</h2>
            <p className="text-sm text-zinc-500 tracking-wide font-light">
              Control de usuarios, analíticas y gestión del buzón de feedback.
            </p>
          </a>
        )}

        <a href="/cursos-nutricion" className="group p-8 bg-zinc-950 border border-zinc-900 hover:border-cyan-500 transition-all relative overflow-hidden block">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full group-hover:bg-cyan-500/20 transition-colors" />
          <h2 className="text-xl font-bold mb-2 uppercase text-white group-hover:text-cyan-400 transition-colors">VOD - Nutrición</h2>
          <p className="text-sm text-zinc-500 tracking-wide font-light">
            Cursos teóricos, pautas dietéticas y masterclasses.
          </p>
        </a>

        <a href="/cursos-fitness" className="group p-8 bg-zinc-950 border border-zinc-900 hover:border-cyan-500 transition-all relative overflow-hidden block">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full group-hover:bg-cyan-500/20 transition-colors" />
          <h2 className="text-xl font-bold mb-2 uppercase text-white group-hover:text-cyan-400 transition-colors">VOD - Fitness</h2>
          <p className="text-sm text-zinc-500 tracking-wide font-light">
            Rutinas de entrenamiento, biometría y ejecución técnica.
          </p>
        </a>

      </main>
    </div>
  );
}
