import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const isCI = !!process.env.CI

export default defineConfig({
    testDir: './tests',
    fullyParallel: !isCI,
    retries: isCI ? 3 : 1,
    workers: isCI ? 1 : 2,
    timeout: isCI ? 120000 : 60000,

    expect: {
        timeout: isCI ? 15000 : 5000,
    },

    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'junit.xml' }],
        ['list'],
    ],

    use: {
        baseURL: 'https://flip.ro',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: isCI ? 30000 : 15000,
        navigationTimeout: isCI ? 60000 : 30000,
        launchOptions: {
            slowMo: isCI ? 300 : 500,
            headless: isCI ? true : false,
        },
        ignoreHTTPSErrors: true,
        viewport: { width: 1280, height: 720 },
        locale: 'ro-RO',
        timezoneId: 'Europe/Bucharest',
    },

    projects: isCI
        ? [
            {
                name: 'chromium',
                use: {
                    ...devices['Desktop Chrome'],
                    launchOptions: {
                        args: [
                            '--disable-dev-shm-usage',
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-gpu',
                        ],
                    },
                },
            },
        ]
        : [
            { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
            { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
            { name: 'webkit', use: { ...devices['Desktop Safari'] } },
            { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
            { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
        ],
})
