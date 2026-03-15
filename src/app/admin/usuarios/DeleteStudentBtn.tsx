"use client";

import { useTransition } from "react";
import { deleteStudentAction } from "@/actions/admin";

export default function DeleteStudentBtn({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("⚠️ ADVERTENCIA: Esta acción es irreversible. ¿Deseas purgar a este usuario del sistema?")) {
      startTransition(async () => {
        await deleteStudentAction(userId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-white hover:bg-red-500 p-2 text-xs font-mono uppercase tracking-widest transition-all border border-transparent hover:border-red-500 rounded disabled:opacity-50"
    >
      {isPending ? "[ PURGANDO... ]" : "[ PURGAR ]"}
    </button>
  );
}
