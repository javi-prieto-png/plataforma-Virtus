import { getFeedbacks } from "@/actions/admin";

export default async function AdminInboxPage() {
  const feedbacks = await getFeedbacks();

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-2xl font-light tracking-widest uppercase text-white">
            Buzón de <span className="text-cyan-400 font-bold">Feedback</span>
          </h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">
            Comunicaciones Privadas (Dudas y Evaluaciones Negativas).
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-light text-white">{feedbacks.length}</span>
          <span className="text-xs text-zinc-600 tracking-widest ml-2 uppercase">Mensajes</span>
        </div>
      </div>

      <section className="bg-zinc-950 border border-zinc-900 p-8">
        {feedbacks.length === 0 ? (
          <div className="text-center text-zinc-600 font-mono text-sm py-12 italic">
            [ BANDEJA DE ENTRADA VACÍA ]
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {feedbacks.map((fb: any) => (
              <div key={fb.id} className="border border-zinc-800 bg-black p-6 relative group hover:border-cyan-500/50 transition-colors">
                
                {/* Cabecera del Mensaje */}
                <div className="flex justify-between items-start mb-4 border-b border-zinc-900 pb-4">
                  <div>
                    <div className="text-cyan-400 font-bold uppercase tracking-widest text-sm">
                      {fb.user.name}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {fb.user.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-600 font-mono">
                      {new Date(fb.createdAt).toLocaleString()}
                    </div>
                    <div className={`mt-1 text-[10px] uppercase font-bold tracking-widest inline-block px-2 py-1 ${fb.isResolved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {fb.isResolved ? 'Resuelto' : 'Pendiente'}
                    </div>
                  </div>
                </div>

                {/* Cuerpo del Mensaje */}
                <div className="flex flex-col gap-2">
                  {fb.video && (
                    <div className="text-[10px] text-cyan-500 font-mono uppercase bg-cyan-500/5 px-2 py-1 border border-cyan-500/20 self-start">
                      Ref: {fb.video.title}
                    </div>
                  )}
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">
                    {fb.content}
                  </p>
                </div>

                {/* Etiqueta de Privacidad Estricta */}
                <div className="absolute -bottom-3 left-6 bg-black px-2 text-[9px] text-red-500 uppercase tracking-widest border border-red-500/30">
                  Strictly Confidential
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
