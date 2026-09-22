import { test, expect } from '@playwright/test';

test.describe('Segurança de Rotas (Middleware)', () => {

    test('Deve bloquear usuário não logado de acessar rota protegida (/parceiro/novo-resgate)', async ({ page }) => {
        await page.goto('/parceiro/novo-resgate');

        await expect(page).toHaveURL(/.*\/login/, { timeout: 15000 });
    });

    test('Deve bloquear Consumidor de acessar rota de Parceiro', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="email"], input[type="email"]', 'consumidor@teste.com');
        await page.fill('input[name="senha"], input[type="password"]', 'senhas123');
        await page.click('button[type="submit"]');
        await page.waitForURL('/');

        await page.goto('/parceiro/novo-resgate');

        await expect(page).not.toHaveURL(/.*\/parceiro\/novo-resgate/);
    });
});
