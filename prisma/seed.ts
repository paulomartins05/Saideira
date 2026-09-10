import { prisma } from "../lib/prisma" 

async function main() {
  console.log("🌱 Iniciando o plantio de dados (Seed)...")

  const parceiro = await prisma.user.findFirst({
    where: { role: 'PARCEIRO' }
  })

  const consumidor = await prisma.user.findFirst({
    where: { role: 'CONSUMIDOR' }
  })

  if (!parceiro) {
    console.log("❌ AVISO: Nenhum PARCEIRO encontrado no banco.")
    console.log("Por favor, crie uma conta de Lojista no aplicativo antes de rodar o seed.")
    return
  }

  if (!consumidor) {
    console.log("❌ AVISO: Nenhum CONSUMIDOR encontrado no banco.")
    console.log("Por favor, crie uma conta de Cliente no aplicativo antes de rodar o seed.")
    return
  }

  console.log(`✅ Parceiro encontrado: ${parceiro.name}`)
  console.log(`✅ Consumidor encontrado: ${consumidor.name}`)


  const dataHoje = new Date()
  const validadeCurta = new Date(dataHoje.getTime() + 2 * 60 * 60 * 1000) // +2 horas
  const validadeLonga = new Date(dataHoje.getTime() + 24 * 60 * 60 * 1000) // +24 horas

  console.log("📦 Gerando Ofertas no estoque...")

  const oferta1 = await prisma.oferta.create({
    data: {
      titulo: "Combo de Coxinhas (Fim de Expediente)",
      descricao: "Sobraram 10 unidades fresquinhas da nossa fornada da tarde. Estão crocantes, massa de batata e muito recheio de frango.",
      precoOriginal: 25.00,
      precoResgate: 10.00,
      quantidade: 3,
      categoria: "Salgados",
      dataValidade: validadeCurta,
      localizacao: parceiro.rua ? `${parceiro.rua}, ${parceiro.numero}` : "Rua João de Camargo, 510 - Centro",
      imagemUrl: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop"], // Foto de salgados fritos
      vendedorId: parceiro.id
    }
  })

  const oferta2 = await prisma.oferta.create({
    data: {
      titulo: "Fatia de Bolo de Cenoura com Chocolate",
      descricao: "Fatia generosa do nosso bolo artesanal. A validade é até amanhã de manhã, perfeito para o café.",
      precoOriginal: 12.00,
      precoResgate: 5.50,
      quantidade: 5,
      categoria: "Bolos",
      dataValidade: validadeLonga,
      localizacao: parceiro.rua ? `${parceiro.rua}, ${parceiro.numero}` : "Rua João de Camargo, 510 - Centro",
      imagemUrl: ["https://images.unsplash.com/photo-1582293041079-7814c2712fb1?q=80&w=1000&auto=format&fit=crop"], // Foto de Bolo
      vendedorId: parceiro.id
    }
  })

  const oferta3 = await prisma.oferta.create({
    data: {
      titulo: "Lote de Croissants Amanteigados",
      descricao: "3 unidades de croissant francês originais. Ideal para esquentar na AirFryer.",
      precoOriginal: 21.00,
      precoResgate: 8.90,
      quantidade: 2,
      categoria: "Assados",
      dataValidade: validadeCurta,
      localizacao: parceiro.rua ? `${parceiro.rua}, ${parceiro.numero}` : "Rua João de Camargo, 510 - Centro",
      imagemUrl: ["https://images.unsplash.com/photo-1530610476181-d83430b64dcb?q=80&w=1000&auto=format&fit=crop"], // Foto de Croissant
      vendedorId: parceiro.id
    }
  })

  console.log("🛒 Gerando Histórico de Compras...")

  await prisma.resgate.create({
    data: {
      userId: consumidor.id,
      ofertaId: oferta1.id,
      status: "PENDENTE",
      codigoPin: "4592"
    }
  })

  await prisma.resgate.create({
    data: {
      userId: consumidor.id,
      ofertaId: oferta2.id,
      status: "RETIRADO",
      codigoPin: "8810"
    }
  })

  await prisma.resgate.create({
    data: {
      userId: consumidor.id,
      ofertaId: oferta3.id,
      status: "RETIRADO",
      codigoPin: "1023"
    }
  })

  console.log("🎉 Seed finalizado com sucesso! O seu app agora tem produtos e dinheiro rolando.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("Erro fatal durante o Seed:", e)
    await prisma.$disconnect()
    process.exit(1)
  })