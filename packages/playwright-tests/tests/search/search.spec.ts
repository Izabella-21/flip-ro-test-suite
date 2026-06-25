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
        // USE generateTestData
        const testData = generateTestData()
        const searchTerm = testData.searchTermPhone

        await searchResults.searchFor(searchTerm)

        const productCount = await searchResults.getProductCount()
        expect(productCount).toBeGreaterThan(0)

        const containsTerm = await searchResults.resultsContainTerm(searchTerm)
        expect(containsTerm).toBe(true)
    })

    test('Search for specific model - iPhone 13', async () => {
        // This one can stay specific (it's testing a specific model)
        await searchResults.searchFor('iPhone 13')


        const titles = await searchResults.getAllProductTitles()
        const hasiPhone13 = titles.some(title =>
            title.toLowerCase().includes('iphone 13') ||
            title.toLowerCase().includes('iphone13')
        )

        expect(hasiPhone13).toBe(true)
    })

    test('Search for laptop returns laptop products', async () => {
        // Use generateTestData for variety
        const testData = generateTestData()
        const searchTerm = testData.searchTermLaptop
        await searchResults.searchFor(searchTerm)
        const titles = await searchResults.getAllProductTitles()
        const hasLaptop = titles.some(title =>
            title.toLowerCase().includes('apple') ||
            title.toLowerCase().includes('intel')
        )

        expect(hasLaptop).toBe(true)
    })

    test('Search with non-existent product shows no results message', async () => {
        await searchResults.searchFor(searchTerms.nonExistent)
        const hasNoResults = await searchResults.hasNoResults()
        const productCount = await searchResults.getProductCount()

        // Either shows "no results" message OR product count is 0
        expect(hasNoResults || productCount === 0).toBe(true)
    })

    test('Search preserves term in URL', async () => {
        const searchTerm = 'Samsung'
        await searchResults.searchFor(searchTerm)

        const urlTerm = searchResults.getSearchTermFromUrl()
        expect(urlTerm?.toLowerCase()).toContain(searchTerm.toLowerCase())
    })
})
