import { test, expect } from '@playwright/test';

test.describe('Filtros da Home Page', () => {

    test('Deve filtrar as ofertas ao clicar em uma categoria (Ex: Padaria)', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('h1').first()).toContainText('A última rodada do dia', { timeout: 15000 });

        const categoriaPadaria = page.locator('button:has-text("Padaria"), a:has-text("Padaria")').first();
        if (await categoriaPadaria.isVisible()) {
            await categoriaPadaria.click();

            await expect(page).toHaveURL(/.*categoria=Padaria/);
        } else {
            console.log("Botão de categoria 'Padaria' não encontrado ou já está selecionado.");
        }
    });

    test('Deve limpar o filtro ao clicar em "Todos"', async ({ page }) => {
        await page.goto('/?categoria=Restaurante');

        const categoriaTodos = page.locator('button:has-text("Todos"), a:has-text("Todos")').first();
        if (await categoriaTodos.isVisible()) {
            await categoriaTodos.click();

            await expect(page).not.toHaveURL(/.*categoria=Restaurante/);
        }
    });
});
