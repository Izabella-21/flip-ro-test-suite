import { test, expect } from '@playwright/test'
import { SearchResultsPage } from '../../pages/SearchResultsPage'
import { ProductPage } from '../../pages/ProductPage'
import { handleCookiePopup } from '../../utils/cookie-helper'

test.describe('Flip.ro Product Page', () => {
    let searchResults: SearchResultsPage
    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await handleCookiePopup(page)
        searchResults = new SearchResultsPage(page)
        await searchResults.searchFor('iPhone')
        await searchResults.clickFirstProduct()
        productPage = new ProductPage(page)
        await productPage.waitForPageLoad()
    })

    test('Product page displays title and price', async () => {
        const title = await productPage.getProductTitle()
        const price = await productPage.getProductPrice()
        expect(title.length).toBeGreaterThan(3)
        expect(price).toBeGreaterThan(0)
    })

    test('Product price is reasonable', async () => {
        const price = await productPage.getProductPrice()
        expect(price).toBeGreaterThan(100)
        expect(price).toBeLessThan(10000)
    })

    test('Savings calculation is correct', async () => {
        const newPrice = await productPage.getNewPrice()
        const price = await productPage.getProductPrice()
        const savings = await productPage.getSavings()
        const expectedSavings = Math.round(newPrice - price)
        expect(savings).toBe(expectedSavings)
    })

    test('Add to cart button is visible', async () => {
        await expect(productPage.addToCartButton).toBeVisible()
    })

    test('Product has condition information', async () => {
        const condition = await productPage.getProductCondition()
        const validConditions = ['Foarte bun', 'Excelent', 'Bun', 'Acceptabil']
        const hasValidCondition = validConditions.some(c => condition.includes(c))
        expect(hasValidCondition).toBe(true)
    })

    test('Main product image is visible', async () => {
        await expect(productPage.mainImage).toBeVisible()
    })

    test('Product description is present', async () => {
        await expect(productPage.description).toBeVisible()
    })
})
