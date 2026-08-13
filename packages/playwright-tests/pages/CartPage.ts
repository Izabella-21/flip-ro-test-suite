import { expect, Locator, Page } from '@playwright/test'

export class CartPage {
    readonly page: Page

    readonly cartDrawer: Locator
    readonly cartHeader: Locator

    readonly cartItems: Locator
    readonly cartItemNames: Locator
    readonly removeItemButtons: Locator

    readonly subtotalPrice: Locator
    readonly checkoutButton: Locator

    constructor(page: Page) {
        this.page = page

        // Cart drawer is a div with headlessui-dialog-panel ID and data-open attribute
        this.cartDrawer = page.locator('[id*="headlessui-dialog-panel"][data-open]').first()

        this.cartHeader = this.cartDrawer
            .locator('text=Rezumat cos')
            .first()

        // Delete buttons are divs with data-cy attribute, not actual buttons
        this.removeItemButtons = this.cartDrawer.locator(
            '[data-cy="s-cart-item-delete"]',
        )

        this.cartItems = this.cartDrawer

        // Get item names from links pointing to product pages
        this.cartItemNames = this.cartDrawer.locator(
            'a[href*="/magazin/"]'
        )

        // Find subtotal price - it's in a <p> tag within the summary area
        this.subtotalPrice = this.cartDrawer.locator('p.font-bold').filter({ hasText: /LEI/ }).first()

        // Checkout button has data-cy="s-cart-next-step"
        this.checkoutButton = this.cartDrawer.locator('[data-cy="s-cart-next-step"]').first()
    }

    private parsePrice(text: string): number {
        const match = text.match(/[\d.,]+/)

        if (!match) return 0

        const digits = match[0].replace(/\D/g, '')

        if (digits.length <= 2) {
            return Number(digits)
        }

        return Number(
            `${digits.slice(0, -2)}.${digits.slice(-2)}`,
        )
    }

    async waitForCartLoad(): Promise<void> {
        // Wait for cart drawer (headlessui panel) to be visible
        await expect(this.cartDrawer).toBeVisible({
            timeout: 15000,
        })

        // Wait for delete button to be attached (confirms items are in DOM)
        await this.cartDrawer
            .locator('[data-cy="s-cart-item-delete"]')
            .first()
            .waitFor({ state: 'attached', timeout: 5000 })

        // Wait for cart header - but it might be hidden, so just check attachment
        await this.cartHeader.waitFor({ state: 'attached', timeout: 5000 })
    }

    async getItemCount(): Promise<number> {
        const deleteButtons = this.cartDrawer.locator('[data-cy="s-cart-item-delete"]')
        return await deleteButtons.count()
    }

    async getItemNames(): Promise<string[]> {
        // Get all links in the cart drawer that point to product pages
        const links = this.cartDrawer.locator('a[href*="/magazin/"]')
        const names = await links.allTextContents()

        return names
            .map((name) => name.trim())
            .filter((name) => name.length > 0 && !name.match(/^[\d\s]+$/))
    }

    async getSubtotal(): Promise<number> {
        const priceText = await this.subtotalPrice.textContent() || ''
        // Extract numbers including those in superscript tags
        // Format is "2.429<sup>98</sup> LEI" which comes through as "2.42998 LEI"
        const match = priceText.match(/[\d.,]+/)
        if (!match) return 0

        const digits = match[0].replace(/\D/g, '')
        if (digits.length <= 2) return Number(digits)

        // Assuming format: 242998 should become 2429.98
        return Number(`${digits.slice(0, -2)}.${digits.slice(-2)}`)
    }

    async removeItem(index: number): Promise<void> {
        const before = await this.getItemCount()

        expect(index).toBeGreaterThanOrEqual(0)
        expect(index).toBeLessThan(before)

        const button = this.removeItemButtons.nth(index)
        await button.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(300)

        // Use evaluate to click to avoid viewport issues
        await button.evaluate((element) => {
            ; (element as HTMLElement).click()
        })

        await expect.poll(
            () => this.getItemCount(),
            { timeout: 10000 },
        ).toBe(before - 1)
    }

    async removeAllItems(): Promise<void> {
        while (await this.getItemCount() > 0) {
            const before = await this.getItemCount()

            const button = this.removeItemButtons.first()
            await button.scrollIntoViewIfNeeded()
            await this.page.waitForTimeout(300)

            // Use evaluate to click to avoid viewport issues
            await button.evaluate((element) => {
                ; (element as HTMLElement).click()
            })

            await expect.poll(
                () => this.getItemCount(),
                { timeout: 10000 },
            ).toBeLessThan(before)
        }
    }

    async proceedToCheckout(): Promise<void> {
        await expect(this.checkoutButton).toBeVisible()
        await expect(this.checkoutButton).toBeEnabled()
        await this.checkoutButton.click()
    }

    async closeCart(): Promise<void> {
        await this.page.keyboard.press('Escape')

        await expect(this.cartDrawer).not.toBeVisible({
            timeout: 10000,
        })
    }
}
