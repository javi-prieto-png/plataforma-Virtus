import Link from "next/link";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import SidebarManager from "@/components/layout/SidebarManager";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get("session")?.value);

  if (!session) redirect("/login");

  const sidebarContent = (
    <div className="flex flex-col p-8 h-full bg-black">
      <div className="mb-12">
        <h1 className="text-xl font-bold tracking-widest uppercase">
          VIRTUS<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] font-extrabold">.</span>
        </h1>
        <p className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase mt-2">Core Platform v2.0</p>
      </div>

      <nav className="flex flex-col space-y-8 flex-grow">
        <div className="flex flex-col space-y-4">
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-bold">Navegación</p>
          <Link href="/dashboard" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-cyan-400 hover:translate-x-1 transition-all active:text-cyan-400">❯ Inicio</Link>
          <Link href="/cursos" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-cyan-400 hover:translate-x-1 transition-all">❯ Biblioteca de Videos</Link>
          <Link href="/dashboard/chat/inbox" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-cyan-400 hover:translate-x-1 transition-all">❯ Buz\u00f3n (Chat)</Link>
        </div>

        <div className="flex flex-col space-y-4 pt-4 border-t border-zinc-900">
          <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-bold">Cuenta</p>
          <Link href="/dashboard/perfil" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-cyan-400 hover:translate-x-1 transition-all">❯ Mi Perfil</Link>
          {session.role === "ADMIN" && (
            <Link href="/admin" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-amber-400 hover:translate-x-1 transition-all">❯ Panel Admin</Link>
          )}
        </div>
      </nav>

      <div className="mt-auto pt-8 border-t border-zinc-900 flex flex-col gap-4">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px] font-bold text-cyan-400 uppercase">
              {session.role[0]}
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] text-zinc-300 font-bold tracking-wider uppercase truncate max-w-[120px]">USER_{session.userId.slice(0,6)}</span>
              <span className="text-[9px] text-zinc-600 tracking-widest uppercase">VIRTUS_ID: {session.userId.slice(0,8)}</span>
           </div>
        </div>
        <form action={logoutAction}>
          <button className="w-full text-[9px] text-red-500 hover:text-white border border-red-500/30 hover:bg-red-600 px-4 py-2 transition-all uppercase tracking-[0.2em] font-bold">
            [ CERRAR_SESIÓN ]
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <SidebarManager sidebarContent={sidebarContent}>
      {children}
    </SidebarManager>
  );
}
