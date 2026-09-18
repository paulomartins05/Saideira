import { test, expect } from '@playwright/test';

test.describe('Painel do Parceiro - Aba Financeiro', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', 'parceiro@teste.com');
        await page.fill('input[type="password"]', 'senhas123');
        await page.click('button[type="submit"]');

        await page.waitForURL('**/');
    });

    test('Deve filtrar as transações e injetar o parâmetro na URL', async ({ page }) => {
        await page.goto('/parceiro/perfil?aba=financeiro');

        await page.selectOption('select', '15');

        await expect(page).toHaveURL(/.*periodo=15/, { timeout: 15000 });
    });

    test('Deve gerar e iniciar o download do arquivo CSV', async ({ page }) => {
        await page.goto('/parceiro/perfil?aba=financeiro');

        const downloadPromise = page.waitForEvent('download');

        await page.click('button:has-text("Extrair")');

        const download = await downloadPromise;

        expect(download.suggestedFilename()).toContain('.csv');
    });
});
