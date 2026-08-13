import { Page, Locator } from '@playwright/test'

export class ProductPage {
    readonly page: Page

    // Product information
    readonly productTitle: Locator
    readonly productPrice: Locator
    readonly newPrice: Locator
    readonly savings: Locator
    readonly condition: Locator

    // Product details
    readonly description: Locator
    readonly specifications: Locator
    readonly specificationsTab: Locator

    // Actions
    readonly addToCartButton: Locator

    // Images
    readonly mainImage: Locator
    readonly thumbnailImages: Locator

    constructor(page: Page) {
        this.page = page

        this.productTitle = page.locator('#pdp-title')
        this.productPrice = page.locator('#pdp-price-value').first()
        this.newPrice = page.locator('#pdp-price-new-value').first()
        this.savings = page.locator('#pdp-price-save-value').first()
        this.condition = page.locator('#pdp-shape-value')

        this.description = page.locator('#pdp-description')
        this.specifications = page.locator('#pdp-specs')
        this.specificationsTab = page.locator('button').filter({ hasText: /Vezi toate specificațiile/ })

        this.addToCartButton = page.getByRole('button', { name: /Adauga in cos/i }).first()

        this.mainImage = page.locator('img.cursor-zoom-in').first()
        this.thumbnailImages = page.locator('.relative.flex.gap-x-2 img')
    }

    async waitForPageLoad(): Promise<void> {
        await this.productTitle.waitFor({ state: 'visible', timeout: process.env.CI ? 30000 : 10000 })
        await this.page.waitForLoadState('domcontentloaded')
    }

    /**
     * Get product title
     */
    async getProductTitle(): Promise<string> {
        return await this.productTitle.textContent() || ''
    }

    /**
     * Internal helper to parse Flip.ro price format
     * Example: "1.42999" → 1429.99
     */
    private parseFlipPrice(priceText: string): number {
        if (!priceText) return 0
        const match = priceText.match(/([\d.,]+)/)
        if (!match) return 0
        const cleaned = match[1].replace(/\./g, '').replace(',', '.')
        const noDots = cleaned.replace(/\./g, '')
        if (noDots.length <= 2) return parseFloat(noDots)
        const integerPart = noDots.slice(0, -2)
        const decimalPart = noDots.slice(-2)
        return parseFloat(`${integerPart}.${decimalPart}`)
    }

    /**
     * Get current product price
     */
    async getProductPrice(): Promise<number> {
        const priceText = await this.productPrice.textContent() || ''
        return this.parseFlipPrice(priceText)
    }

    /**
     * Get new product price (original price)
     */
    async getNewPrice(): Promise<number> {
        const priceText = await this.newPrice.textContent() || ''
        return this.parseFlipPrice(priceText)
    }

    /**
     * Get savings amount
     */
    async getSavings(): Promise<number> {
        const savingsText = await this.savings.textContent() || ''
        const match = savingsText.match(/([\d.,]+)/)
        return match ? parseFloat(match[1].replace(/\./g, '').replace(',', '.')) : 0
    }

    /**
     * Get product condition
     */
    async getProductCondition(): Promise<string> {
        return await this.condition.textContent() || ''
    }

    /**
     * Get product description
     */
    async getProductDescription(): Promise<string> {
        return await this.description.textContent() || ''
    }

    /**
     * Get product specifications
     */
    async getProductSpecifications(): Promise<string> {
        return await this.specifications.textContent() || ''
    }

    /**
     * Click on specifications tab
     */
    async clickSpecificationsTab(): Promise<void> {
        await this.specificationsTab.click()
        await this.page.locator('.spec-row, .specification-item').first().waitFor({ state: 'visible' })
    }

    /**
     * Click on add to cart button
     */
    async clickAddToCartButton(): Promise<void> {
        await this.addToCartButton.waitFor({ state: 'visible', timeout: 5000 })

        // Scroll button into view and ensure viewport positioning
        await this.addToCartButton.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(800)

        // Click using evaluate to ensure it works even if partially obscured
        await this.addToCartButton.evaluate((element) => {
            ; (element as HTMLElement).click()
        })

        await this.page.waitForTimeout(500)
    }

    /**
     * Get main product image URL
     */
    async getMainImageUrl(): Promise<string> {
        return await this.mainImage.getAttribute('src') || ''
    }

    /**
     * Get all thumbnail image URLs
     */
    async getThumbnailImageUrls(): Promise<string[]> {
        const urls: string[] = []
        const count = await this.thumbnailImages.count()
        for (let i = 0; i < count; i++) {
            const url = await this.thumbnailImages.nth(i).getAttribute('src')
            if (url) urls.push(url)
        }
        return urls
    }

    /**
     * Verify product name matches expected
     */
    async verifyProductName(expectedName: string): Promise<boolean> {
        const actualName = await this.getProductTitle()
        return actualName.toLowerCase().includes(expectedName.toLowerCase())
    }
}
