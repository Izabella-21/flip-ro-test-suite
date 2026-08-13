import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 2 : 2,
    timeout: process.env.CI ? 90000 : 60000, // Longer timeout in CI

    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'junit.xml' }],
        ['list']
    ],

    use: {
        baseURL: 'https://flip.ro',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 15000,
        navigationTimeout: 30000,
        // Reduce slowMo in CI for speed
        launchOptions: {
            slowMo: process.env.CI ? 0 : 500,
        }
    },

    // Only run specific browsers in CI
    projects: process.env.CI
        ? [
            // In CI: Only desktop browsers
            {
                name: 'chromium',
                use: { ...devices['Desktop Chrome'] },
            },
            // Optionally test Firefox too
            // {
            //     name: 'firefox',
            //     use: { ...devices['Desktop Firefox'] },
            // },
        ]
        : [
            // Locally: All browsers
            {
                name: 'chromium',
                use: { ...devices['Desktop Chrome'] },
            },
            {
                name: 'firefox',
                use: { ...devices['Desktop Firefox'] },
            },
            {
                name: 'webkit',
                use: { ...devices['Desktop Safari'] },
            },
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