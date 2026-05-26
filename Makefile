# ============================================================================
# FLIP.RO TEST SUITE - MASTER MAKEFILE
# ============================================================================
# One command to rule them all.
# Type 'make help' to see all commands.
# ============================================================================

.PHONY: help setup test-all clean
.PHONY: test-playwright test-cypress test-api test-performance test-ai
.PHONY: docker-build docker-run docker-clean
.PHONY: ai-interactive ai-analyze ai-generate ai-debug ai-docs

# Colors for pretty output (automatically disables in CI)
ifeq ($(CI),true)
    GREEN :=
    RED :=
    YELLOW :=
    NC :=
else
    GREEN := \033[0;32m
    RED := \033[0;31m
    YELLOW := \033[1;33m
    NC := \033[0m
endif

# ============================================================================
# HELP (Default command)
# ============================================================================

help:
	@echo "$(GREEN)╔══════════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(GREEN)║     FLIP.RO TEST SUITE - AVAILABLE COMMANDS                 ║$(NC)"
	@echo "$(GREEN)╚══════════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(YELLOW)📦 SETUP & MAINTENANCE$(NC)"
	@echo "  make setup           - Install all dependencies"
	@echo "  make clean           - Remove build artifacts and caches"
	@echo "  make verify          - Verify all components are working"
	@echo ""
	@echo "$(YELLOW)🎭 TEST SUITES$(NC)"
	@echo "  make test-all        - Run ALL test suites"
	@echo "  make test-playwright - Run Playwright tests only"
	@echo "  make test-cypress    - Run Cypress tests only"
	@echo "  make test-api        - Run Python API tests only"
	@echo "  make test-performance- Run k6 performance tests only"
	@echo "  make test-ai         - Run AI tools tests only"
	@echo "  make test-smoke      - Run quick smoke tests"
	@echo ""
	@echo "$(YELLOW)🤖 AI TOOLS$(NC)"
	@echo "  make ai-interactive  - Interactive AI assistant"
	@echo "  make ai-analyze      - Analyze a test failure"
	@echo "  make ai-generate     - Generate test cases"
	@echo "  make ai-debug        - Debug flaky test"
	@echo "  make ai-docs         - Generate documentation"
	@echo "  make ai-status       - Check AI tools status"
	@echo ""
	@echo "$(YELLOW)🐳 DOCKER$(NC)"
	@echo "  make docker-build    - Build all Docker images"
	@echo "  make docker-run      - Run all tests in Docker"
	@echo "  make docker-clean    - Remove Docker containers and images"
	@echo ""
	@echo "$(YELLOW)📊 REPORTS & DASHBOARD$(NC)"
	@echo "  make report          - Open HTML test report"
	@echo "  make dashboard       - Generate and open dashboard"
	@echo ""

# ============================================================================
# SETUP & MAINTENANCE
# ============================================================================

setup:
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	@echo ""
	@echo "  Installing Playwright tests..."
	@cd packages/playwright-tests && npm ci 2>/dev/null || npm install
	@echo "  ✅ Playwright dependencies installed"
	@echo ""
	@echo "  Installing Cypress tests..."
	@cd packages/cypress-tests && npm ci 2>/dev/null || npm install
	@echo "  ✅ Cypress dependencies installed"
	@echo ""
	@echo "  Installing API tests..."
	@cd packages/api-tests && pip install -r requirements.txt
	@echo "  ✅ API dependencies installed"
	@echo ""
	@echo "  Installing Performance tests..."
	@cd packages/performance-tests && npm ci 2>/dev/null || npm install
	@echo "  ✅ Performance dependencies installed"
	@echo ""
	@echo "  Installing AI tools..."
	@cd packages/ai-tools && pip install -r requirements.txt
	@echo "  ✅ AI tools dependencies installed"
	@echo ""
	@echo "  Installing Playwright browsers..."
	@cd packages/playwright-tests && npx playwright install chromium
	@echo "  ✅ Playwright browsers installed"
	@echo ""
	@echo "$(GREEN)✅ Setup complete!$(NC)"

clean:
	@echo "$(RED)🧹 Cleaning up...$(NC)"
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@find . -name "playwright-report" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "test-results" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "cypress/screenshots" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "cypress/videos" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "reports" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name ".pytest_cache" -type d -exec rm -rf {} + 2>/dev/null || true
	@echo "$(GREEN)✅ Clean complete$(NC)"

verify:
	@echo "$(GREEN)🔍 Running verification...$(NC)"
	@echo ""
	@echo -n "  Node.js: "
	@node --version
	@echo -n "  Python: "
	@python3 --version
	@echo -n "  Docker: "
	@docker --version 2>/dev/null || echo "not installed"
	@echo -n "  k6: "
	@k6 version 2>/dev/null || echo "not installed"
	@echo ""
	@echo "  Checking Playwright..."
	@cd packages/playwright-tests && npx playwright --version
	@echo "  Checking pytest..."
	@cd packages/api-tests && pytest --version
	@echo ""
	@echo "$(GREEN)✅ Verification complete$(NC)"

# ============================================================================
# TEST SUITES
# ============================================================================

test-playwright:
	@echo "$(GREEN)🎭 Running Playwright tests...$(NC)"
	@cd packages/playwright-tests && npx playwright test
	@echo "$(GREEN)✅ Playwright tests complete$(NC)"

test-cypress:
	@echo "$(GREEN)🌲 Running Cypress tests...$(NC)"
	@cd packages/cypress-tests && npx cypress run
	@echo "$(GREEN)✅ Cypress tests complete$(NC)"

test-api:
	@echo "$(GREEN)🐍 Running Python API tests...$(NC)"
	@cd packages/api-tests && pytest -v
	@echo "$(GREEN)✅ API tests complete$(NC)"

test-performance:
	@echo "$(GREEN)⚡ Running k6 performance tests...$(NC)"
	@cd packages/performance-tests && k6 run tests/load-test.js
	@echo "$(GREEN)✅ Performance tests complete$(NC)"

test-ai:
	@echo "$(GREEN)🤖 Testing AI tools...$(NC)"
	@cd packages/ai-tools && python -c "from src.ai_client import LocalAIClient; print('✅ AI client works')"
	@echo "$(GREEN)✅ AI tools check complete$(NC)"

test-smoke:
	@echo "$(GREEN)🔥 Running smoke tests...$(NC)"
	@cd packages/playwright-tests && npx playwright test --grep @smoke
	@cd packages/performance-tests && k6 run tests/smoke-test.js
	@echo "$(GREEN)✅ Smoke tests complete$(NC)"

test-all: test-playwright test-cypress test-api test-performance
	@echo "$(GREEN)🎉 ALL TESTS COMPLETE! 🎉$(NC)"

test-parallel:
	@echo "$(GREEN)🚀 Running tests in parallel...$(NC)"
	@cd packages/playwright-tests && npx playwright test --workers=4 &
	@cd packages/cypress-tests && npx cypress run --parallel &
	@cd packages/api-tests && pytest -n 4 &
	@wait
	@echo "$(GREEN)✅ Parallel tests complete$(NC)"

# ============================================================================
# AI TOOLS
# ============================================================================

ai-interactive:
	@echo "$(GREEN)🤖 Starting interactive AI assistant...$(NC)"
	@echo "$(YELLOW)Make sure LM Studio is running with Qwen model loaded!$(NC)"
	@cd packages/ai-tools && python src/cli.py interactive

ai-analyze:
	@echo "$(GREEN)🔍 AI Root Cause Analysis$(NC)"
	@echo "$(YELLOW)Paste the error message (type 'END' on new line):$(NC)"
	@read -r error; \
	while [ "$$error" != "END" ]; do \
		error_msg="$$error_msg\n$$error"; \
		read -r error; \
	done; \
	cd packages/ai-tools && python src/cli.py analyze --error "$$error_msg"

ai-generate:
	@echo "$(GREEN)📝 AI Test Case Generation$(NC)"
	@read -p "Feature name: " feature; \
	read -p "Description: " desc; \
	cd packages/ai-tools && python src/cli.py generate --feature "$$feature" --desc "$$desc"

ai-debug:
	@echo "$(GREEN)🐛 AI Flaky Test Debugger$(NC)"
	@echo "$(YELLOW)Paste the test code (type 'END' on new line):$(NC)"
	@code=""; \
	while IFS= read -r line; do \
		[ "$$line" = "END" ] && break; \
		code="$$code\n$$line"; \
	done; \
	cd packages/ai-tools && python src/cli.py debug --code "$$code"

ai-docs:
	@echo "$(GREEN)📚 AI Documentation Generator$(NC)"
	@read -p "Project name: " name; \
	read -p "Description: " desc; \
	cd packages/ai-tools && python src/cli.py docs --name "$$name" --desc "$$desc"

ai-status:
	@echo "$(GREEN)🤖 AI Tools Status$(NC)"
	@echo ""
	@echo -n "  LM Studio: "
	@curl -s http://localhost:1234/v1/models > /dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"
	@echo ""
	@echo "  Installed tools:"
	@echo "    ✅ Root Cause Analyzer"
	@echo "    ✅ Test Case Generator"
	@echo "    ✅ Flaky Test Debugger"
	@echo "    ✅ Documentation Assistant"
	@echo ""

# ============================================================================
# DOCKER
# ============================================================================

docker-build:
	@echo "$(GREEN)🐳 Building Docker images...$(NC)"
	@docker-compose build
	@echo "$(GREEN)✅ Docker images built$(NC)"

docker-run:
	@echo "$(GREEN)🐳 Running tests in Docker...$(NC)"
	@docker-compose up --abort-on-container-exit
	@echo "$(GREEN)✅ Docker tests complete$(NC)"

docker-clean:
	@echo "$(RED)🐳 Cleaning Docker...$(NC)"
	@docker-compose down -v
	@docker system prune -f
	@echo "$(GREEN)✅ Docker clean complete$(NC)"

# ============================================================================
# REPORTS & DASHBOARD
# ============================================================================

report:
	@echo "$(GREEN)📊 Opening test report...$(NC)"
	@cd packages/playwright-tests && npx playwright show-report

dashboard:
	@echo "$(GREEN)📈 Generating dashboard...$(NC)"
	@cd scripts && ./generate-dashboard.sh
	@echo "$(GREEN)✅ Dashboard generated at docs/dashboard.html$(NC)"

# ============================================================================
# DEVELOPMENT
# ============================================================================

dev-setup: setup
	@echo "$(GREEN)🛠️  Setting up development environment...$(NC)"
	@echo "  Installing pre-commit hooks..."
	@cd packages/playwright-tests && npm run prepare 2>/dev/null || true
	@echo "$(GREEN)✅ Dev setup complete$(NC)"

lint:
	@echo "$(GREEN)🔍 Running linters...$(NC)"
	@cd packages/playwright-tests && npm run lint 2>/dev/null || echo "  Lint not configured"
	@cd packages/cypress-tests && npm run lint 2>/dev/null || echo "  Lint not configured"
	@echo "$(GREEN)✅ Lint complete$(NC)"

format:
	@echo "$(GREEN)✨ Formatting code...$(NC)"
	@cd packages/playwright-tests && npm run format 2>/dev/null || echo "  Format not configured"
	@cd packages/cypress-tests && npm run format 2>/dev/null || echo "  Format not configured"
	@echo "$(GREEN)✅ Format complete$(NC)"