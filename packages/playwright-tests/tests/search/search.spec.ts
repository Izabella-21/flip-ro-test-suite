import { test, expect } from '@playwright/test'
import { SearchResultsPage } from '../../pages/SearchResultsPage'
import { searchTerms } from '../../fixtures/test-data'
import { generateTestData } from '../../utils/helpers'
import { handleCookiePopup } from '../../utils/cookie-helper'

test.describe('Flip.ro Search Functionality', () => {

    test.describe.configure({ mode: 'parallel' })

    let searchResults: SearchResultsPage

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await handleCookiePopup(page)
        searchResults = new SearchResultsPage(page)
    })

    test('@smoke - Search for popular brand returns results', async () => {
        const testData = generateTestData()
        const searchTerm = testData.searchTermPhone
        await searchResults.searchFor(searchTerm)

        const productCount = await searchResults.getProductCount()
        expect(productCount).toBeGreaterThan(0)

        const containsTerm = await searchResults.resultsContainTerm(searchTerm)
        expect(containsTerm).toBe(true)
    })

    test('Search for specific model - iPhone 13', async () => {
        await searchResults.searchFor('iPhone 13')

        const titles = await searchResults.getAllProductTitles()
        const hasiPhone13 = titles.some(title =>
            title.toLowerCase().includes('iphone 13') ||
            title.toLowerCase().includes('iphone13')
        )

        expect(hasiPhone13).toBe(true)
    })

    test('Search for laptop returns laptop products', async () => {
        const searchTerm = 'MacBook'
        await searchResults.searchFor(searchTerm)
        await searchResults.waitForResults()
        const titles = await searchResults.getAllProductTitles()
        const hasLaptop = titles.some(title =>
            title.toLowerCase().includes('macbook') ||
            title.toLowerCase().includes('apple') && title.toLowerCase().includes('laptop')
        )

        expect(hasLaptop).toBe(true)
        console.log(`Laptop search returned ${titles.length} products`)
    })

    test('Search with non-existent product shows no results message', async () => {
        await searchResults.searchFor(searchTerms.nonExistent)
        const hasNoResults = await searchResults.hasNoResults()
        const productCount = await searchResults.getProductCount()
        expect(hasNoResults || productCount === 0).toBe(true)
    })

    test('Search preserves term in URL', async () => {
        const searchTerm = 'Samsung'
        await searchResults.searchFor(searchTerm)

        const urlTerm = searchResults.getSearchTermFromUrl()
        expect(urlTerm?.toLowerCase()).toContain(searchTerm.toLowerCase())
    })
})
