"use server"

import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function executarUploadClodinary(
  buffer: Buffer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opcoesCustomizadas: Record<string, any>
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        format: "webp",
        quality: "auto",
        ...opcoesCustomizadas
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result?.secure_url || "")
        }
      }
    )
    uploadStream.end(buffer)
  })

}

export async function uploadImagemPerfil(formData: FormData) {
  const imagem = formData.get("imagem") as File | null
  if (!imagem || imagem.size === 0) return null

  const bytes = await imagem.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return executarUploadClodinary(buffer, {
    folder: "salgado_salvo_avatares",
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" }
    ]
  })
}

export async function uploadImagemProduto(imagem: File | null): Promise<string | null> {
  if (!imagem || imagem.size === 0) return null;

  const bytes = await imagem.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return executarUploadClodinary(buffer, {
    folder: "salgado_salvo",
  });
}

export async function uploadMultiplasImagens(arquivos: File[]): Promise<string[]> {
  const promessasDeUpload = arquivos.map(async (file) => {
    if (!file || file.size === 0) {
      return ""
    };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return executarUploadClodinary(buffer, {
      folder: "salgado_salvo",
      format: "webp",
      quality: "auto",
    });
  });

  const urls = await Promise.all(promessasDeUpload);
  return urls.filter(url => url !== "");
}
