import { test, expect } from '@playwright/test';

test('Deve fazer o login e colocar um resgate no carrinho', async ({ page }) => {

    await page.goto('/login');

    await page.fill('input[name="email"]', 'teste@consumidor.com');
    await page.fill('input[name="password"]', 'senha123');

    await page.click('button:has-text("Entrar")');

    await expect(page.locator('h1')).toContainText('Fechando agora');

    await page.click('article:has-text("R$")');

    await page.click('button:has-text("Adicionar")');

    await expect(page.locator('text=adicionado ao carrinho')).toBeVisible();
});
