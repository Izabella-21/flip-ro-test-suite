import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

export default defineConfig({
    // Where to find test files
    testDir: './tests',

    // Run tests in parallel
    fullyParallel: true,

    // Retry failed tests in CI
    // retries: process.env.CI ? 2 : 1,
    retries: 0,

    // Number of parallel workers
    workers: process.env.CI ? 4 : 2,

    // Test timeout
    timeout: 60000,

    // Reporters
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'junit.xml' }],
        ['list']
    ],

    // Global setup
    globalSetup: undefined,

    use: {
        // Base URL for Flip.ro
        baseURL: 'https://flip.ro',

        // Collect trace when retrying
        trace: 'on-first-retry',

        // Take screenshot on failure
        screenshot: 'only-on-failure',

        // Record video on failure
        video: 'retain-on-failure',

        // Default timeout for actions
        actionTimeout: 15000,

        // Navigation timeout
        navigationTimeout: 30000,
    },

    // Configure browsers
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                viewport: { width: 1280, height: 720 },
            },
        },
        // Mobile viewports for responsive testing
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
})