import { getVideos } from "@/actions/admin";
import CreateVideoForm from "./CreateVideoForm";

export default async function AdminVODPage() {
  const videos = await getVideos();

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-2xl font-light tracking-widest uppercase text-white">
            Biblioteca <span className="text-cyan-400 font-bold">VOD</span>
          </h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">
            Gestor de Enlaces YouTube. Nutrición & Fitness.
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-light text-white">{videos.length}</span>
          <span className="text-xs text-zinc-600 tracking-widest ml-2 uppercase">Videos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Panel Lateral: Añadir Video */}
        <aside className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-cyan-400 mb-6 border-b border-zinc-900 pb-2">
            Inyectar Contenido
          </h3>
          <CreateVideoForm />
        </aside>

        {/* Tabla Central: Lista de Videos */}
        <section className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-black text-cyan-500 border-b border-zinc-900 tracking-widest">
              <tr>
                <th className="px-4 py-3 font-medium">Título del Video</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-zinc-700 italic border-b border-zinc-900/50">
                    Base de datos VOD vacía.
                  </td>
                </tr>
              ) : (
                videos.map((vid: any) => (
                  <tr key={vid.id} className="border-b border-zinc-900/50 hover:bg-zinc-950/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white mb-1">{vid.title}</div>
                      <a href={vid.youtubeLink} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-600 font-mono hover:text-cyan-400 hover:underline">
                        [ YOUTUBE_RAW_LINK ]
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] uppercase font-mono tracking-widest">
                        {vid.category === "NUTRITION" ? "Nutrición" : "Fitness"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-zinc-600">
                      {new Date(vid.uploadDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
