"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import Button from "./button"

export default function BotaoLogout({ className, children }: { className?: string, children?: React.ReactNode }) {
  const router = useRouter()

  const handleSair = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh()
        }
      }
    });
  }
  return (
    <button
      onClick={handleSair}
      className={className || "block w-full px-3 py-2.5 text-[13.5px] text-coral hover:bg-coral/10 hover:text-red-500 rounded-xl transition-colors font-bold text-center"}
    >
      {children || "Sair da Conta"}
    </button>

  );
}
