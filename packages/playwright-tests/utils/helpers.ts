import { Page, Locator } from '@playwright/test'

/**
 * Wait for page to be fully loaded
 * @param page - Playwright page object
 * @param waitForNetworkIdle - Whether to wait for network idle (slower, use sparingly)
 */
export async function waitForPageLoad(
    page: Page,
    waitForNetworkIdle: boolean = false
): Promise<void> {
    await page.waitForLoadState('domcontentloaded')
    if (waitForNetworkIdle) {
        await page.waitForLoadState('networkidle')
    }
}

/**
 * Take a screenshot with timestamp
 * @param page - Playwright page object
 * @param name - Screenshot name (used in filename)
 * @param fullPage - Whether to capture full page
 */
export async function takeScreenshot(
    page: Page,
    name: string,
    fullPage: boolean = true
): Promise<void> {
    const timestamp = Date.now()
    await page.screenshot({
        path: `reports/screenshots/${name}_${timestamp}.png`,
        fullPage: fullPage,
    })
}

/**
 * Simulate human-like typing using pressSequentially
 * @param locator - Element locator
 * @param text - Text to type
 * @param delayMs - Delay between keystrokes (ms)
 */
export async function humanType(
    locator: Locator,
    text: string,
    delayMs: number = 100
): Promise<void> {
    await locator.clear()
    await locator.pressSequentially(text, { delay: delayMs })
}

/**
 * Retry function for flaky operations with exponential backoff
 * @param fn - Async function to retry
 * @param retries - Maximum retry attempts
 * @param delay - Initial delay in ms (doubles each retry)
 * @param shouldRetry - Optional predicate to decide if an error should be retried
 */
export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000,
    shouldRetry: (error: Error) => boolean = () => true
): Promise<T> {
    let lastError: Error

    for (let i = 0; i < retries; i++) {
        try {
            return await fn()
        } catch (error) {
            lastError = error as Error
            if (!shouldRetry(lastError)) throw lastError
            console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 2
        }
    }

    throw new Error(`Failed after ${retries} retries: ${lastError!.message}`)
}

/**
 * Generate random test data for dynamic testing
 * @returns Object with random search terms, email, and phone
 */
export function generateTestData() {
    const randomNumber = Math.floor(Math.random() * 10000)
    const phoneBrands = ['iPhone', 'Samsung', 'Xiaomi']
    const laptopBrands = ['Apple', 'MacBook', 'MacBook Air']

    return {
        searchTermPhone: phoneBrands[Math.floor(Math.random() * phoneBrands.length)],
        searchTermLaptop: laptopBrands[Math.floor(Math.random() * laptopBrands.length)],
        email: `test_${randomNumber}@example.com`,
        phone: `07${Math.floor(Math.random() * 10000000)}`,
    }
}

/**
 * Parse Romanian price format (1.234 RON -> 1234)
 * @param priceText - Price string (e.g., "1.234,56 RON")
 * @returns Number value or null if parsing fails
 */
export function parsePrice(priceText: string): number | null {
    if (!priceText) return null
    const match = priceText.match(/([\d.,]+)/)
    if (!match) return null
    const normalized = match[1].replace(/\./g, '').replace(',', '.')
    return parseFloat(normalized)
}
