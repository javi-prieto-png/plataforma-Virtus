import { getStudents } from "@/actions/admin";
import CreateStudentForm from "./CreateStudentForm"; // Componente Cliente
import DeleteStudentBtn from "./DeleteStudentBtn";   // Componente Cliente

export default async function UsuariosAdminPage() {
  const students = await getStudents();

  return (
    <div className="w-full">
      <div className="mb-10 flex justify-between items-end border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-2xl font-light tracking-widest uppercase text-white">
            Control de <span className="text-cyan-400 font-bold">Alumnos</span>
          </h2>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">
            Protocolo de Inserción y Revocación de Credenciales.
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-light text-white">{students.length}</span>
          <span className="text-xs text-zinc-600 tracking-widest ml-2 uppercase">Activos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Panel Lateral: Crear Usuario */}
        <aside className="lg:col-span-1 bg-zinc-950 border border-zinc-900 p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-cyan-400 mb-6 border-b border-zinc-900 pb-2">
            Nuevo Expediente
          </h3>
          <CreateStudentForm />
        </aside>

        {/* Tabla Central: Lista de Usuarios */}
        <section className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-black text-cyan-500 border-b border-zinc-900 tracking-widest">
              <tr>
                <th className="px-4 py-3 font-medium">Estudiante</th>
                <th className="px-4 py-3 font-medium">Gatekeeper</th>
                <th className="px-4 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-zinc-700 italic border-b border-zinc-900/50">
                    No hay alumnos registrados en el sistema.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-zinc-900/50 hover:bg-zinc-950/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="font-bold text-white">{student.name}</div>
                      <div className="text-xs text-zinc-500">{student.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      {student.isFirstLogin || !student.isProfileComplete ? (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] uppercase font-mono tracking-widest">
                          Onboarding
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase font-mono tracking-widest">
                          Aprobado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DeleteStudentBtn userId={student.id} />
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
