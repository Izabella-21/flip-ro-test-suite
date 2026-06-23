import { Page, Locator } from '@playwright/test'

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')
}

/**
 * Take a screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
    const timestamp = Date.now()
    await page.screenshot({
        path: `reports/screenshots/${name}_${timestamp}.png`,
        fullPage: true
    })
}

/**
 * Simulate human-like typing
 */
export async function humanType(locator: Locator, text: string, delayMs: number = 100): Promise<void> {
    await locator.clear()
    for (const char of text) {
        await locator.type(char, { delay: delayMs })
    }
}

/**
 * Retry function for flaky operations
 */
export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error

    for (let i = 0; i < retries; i++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error as Error
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 2 // Exponential backoff
        }
    }

    throw new Error(`Failed after ${retries} retries: ${lastError!.message}`)
}

/**
 * Generate random test data
 */
export function generateTestData() {
    const randomNumber = Math.floor(Math.random() * 10000)
    return {
        searchTerm: ['iPhone', 'Samsung', 'Google Pixel'][Math.floor(Math.random() * 3)],
        email: `test_${randomNumber}@example.com`,
        phone: `07${Math.floor(Math.random() * 10000000)}`,
    }
}

/**
 * Parse price from text (e.g., "1.234 RON" -> 1234)
 */
export function parsePrice(priceText: string): number {
    const match = priceText.match(/([\d.,]+)/)
    if (!match) return 0
    const normalized = match[1].replace(/\./g, '').replace(',', '.')
    return parseFloat(normalized)
}
