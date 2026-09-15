// Arquivo: e2e/consumidor.spec.ts
import { test, expect } from '@playwright/test';

test('Fluxo de Resgate Completo: Cadastro -> Login -> Resgate', async ({ page }) => {

  // Como o Better-Auth criptografa senhas, a forma mais segura de rodar E2E 
  // é fazer o robô se cadastrar no sistema toda vez com um e-mail aleatório!
  const emailAleatorio = `teste_${Date.now()}@email.com`;

  // 1. O robô entra na página de cadastro
  await page.goto('http://localhost:3000/cadastro');

  // 2. Preenche os dados de Consumidor
  await page.fill('input[name="nome"]', 'João do Teste');
  await page.fill('input[name="email"]', emailAleatorio);
  await page.fill('input[name="telefone"]', '11999999999');
  await page.fill('input[name="senha"]', 'senha123456');
  await page.fill('input[name="confirmarSenha"]', 'senha123456');

  await page.fill('input[name="cep"]', '01001000');
  await page.fill('input[name="rua"]', 'Praça da Sé');
  await page.fill('input[name="numero"]', '1');
  await page.fill('input[name="bairro"]', 'Sé');
  await page.fill('input[name="cidade"]', 'São Paulo');
  await page.fill('input[name="estado"]', 'SP');

  // 3. Clica para finalizar o cadastro
  await page.click('button:has-text("Finalizar Cadastro")');

  // 4. Espera redirecionar para a Home (Logado com sucesso) - Timeout maior pois o servidor está criptografando a senha
  await expect(page).toHaveURL('http://localhost:3000/', { timeout: 15000 });

  // 5. O robô procura uma oferta que o seu `seed.ts` já cria no banco hoje:
  await page.click('text=Combo de Coxinhas (Fim de Expediente)');

  // 6. Resgata
  await page.click('button:has-text("Resgatar")');

  // 7. Checa a tela de sucesso (perfil do usuário)
  await expect(page).toHaveURL('http://localhost:3000/perfil', { timeout: 10000 });
});
