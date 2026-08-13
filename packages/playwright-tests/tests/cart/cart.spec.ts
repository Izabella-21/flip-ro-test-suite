import { test, expect, Page } from '@playwright/test'
import { ProductPage } from '../../pages/ProductPage'
import { handleCookiePopup } from '../../utils/cookie-helper'

const PRODUCT_URL =
    '/magazin/apple/telefon-mobil-apple-iphone-15-128gb-black/75267921/?shape=Foarte%20bun'

async function acceptCookies(page: Page): Promise<void> {
    await handleCookiePopup(page)

    const cookieDialog = page.getByRole('dialog', {
        name: /Politica de utilizare Cookie-uri/i,
    })

    if (await cookieDialog.isVisible().catch(() => false)) {
        const allowAll = cookieDialog.getByRole('button', {
            name: /Permite toate/i,
        })

        if (await allowAll.isVisible().catch(() => false)) {
            await allowAll.click({ force: true })
            await page.waitForTimeout(500)
        }
    }
}

async function addSingleProduct(page: Page): Promise<void> {
    await page.goto(`https://flip.ro${PRODUCT_URL}`, {
        waitUntil: 'domcontentloaded',
    })

    await acceptCookies(page)

    const productPage = new ProductPage(page)
    await productPage.productTitle.waitFor({
        state: 'visible',
        timeout: 15000,
    })

    await productPage.clickAddToCartButton()
    await page.waitForTimeout(2000)
}

test.describe('Flip.ro Shopping Cart', () => {
    test('Cart badge updates after adding a product', async ({ page }) => {
        await addSingleProduct(page)

        const cartTrigger = page.locator('[data-cy="navbar-cart"]').first()
        await cartTrigger.waitFor({ state: 'visible', timeout: 15000 })

        await expect(cartTrigger).toContainText(/1/i)
        await expect(cartTrigger).toContainText(/Cosul meu/i)
    })

    test('Accessory recommendation dialog appears after add to cart', async ({ page }) => {
        await addSingleProduct(page)

        const dialog = page
            .locator('[role="dialog"]')
            .filter({ hasText: /Iti mai recomandam si:/i })
            .first()

        await expect(dialog).toBeVisible({ timeout: 10000 })

        await page.keyboard.press('Escape')
        await expect(dialog).not.toBeVisible({ timeout: 5000 })
    })

    test('Cart trigger remains clickable', async ({ page }) => {
        await addSingleProduct(page)

        const cartTrigger = page.locator('[data-cy="navbar-cart"]').first()
        await cartTrigger.scrollIntoViewIfNeeded()
        await cartTrigger.click({ force: true })

        await expect(cartTrigger).toBeVisible()
        await expect(cartTrigger).toContainText(/Cosul meu/i)
    })
})
