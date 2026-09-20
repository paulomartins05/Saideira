import { test, expect } from '@playwright/test';

test('Deve fazer o login e colocar um resgate no carrinho', async ({ page }) => {

    await page.goto('/login');

    await page.fill('input[name="email"]', 'consumidor@teste.com');
    await page.fill('input[name="senha"]', 'senhas123');

    await page.click('button:has-text("Entrar")');

    await page.waitForURL('/');

    await expect(page.locator('h1')).toContainText('A última rodada');

    await page.click('article:has-text("R$")');

    await page.click('button:has-text("Resgatar")');

    await expect(page.locator('h1')).toContainText('Meus Resgates', { timeout: 15000 });
});
