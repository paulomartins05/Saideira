import Image from "next/image";
import Link from "next/link";


export interface ProdutoProps {
  id: number | string;
  nome: string;
  descricao: string;
  preco: number;
  tempoPostagem: string;
  imagemUrl: string | string[];
  distancia?: number;
  isPremium?: boolean;
}

export default function CardProduto({
  id,
  nome,
  descricao,
  preco,
  tempoPostagem,
  imagemUrl,
  distancia,
  isPremium
}: ProdutoProps) {

  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(preco);

  const IMAGEM_PADRAO = "https://placehold.co/400x400/eeeeee/999999?text=Sem+Imagem";
  let imagemFinal = IMAGEM_PADRAO;

  if (Array.isArray(imagemUrl) && imagemUrl.length > 0) {
    imagemFinal = imagemUrl[0];
  } else if (typeof imagemUrl === "string" && imagemUrl.trim() !== "") {
    imagemFinal = imagemUrl;
  }


  return (
    <Link href={`/resgates/${id}`} className="block h-full cursor-pointer group relative mt-2">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full pb-2 group-hover:-translate-y-1 ${isPremium ? 'border-2 border-yellow-400 shadow-yellow-100' : 'border border-gray-100'}`}>
        
        {isPremium && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md z-20 flex items-center gap-1 border border-yellow-200">
            ⭐ Destaque
          </div>
        )}

        <div className="relative bg-[#F8F9FA] h-48 w-full flex items-center justify-center p-4">
          <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-background-secondary shadow-sm flex items-center gap-1 z-10">
            📍 Postado há {tempoPostagem}
          </div>
          {distancia !== undefined && (
            <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-[#D9774A] shadow-sm flex items-center gap-1 z-10">
              {distancia < 1 ? `${(distancia * 1000).toFixed(0)} m` : `${distancia.toFixed(1)} km`}
            </div>
          )}
          <div className="relative w-full h-full">
            <Image
              src={imagemFinal}
              alt={nome}
              fill
              className="object-contain mix-blend-multiply drop-shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
        </div>

        <div className="p-5 flex flex-col grow gap-3">
          <div>
            <h3 className="font-inter font-bold text-background-secondary text-sm md:text-base line-clamp-2 mb-1 group-hover:text-laranja-destaque transition-colors">
              {nome}
            </h3>
            <p className="font-inter text-xs text-background-secondary/60 line-clamp-2">
              {descricao}
            </p>
          </div>
          <div className="mt-auto pt-2">
            <span className="font-inter font-bold text-lg text-background-secondary">
              {precoFormatado}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}