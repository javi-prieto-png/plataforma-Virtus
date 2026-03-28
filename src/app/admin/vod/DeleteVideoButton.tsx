"use client";

import { useTransition } from "react";
import { deleteVideoAction } from "@/actions/admin";

export default function DeleteVideoButton({ videoId }: { videoId: string }) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    if (confirm("¿Estás seguro de que deseas eliminar este contenido? Esta acción es irreversible.")) {
      startTransition(async () => {
        await deleteVideoAction(videoId);
      });
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-[10px] text-red-500 hover:text-white border border-red-500/30 hover:bg-red-600 px-3 py-1 transition-all uppercase font-bold disabled:opacity-50"
    >
      {isPending ? "..." : "Eliminar"}
    </button>
  );
}
