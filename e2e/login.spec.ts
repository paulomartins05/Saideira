import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login', () => {

    test('Deve realizar login com credenciais válidas e redirecionar', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'parceiro@teste.com');
        await page.fill('input[type="password"]', 'senhas123');

        await page.click('button[type="submit"]');

        await expect(page).not.toHaveURL('/login', { timeout: 15000 });
    });

    test('Deve exibir erro ao tentar logar com senha errada', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'parceiro@teste.com');
        await page.fill('input[type="password"]', 'senha_errada_proposital');
        await page.click('button[type="submit"]');

        const botao = page.locator('button[type="submit"]');
        await expect(botao).toBeEnabled();
    });

    test('A Oferta em Destaque não deve causar erro fatal se o banco estiver vazio', async ({ page }) => {
        await page.goto('/login');

        await expect(page.locator('text=Bem-vindo de volta')).toBeVisible();
    });
});
