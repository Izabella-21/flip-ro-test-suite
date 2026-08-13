// packages/playwright-tests/utils/cookie-helper.ts
import { Page } from '@playwright/test'

/**
 * Handles the Flip.ro cookie popup if it appears.
 * Call this after page.goto() in any test that needs the popup dismissed.
 */
export async function handleCookiePopup(page: Page): Promise<void> {
    try {
        const acceptButton = page.locator('#CybotCookiebotDialogBodyButtonAccept')
        if (await acceptButton.isVisible({ timeout: 3000 })) {
            await acceptButton.click()
            await page.waitForTimeout(500)
        }
    } catch {
        // Cookie popup not present or not visible
    }
}
