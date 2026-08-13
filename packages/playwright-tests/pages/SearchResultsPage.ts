import { Page, Locator } from '@playwright/test'

/**
 * Page Object for Flip.ro search results page
 * URL pattern: https://flip.ro/search?q={term}
 */
export class SearchResultsPage {
    readonly page: Page

    // Locators
    readonly searchInput: Locator
    readonly resultsContainer: Locator
    readonly productCards: Locator
    readonly productTitles: Locator
    readonly productPrices: Locator
    readonly noResultsMessage: Locator
    readonly filterSidebar: Locator
    readonly sortDropdown: Locator
    readonly loadMoreButton: Locator

    constructor(page: Page) {
        this.page = page

        // Search input
        this.searchInput = page
            .locator('input[placeholder*="Cauta"], input[placeholder*="Caută"], input[aria-label*="Caut"], input[type="search"]')
            .filter({ hasNotText: '' })
            .first()

        // Product list elements
        this.resultsContainer = page.locator('.grid')
        this.productCards = page.locator('[data-cy="phone-item"]')
        this.productTitles = page.locator('[data-cy="phone-title"]')
        this.productPrices = page.locator('[data-cy="phone-price"]')

        // Filter and sort
        this.filterSidebar = page.locator('.filters, .filter-sidebar')
        this.sortDropdown = page.locator('select[aria-label="Sortare"], .sort-select')

        // Status messages
        this.noResultsMessage = page.getByText(/Nu am găsit|No results found/i)
        this.loadMoreButton = page.getByRole('button', { name: /Încarcă mai mult|Load more/i })
    }

    /**
     * Get the search input locator
     */
    getsearchInput(): Locator {
        return this.searchInput
    }

    /**
     * Search for a product
     */
    async searchFor(term: string): Promise<void> {
        const query = encodeURIComponent(term)
        await this.page.goto(`/magazin/?search=${query}`, { waitUntil: 'domcontentloaded' })
        await this.waitForResults()
    }

    /**
     * Wait for results to load
     */
    async waitForResults(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded')

        const tries = 10
        for (let i = 0; i < tries; i++) {
            const productCount = await this.productCards.count()
            const hasNoResults = await this.hasNoResults()

            if (productCount > 0 || hasNoResults) {
                return
            }

            await this.page.waitForTimeout(300)
        }
    }

    /**
     * Get number of products displayed
     */
    async getProductCount(): Promise<number> {
        return await this.productCards.count()
    }

    /**
     * Get all product titles as array
     */
    async getAllProductTitles(): Promise<string[]> {
        const titles: string[] = []
        const count = await this.productTitles.count()
        for (let i = 0; i < Math.min(count, 50); i++) {
            const title = await this.productTitles.nth(i).textContent()
            if (title) titles.push(title.trim())
        }
        return titles
    }

    /**
     * Get all product prices as numbers
     */
    async getAllProductPrices(): Promise<number[]> {
        const prices: number[] = []
        const count = await this.productPrices.count()
        for (let i = 0; i < Math.min(count, 50); i++) {
            const priceText = await this.productPrices.nth(i).textContent()
            if (priceText) {
                const price = this.parsePrice(priceText)
                if (price > 0) prices.push(price)
            }
        }
        return prices
    }

    /**
     * Parse Romanian price format (1.234 RON -> 1234)
     */
    private parsePrice(priceText: string): number {
        const match = priceText.match(/([\d.,]+)/)
        if (!match) return 0
        const normalized = match[1].replace(/\./g, '').replace(',', '.')
        return parseFloat(normalized)
    }

    /**
     * Get first product element
     */
    getFirstProduct(): Locator {
        return this.productCards.first()
    }

    /**
     * Click on first product
     */
    async clickFirstProduct(): Promise<void> {
        await this.getFirstProduct().click({ force: true })
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => undefined)
    }

    /**
     * Click on specific product by index
     */
    async clickProductByIndex(index: number): Promise<void> {
        await this.productCards.nth(index).click()
        await this.page.waitForLoadState('networkidle')
    }

    /**
     * Check if no results message is displayed
     */
    async hasNoResults(): Promise<boolean> {
        const bodyText = (await this.page.locator('body').innerText()).toLowerCase()
        return /nu am găsit|nu am gasit|niciun rezultat|no results|0 produse/.test(bodyText)
    }

    /**
     * Apply price filter
     */
    async applyPriceFilter(minPrice: number, maxPrice: number): Promise<void> {
        // Open price filter if collapsed
        const priceFilter = this.page.getByRole('button', { name: /Preț|Price/i })
        if (await priceFilter.isVisible()) {
            await priceFilter.click()
        }

        // Find min and max inputs
        const minInput = this.page.getByPlaceholder(/De la|Min/i)
        const maxInput = this.page.getByPlaceholder(/Până la|Max/i)
        const applyButton = this.page.getByRole('button', { name: /Aplică|Apply/i })

        await minInput.fill(minPrice.toString())
        await maxInput.fill(maxPrice.toString())
        await applyButton.click()

        await this.waitForResults()
    }

    /**
     * Sort results by option
     */
    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption({ label: option })
        await this.waitForResults()
    }

    /**
     * Verify results contain search term
     */
    async resultsContainTerm(searchTerm: string): Promise<boolean> {
        const titles = await this.getAllProductTitles()
        const lowerTerm = searchTerm.toLowerCase()
        return titles.some(title => title.toLowerCase().includes(lowerTerm))
    }

    /**
     * Load more results (for infinite scroll)
     */
    async loadMore(): Promise<void> {
        if (await this.loadMoreButton.isVisible()) {
            await this.loadMoreButton.click()
            await this.waitForResults()
        }
    }

    /**
     * Get search term from URL
     */
    getSearchTermFromUrl(): string | null {
        const url = this.page.url()
        const match = url.match(/[?&](?:search|q)=([^&]+)/i)
        return match ? decodeURIComponent(match[1]) : null
    }
}
