import { test, expect } from '@playwright/test';

test.describe('Fluxo Principal: Criar e Resgatar Oferta', () => {

    test('1. Parceiro deve conseguir fazer login e criar uma oferta', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'parceiro@teste.com');
        await page.fill('input[type="password"]', 'senha123');
        await page.click('button:has-text("Entrar")');

        await expect(page).toHaveURL('/');

        // O sistema joga para a Home por padrão, então forçamos a ida para o painel de parceiro
        await page.goto('/parceiro/perfil');
        await expect(page).toHaveURL('/parceiro/perfil');

        await page.click('a[href="/parceiro/novo-resgate"]');
        await expect(page).toHaveURL('/parceiro/novo-resgate');

        await page.fill('input[name="nome"]', 'Bolo de Cenoura Teste E2E');
        await page.selectOption('select[name="categoria"]', { index: 1 });
        await page.fill('input[name="validade"]', '23:59');
        await page.fill('textarea[name="descricao"]', 'Bolo delicioso do final do dia');
        await page.setInputFiles('input[type="file"]', 'public/globe.svg');
        
        await page.fill('input[name="precoOriginal"]', '20.00');
        await page.fill('input[name="precoResgate"]', '10.00');
        await page.fill('input[name="quantidade"]', '1');
        await page.check('input[name="termosAceitos"]');

        await page.click('button:has-text("Publicar oferta")');

        await expect(page).toHaveURL('/', { timeout: 15000 });
    });

    test('2. Consumidor deve conseguir fazer login e resgatar a oferta', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'consumidor@teste.com');
        await page.fill('input[type="password"]', 'senha123');
        await page.click('button:has-text("Entrar")');

        await expect(page).toHaveURL('/');

        await page.click('text=Bolo de Cenoura Teste E2E');

        await expect(page).toHaveURL(/\/resgates\/.+/);

        await page.click('button:has-text("Resgatar")');

        // Após o resgate, a página redireciona para o /perfil
        await expect(page).toHaveURL('/perfil');

        // Verifica se a oferta está na lista de histórico do consumidor
        await expect(page.locator('text=Bolo de Cenoura Teste E2E').first()).toBeVisible();
    });

});
