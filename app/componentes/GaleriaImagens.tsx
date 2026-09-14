"use client";

import { useState } from "react";
import Image from "next/image";

interface GaleriaImagensProps {
  imagens: string[];
  titulo: string;
}

export default function GaleriaImagens({ imagens, titulo }: GaleriaImagensProps) {
  const imagensValidas = imagens && imagens.length > 0
    ? imagens
    : ["https://cdn-icons-png.flaticon.com/512/3225/3225091.png"];

  const [imagemAtiva, setImagemAtiva] = useState(imagensValidas[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card rounded-[2rem] border border-line shadow-sm w-full h-80 md:h-[32rem] relative flex items-center justify-center p-8 overflow-hidden group">
        <Image
          src={imagemAtiva}
          alt={titulo}
          fill
          className="object-contain p-8 drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {imagensValidas.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {imagensValidas.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setImagemAtiva(img)}
              className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${imagemAtiva === img
                ? "border-amber shadow-md"
                : "border-transparent bg-paper opacity-70 hover:opacity-100"
                }`}
            >
              <Image src={img} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
