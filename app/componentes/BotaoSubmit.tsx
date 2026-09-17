"use client";

import { useFormStatus } from "react-dom";

type Props = {
  texto: string;
  textoCarregando: string;
  className: string;
};

export default function BotaoSubmit({ texto, textoCarregando, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} ${pending ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {pending ? textoCarregando : texto}
    </button>
  );
}
