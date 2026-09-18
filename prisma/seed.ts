import { prisma } from "../lib/prisma" 

async function main() {
  console.log("🌱 Iniciando o plantio de dados (Seed v2.0)...")

  // 1. Busca os usuários base
  const parceiro = await prisma.user.findFirst({
    where: { 
      role: 'PARCEIRO',
      email: 'parceiro@teste.com' 
    }
  })

  const consumidor = await prisma.user.findFirst({
    where: { 
      role: 'CONSUMIDOR',
      email: 'consumidor@teste.com'
    }
  })

  if (!parceiro) {
    console.log("❌ AVISO: Nenhum PARCEIRO encontrado no banco.")
    console.log("👉 Por favor, vá na tela de Cadastro (/cadastro) e crie uma conta de Parceiro primeiro.")
    return
  }

  if (!consumidor) {
    console.log("❌ AVISO: Nenhum CONSUMIDOR encontrado no banco.")
    console.log("👉 Por favor, vá na tela de Cadastro (/cadastro) e crie uma conta de Consumidor primeiro.")
    return
  }

  console.log(`✅ Parceiro encontrado: ${parceiro.name}`)
  console.log(`✅ Consumidor encontrado: ${consumidor.name}`)

  // 2. Garante que o Parceiro tenha uma Assinatura ATIVA (Novo requisito do sistema)
  await prisma.assinatura.upsert({
    where: { parceiroId: parceiro.id },
    update: { 
      status: 'ATIVA', 
      renovaEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 dias
    },
    create: {
      parceiroId: parceiro.id,
      status: 'ATIVA',
      inicioEm: new Date(),
      renovaEm: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })
  console.log(`💳 Assinatura do parceiro ativada com sucesso!`)

  // 3. Limpeza de ofertas antigas (Para não poluir a tela do usuário a cada vez que roda o seed)
  console.log("🧹 Limpando ofertas e resgates antigos...")
  await prisma.resgate.deleteMany({ where: { userId: consumidor.id } })
  await prisma.oferta.deleteMany({ where: { vendedorId: parceiro.id } })

  // 4. Criação de novas Ofertas com validade segura
  const dataHoje = new Date()
  const validadeCurta = new Date(dataHoje.getTime() + 12 * 60 * 60 * 1000) // +12 horas (Seguro para E2E)
  const validadeLonga = new Date(dataHoje.getTime() + 48 * 60 * 60 * 1000) // +48 horas

  console.log("📦 Gerando Novas Ofertas no estoque...")

  const oferta1 = await prisma.oferta.create({
    data: {
      titulo: "Combo de Coxinhas (Fim de Expediente)",
      descricao: "Sobraram 10 unidades fresquinhas da nossa fornada da tarde. Estão crocantes, massa de batata e muito recheio de frango.",
      precoOriginal: 25.00,
      precoResgate: 10.00,
      quantidade: 10,
      categoria: "Salgados",
      dataValidade: validadeCurta,
      localizacao: parceiro.rua ? `${parceiro.rua}, ${parceiro.numero}` : "Rua João de Camargo, 510 - Centro",
      imagemUrl: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop"],
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
      imagemUrl: ["https://images.unsplash.com/photo-1582293041079-7814c2712fb1?q=80&w=1000&auto=format&fit=crop"],
      vendedorId: parceiro.id
    }
  })

  // 5. Histórico de Compras Falsos
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

  console.log("🎉 Seed v2.0 finalizado com sucesso! Seu app está pronto para uso e para os testes do Playwright.")
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