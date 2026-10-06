# Flip.ro Playwright test commands

.DEFAULT_GOAL := help
.PHONY: help setup verify clean test test-all test-playwright test-ci test-smoke
.PHONY: test-chrome test-firefox test-webkit test-mobile
.PHONY: test-headed test-debug report

PLAYWRIGHT_DIR := packages/playwright-tests

help:
	@echo "Flip.ro Playwright test suite"
	@echo "  make setup         Install npm dependencies and Playwright browsers"
	@echo "  make verify        Check Node.js, npm, and Playwright"
	@echo "  make test          Run the local browser matrix"
	@echo "  make test-all      Run all implemented tests"
	@echo "  make test-ci       Run CI-mode Chromium tests headlessly"
	@echo "  make test-smoke    Run tests tagged @smoke"
	@echo "  make test-chrome   Run Chromium tests"
	@echo "  make test-firefox  Run Firefox tests"
	@echo "  make test-webkit   Run WebKit tests"
	@echo "  make test-mobile   Run mobile Chrome tests"
	@echo "  make test-headed   Run headed tests"
	@echo "  make test-debug    Run Playwright in debug mode"
	@echo "  make report        Open the HTML report"
	@echo "  make clean         Remove generated Playwright output"

setup:
	cd "$(PLAYWRIGHT_DIR)" && npm ci && npx playwright install

verify:
	node --version
	npm --version
	cd "$(PLAYWRIGHT_DIR)" && npm ls @playwright/test --depth=0 && npx playwright --version

clean:
	rm -rf "$(PLAYWRIGHT_DIR)/playwright-report" "$(PLAYWRIGHT_DIR)/test-results"
	rm -f "$(PLAYWRIGHT_DIR)/test-results.json" "$(PLAYWRIGHT_DIR)/junit.xml"

test: test-playwright

test-all: test-playwright

test-playwright:
	cd "$(PLAYWRIGHT_DIR)" && npm test

test-ci:
	cd "$(PLAYWRIGHT_DIR)" && CI=1 npm test

test-smoke:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:smoke

test-chrome:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:chrome

test-firefox:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:firefox

test-webkit:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:webkit

test-mobile:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:mobile

test-headed:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:headed

test-debug:
	cd "$(PLAYWRIGHT_DIR)" && npm run test:debug

report:
	cd "$(PLAYWRIGHT_DIR)" && npm run report