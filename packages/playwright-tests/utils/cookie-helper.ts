// packages/playwright-tests/utils/cookie-helper.ts
import { Page } from '@playwright/test'

/**
 * Handles the Flip.ro cookie popup if it appears.
 * Call this after page.goto() in any test that needs the popup dismissed.
 */
export async function handleCookiePopup(page: Page) {
    try {
        const acceptButton = page.locator('#CybotCookiebotDialogBodyButtonAccept')

        // Check if the button is visible (give it 3 seconds to appear)
        if (await acceptButton.isVisible({ timeout: 3000 })) {
            await acceptButton.click()
            console.log('Cookie popup accepted (ID selector worked)')
            // Wait a moment for the popup to disappear
            await page.waitForTimeout(500)
        }
    } catch (error) {
        // No popup found
        console.log('No cookie popup found')
    }
}
