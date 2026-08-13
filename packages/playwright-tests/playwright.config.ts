import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const isCI = !!process.env.CI

export default defineConfig({
    testDir: './tests',

    // Run tests sequentially in CI for stability
    fullyParallel: !isCI,

    // More retries in CI
    retries: isCI ? 3 : 1,

    // Single worker in CI to avoid race conditions
    workers: isCI ? 1 : 4,

    // Much longer timeout in CI
    timeout: isCI ? 120000 : 60000,

    // Longer expect timeout in CI
    expect: {
        timeout: isCI ? 15000 : 5000,
    },

    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results.json' }],
        ['junit', { outputFile: 'junit.xml' }],
        ['list'],
        // ✅ FIX: Use 'dot' as a string, not in an array
        ...(isCI ? ['dot' as any] : []),
    ],

    use: {
        baseURL: 'https://flip.ro',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Take screenshot when test fails
        screenshot: 'only-on-failure',

        // Record video when test fails
        video: 'retain-on-failure',

        // Longer timeouts in CI for slower actions
        actionTimeout: isCI ? 30000 : 15000,
        navigationTimeout: isCI ? 60000 : 30000,

        // SLOW DOWN in CI for stability (crucial!)
        launchOptions: {
            slowMo: isCI ? 300 : 500,  // 300ms delay in CI
            headless: isCI ? true : false,
        },

        // Ignore HTTPS errors
        ignoreHTTPSErrors: true,

        // Viewport for desktop tests
        viewport: { width: 1280, height: 720 },

        // Locale for the browser
        locale: 'ro-RO',
        timezoneId: 'Europe/Bucharest',
    },

    // Only run specific browsers in CI
    projects: isCI
        ? [
            // In CI: Only Chromium for speed and stability
            {
                name: 'chromium',
                use: {
                    ...devices['Desktop Chrome'],
                    // Extra Chrome settings for CI stability
                    launchOptions: {
                        args: [
                            '--disable-dev-shm-usage',
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-gpu',
                            '--disable-accelerated-2d-canvas',
                            '--disable-accelerated-javascript-decoding',
                            '--disable-accelerated-video-decode',
                            '--disable-web-security',
                            '--disable-features=IsolateOrigins,site-per-process',
                            '--disable-blink-features=AutomationControlled',
                            '--disable-background-timer-throttling',
                            '--disable-backgrounding-occluded-windows',
                            '--disable-renderer-backgrounding',
                            '--disable-default-apps',
                            '--disable-extensions',
                            '--disable-component-extensions-with-background-pages',
                            '--disable-client-side-phishing-detection',
                            '--disable-crash-reporter',
                            '--disable-dev-shm-usage',
                            '--disable-ipc-flooding-protection',
                            '--disable-popup-blocking',
                            '--disable-prompt-on-repost',
                            '--disable-hang-monitor',
                            '--disable-sync',
                            '--disable-translate',
                            '--disable-windows10-custom-titlebar',
                            '--no-first-run',
                            '--no-default-browser-check',
                        ],
                    },
                },
            },
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
