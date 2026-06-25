import { test, expect } from '@playwright/test'
import { searchTerms } from '../../fixtures/test-data'
import { SearchResultsPage } from '../../pages/SearchResultsPage'
import { handleCookiePopup } from '../../utils/cookie-helper'

/**
 * Parameterized search tests - same test structure, different inputs
 * Demonstrates efficient test design
 */

const searchScenarios = [
    { term: 'iPhone', expectedBrand: 'Apple', minResults: 1 },
    { term: 'Samsung', expectedBrand: 'Samsung', minResults: 1 },
    { term: 'Xiaomi', expectedBrand: 'Xiaomi', minResults: 1 },
    { term: 'MacBook', expectedBrand: 'Apple', minResults: 1 },
]

test.describe('Parameterized Search Tests', () => {

    let searchResults: SearchResultsPage

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await handleCookiePopup(page)
        searchResults = new SearchResultsPage(page)
    })

    for (const scenario of searchScenarios) {
        test(`Search for "${scenario.term}" returns ${scenario.expectedBrand} products`, async () => {
            await searchResults.searchFor(scenario.term)

            const productCount = await searchResults.getProductCount()
            expect(productCount).toBeGreaterThanOrEqual(scenario.minResults)

            // Verify product titles contain expected brand
            const titles = await searchResults.getAllProductTitles()
            const hasBrand = titles.some(title =>
                title.toLowerCase().includes(scenario.expectedBrand.toLowerCase())
            )
            expect(hasBrand).toBe(true)
        })
    }
})

// Using test data from fixtures
test.describe('Search with fixture data', () => {

    let searchResults: SearchResultsPage

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await handleCookiePopup(page)
        searchResults = new SearchResultsPage(page)
    })

    for (const term of searchTerms.popular) {
        test(`Fixture: Search for "${term}"`, async () => {
            await searchResults.searchFor(term)

            const productCount = await searchResults.getProductCount()
            expect(productCount).toBeGreaterThan(0)

            console.log(`"${term}" returned ${productCount} products`)
        })
    }
})
