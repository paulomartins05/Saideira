# 🥐 Saideira (Salgado Salvo)

> A última rodada do dia, por um preço menor. Compre excedentes perto de você.

O **Saideira** é uma plataforma inovadora que conecta estabelecimentos alimentícios (restaurantes, padarias, mercados e docerias) com consumidores locais. O objetivo principal é **combater o desperdício de alimentos** permitindo que os parceiros vendam seus excedentes de produção no fim do dia (a "saideira") com descontos significativos. 

Além de ajudar o meio ambiente, os parceiros recuperam o custo de produção e os consumidores têm acesso a refeições de qualidade por uma fração do preço.

---

## 🚀 Tecnologias e Stack

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema JavaScript/TypeScript, focando em performance, escalabilidade e na melhor experiência de desenvolvimento (DX) e de usuário (UX).

### Frontend & Core
- **[Next.js 16](https://nextjs.org/)**: Framework React utilizando o App Router para renderização híbrida (SSR, SSG e CSR) e Server Actions.
- **[React 19](https://react.dev/)**: Biblioteca principal de UI.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e previsibilidade no código.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização baseada em utilitários para um design responsivo e customizável.
- **[Lucide React](https://lucide.dev/)**: Ícones limpos e consistentes.
- **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)**: Gerenciamento de estado de formulários complexos e validação rigorosa de schemas (tanto no cliente quanto no servidor).
- **[Sonner](https://sonner.emilkowal.ski/)**: Sistema de *Toasts* moderno para feedback instantâneo ao usuário.

### Backend, Banco de Dados & Autenticação
- **[Prisma ORM v7](https://www.prisma.io/)**: Mapeamento objeto-relacional para modelagem e consultas ao banco de dados com total segurança de tipos.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional principal.
- **[Better-Auth](https://better-auth.com/)**: Solução completa e moderna de autenticação para controle de sessões, login, registro e recuperação de senha.

### Integrações & Ferramentas Essenciais
- **[Mercado Pago](https://www.mercadopago.com.br/developers)**: Integração nativa para pagamentos seguros em assinatura para vendedores.
- **[Cloudinary](https://cloudinary.com/)**: Gerenciamento, otimização e armazenamento de imagens das ofertas e perfis.
- **[Leaflet](https://leafletjs.com/) (`react-leaflet`)**: Renderização de mapas dinâmicos e cálculo de distância entre o consumidor e o estabelecimento.
- **[Resend](https://resend.com/)**: Envio de e-mails transacionais (como recuperação de senhas e recibos de compra).

---

## 🎯 Principais Funcionalidades

### Para os Consumidores
- **Busca por Proximidade**: Encontre ofertas disponíveis baseadas na sua localização usando o mapa integrado.
- **Categorização Inteligente**: Filtre resgates por Restaurantes, Padarias, Mercados ou Docerias.
- **Carrinho e Checkout Ágil**: Adicione múltiplos itens e finalize sua compra com segurança via Mercado Pago.
- **Gatilhos de Urgência**: Contagem regressiva visual para produtos próximos do vencimento ("Fechando agora").
- **Gerenciamento de Perfil**: Controle de dados, histórico de resgates e endereços.

### Para os Parceiros (Estabelecimentos)
- **Painel de Controle (Dashboard)**: Visão geral das vendas, itens resgatados e faturamento.
- **Gestão de Ofertas ("Resgates")**: Criação ágil de anúncios de excedentes, incluindo upload de fotos via Cloudinary, definição de estoque, preços e prazos de validade.
- **Assinatura Premium**: Possibilidade de impulsionar ofertas para que apareçam no topo das buscas dos consumidores.
- **Validação de Código**: Sistema seguro para validar presencialmente o código do resgate quando o cliente for retirar o pedido.

---

## 🏗️ Padrões de Arquitetura & UX Aplicados

Durante o desenvolvimento, priorizamos as melhores práticas da engenharia de software frontend:
- **Server Actions**: Mutação de dados diretamente do servidor para o cliente sem a necessidade de construir endpoints de API REST intermediários.
- **Optimistic UI & Loading States**: Uso intenso de *hooks* do React (como `useFormStatus` e `useState`) junto a componentes personalizados (ex: `<SubmitButton>`) para travar botões e evitar duplo-envio (*double-submit*), fornecendo feedback visual contínuo.
- **DRY (Don't Repeat Yourself)**: Componentização modular extensiva. Botões, modais, *cards* de produtos e cabeçalhos foram isolados para reaproveitamento em todo o sistema.
- **Early Returns Evitados Indevidamente**: Estruturação cuidadosa de UI em listas e paginações para garantir que barras de pesquisa e filtros não desapareçam caso os resultados da busca sejam vazios (`EmptyStates` bem projetados).
- **Proteção de Rotas Baseada em *Role***: O middleware e o controle de cabeçalhos garantem que rotas de Parceiros não sejam acessíveis a Consumidores, e vice-versa.

---

## 🛠️ Como rodar o projeto localmente

### Pré-requisitos
- Node.js versão 20+
- Um banco de dados PostgreSQL rodando localmente ou na nuvem.
- Contas configuradas no **Cloudinary**, **Mercado Pago** e **Resend** (para as variáveis de ambiente).

### Passo a passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/salgado-salvo.git
   cd salgado-salvo
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto e preencha com base no arquivo `.env.example`. Você precisará de:
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET` & `BETTER_AUTH_URL`
   - Chaves do Cloudinary (`CLOUDINARY_API_KEY`, etc)
   - Chaves do Mercado Pago
   - API Key do Resend

4. **Prepare o Banco de Dados**
   Gere o cliente do Prisma e empurre a estrutura para o banco:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Rode o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse**
   Abra `http://localhost:3000` no seu navegador para ver o app funcionando. Você pode usar o Prisma Studio (`npx prisma studio`) para gerenciar os dados facilmente.

---

*Projeto desenvolvido com as melhores práticas de Clean Code, UI/UX focada na conversão e preocupação genuína com o impacto ambiental.* 🌱
