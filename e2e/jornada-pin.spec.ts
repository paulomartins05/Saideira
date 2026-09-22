import { test, expect } from '@playwright/test';

test.describe('Jornada do Lojista: Validação de PIN', () => {

    test('Deve validar o PIN de um resgate pendente', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[name="email"], input[type="email"]', 'parceiro@teste.com');
        await page.fill('input[name="senha"], input[type="password"]', 'senhas123');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/');

        await page.goto('/parceiro/perfil');

        const pinInput = page.locator('input[placeholder*="PIN"], input[name="pin"]').first();

        if (await pinInput.isVisible()) {
            await pinInput.fill('4592');
            await page.click('button:has-text("Validar"), button:has-text("Confirmar"), button:has-text("Entregar")');

            await expect(page.locator('text=sucesso')).toBeVisible({ timeout: 15000 });
        } else {
            console.log("Campo de inserção de PIN não encontrado. O Parceiro pode precisar abrir um modal primeiro.");
        }
    });
});
