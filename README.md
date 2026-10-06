# Flip.ro E-commerce Test Automation

**A Playwright and TypeScript portfolio project for validating critical customer journeys on a Romanian refurbished-electronics storefront.**

This repository focuses on browser-based quality engineering: maintainable test organization, reusable page objects and helpers, data-driven search scenarios, cross-browser coverage, and actionable failure artifacts.

## What This Suite Covers

| Area | Example checks |
| --- | --- |
| Homepage | Page title, rendered content, and a smoke-test entry point |
| Search | Popular brands and models, empty results, result content, and query preservation in the URL |
| Product details | Product title and price, savings calculation, condition, image, description, and add-to-cart control |
| Shopping cart | Cart badge after adding a product, recommendation dialog behavior, and cart control interaction |

The scenarios use the live `https://flip.ro` storefront. Product availability, consent dialogs, network conditions, or site changes can affect results.

## Engineering Practices

- **Page Object Model:** Page-specific behavior is kept in `pages/` and reused by the test suites.
- **Shared test utilities:** Cookie handling, test data, and helper functions live in `utils/` and `fixtures/`.
- **Data-driven coverage:** Search scenarios reuse the same test structure across products and fixture data.
- **Browser and device matrix:** Local runs cover Chromium, Firefox, WebKit, mobile Chrome, and mobile Safari emulation.
- **CI-aware execution:** CI mode runs headless Chromium with one worker and up to three retries; local execution uses the configured browser matrix.
- **Failure diagnostics:** Screenshots are captured on failure, video is retained for failed tests, and traces are recorded on the first retry.
- **Multiple report formats:** Playwright produces an HTML report, JSON results, and JUnit XML for review or CI ingestion.

## Project Structure

```text
packages/playwright-tests/
	fixtures/       Shared test data
	pages/          Page objects
	tests/          Homepage, search, product, and cart scenarios
	utils/          Reusable browser helpers
	playwright.config.ts
```

The currently implemented browser automation is the Playwright suite in `packages/playwright-tests`. The root Makefile provides shortcuts for the commands in this section.

## Run the Tests

### Prerequisites

- Node.js and npm
- Network access to `https://flip.ro`

### Install

```bash
cd packages/playwright-tests
npm ci
npx playwright install
```

### Execute

Run the complete local browser matrix:

```bash
npm test
```

Run smoke tests, a single browser, or headless CI-mode Chromium:

```bash
npm run test:smoke
npm run test:chrome
CI=true npm test
```

Other useful commands:

```bash
npm run test:firefox
npm run test:webkit
npm run test:mobile
npm run test:headed
npm run test:debug
```

`CI=true` enables the configuration's CI settings, including headless execution and the Chromium-only project. Local runs use the full configured project matrix and headed browsers.

## Reports and Artifacts

After a run, open the HTML report with:

```bash
npm run report
```

The suite writes `playwright-report/`, `test-results.json`, and `junit.xml` in `packages/playwright-tests/`. Failure screenshots, videos, and retry traces are also available in the Playwright test output.

## Configuration and Scope

The base URL, Romanian locale, and Bucharest timezone are set in `playwright.config.ts`. The suite exercises a public, changing storefront rather than a mocked environment, so it is useful for realistic end-to-end checks but is not fully isolated from production-site changes.

An ignored local `.env` file is available for local configuration, and `.env.examples` contains placeholders. The current browser tests do not require test-account credentials; never commit real credentials or personal data.

## About

Created by **Izabella Molnar** as a quality engineering portfolio project.