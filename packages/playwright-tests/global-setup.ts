// ============================================================
// global-setup.ts
// Runs ONCE before all tests start.
// ============================================================

import { FullConfig } from '@playwright/test'

export default async function globalSetup(config: FullConfig) {
    console.log('Running global setup...')

    // Fix: Add fallback URL if config doesn't have one
    const baseURL = config.projects[0].use.baseURL || 'https://flip.ro'
    console.log(`Target base URL: ${baseURL}`)

    // Optional: Check if the site is reachable
    try {
        const response = await fetch(baseURL)
        if (response.ok) {
            console.log(`Site is reachable (status: ${response.status})`)
        } else {
            console.warn(`Site returned status: ${response.status}`)
        }
    } catch (error) {
        console.error(`Site is NOT reachable: ${String(error)}`)
        throw new Error(`Site ${baseURL} is not reachable. Aborting tests.`)
    }

    // Return data that can be used in tests
    return {
        startTime: Date.now(),
        environment: process.env.NODE_ENV || 'test',
        baseURL: baseURL,
    }
}