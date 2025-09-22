.PHONY: help all setup init-env prompt-groq-key check-env build-backend build-frontend build dev test clean \
        bootstrap deps ensure-go ensure-node ensure-npm ensure-docker ensure-compose compose-up compose-down compose-logs wait-services doctor

ENV_FILE     ?= backend/.env
ENV_EXAMPLE  ?= backend/.env.example

.DEFAULT_GOAL := help
SHELL := /bin/bash

COMPOSE := $(shell if docker compose version >/dev/null 2>&1; then echo "docker compose"; \
              elif command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo "no"; fi)
COMPOSE_PROJECT ?= policy-match
COMPOSE_SEARCH_DIRS ?= . backend frontend
COMPOSE_FILENAMES  ?= docker-compose.yml docker-compose.yaml compose.yml compose.yaml
WAIT_TIMEOUT ?= 90

.ONESHELL:

# OS detection
IS_DARWIN  := $(shell [ "$$(uname -s)" = "Darwin" ] && echo 1 || echo 0)
IS_DEBIAN  := $(shell [ -f /etc/os-release ] && grep -qiE 'debian|ubuntu' /etc/os-release && echo 1 || echo 0)

# Helper: ensure a dependency exists, otherwise prompt to install
# Usage: $(call ensure_dep,Human Name,cmd,brew_pkg,apt_pkg)
define ensure_dep
	@if ! command -v $(2) >/dev/null 2>&1; then \
		read -p "⚠️  $(1) is not installed. Install now? [y/N] " ans; \
		if [[ $$ans =~ ^[Yy]$$ ]]; then \
			if [ "$(IS_DARWIN)" = "1" ]; then \
				if ! command -v brew >/dev/null 2>&1; then \
					echo "Homebrew is required to install $(1)."; \
					read -p "Install Homebrew now? [y/N] " hb; \
					if [[ $$hb =~ ^[Yy]$$ ]]; then \
						/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
						echo "Restart your shell if brew isn't in PATH."; \
					else \
						echo "Cannot install $(1) without Homebrew. Aborting."; exit 1; \
					fi; \
				fi; \
				echo "→ Installing $(1) with Homebrew…"; \
				brew install $(3); \
			elif [ "$(IS_DEBIAN)" = "1" ]; then \
				echo "→ Installing $(1) with apt…"; \
				sudo apt-get update && sudo apt-get install -y $(4); \
			else \
				echo "Unsupported OS. Please install $(1) manually."; exit 1; \
			fi; \
		else \
			echo "Skipped installing $(1)."; exit 1; \
		fi; \
	else \
		echo "✓ $(1) found: $$(command -v $(2))"; \
	fi
endef

## ──────────────────────────────────────────────────────────────────────────────
## Help
## ──────────────────────────────────────────────────────────────────────────────
help: ## Show this help
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | sed -e 's/:.*##/:/' -e 's/##//' \
	  | awk 'BEGIN {FS = ":"} {printf "  %-18s %s\n", $$1, $$2}'
	@echo ""

## ──────────────────────────────────────────────────────────────────────────────
## Setup & Dependencies
## ──────────────────────────────────────────────────────────────────────────────
bootstrap: ensure-go ensure-node ensure-npm ensure-docker ensure-compose ## Interactively install required deps
deps: bootstrap ## Alias for bootstrap

ensure-go:
	$(call ensure_dep,Go,go,go,golang-go)

ensure-node:
	$(call ensure_dep,Node.js,node,node,nodejs)

ensure-npm:
	$(call ensure_dep,npm,npm,npm,npm)

ensure-docker:
	@if ! command -v docker >/dev/null 2>&1; then \
		read -p "⚠️  Docker is not installed. Install now? [y/N] " ans; \
		if [[ $$ans =~ ^[Yy]$$ ]]; then \
			if [ "$(IS_DARWIN)" = "1" ]; then \
				echo "On macOS, please install Docker Desktop from docker.com (GUI app)."; exit 1; \
			elif [ "$(IS_DEBIAN)" = "1" ]; then \
				echo "→ Installing Docker (apt)…"; \
				sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin; \
				sudo usermod -aG docker $$USER || true; \
				echo "You may need to log out/in for docker group changes to apply."; \
			else \
				echo "Unsupported OS. Please install Docker manually."; exit 1; \
			fi; \
		else \
			echo "Skipped installing Docker."; exit 1; \
		fi; \
	else \
		echo "✓ Docker found: $$(command -v docker)"; \
	fi

ensure-compose:
	@if docker compose version >/dev/null 2>&1; then \
		echo "✓ Docker Compose plugin found"; \
	elif command -v docker-compose >/dev/null 2>&1; then \
		echo "✓ Legacy docker-compose found"; \
	else \
		read -p "⚠️  Docker Compose not found. Install now? [y/N] " ans; \
		if [[ $$ans =~ ^[Yy]$$ ]]; then \
			if [ "$(IS_DARWIN)" = "1" ]; then \
				if ! command -v brew >/dev/null 2>&1; then \
					echo "Homebrew is required to install Docker Compose."; \
					read -p "Install Homebrew now? [y/N] " hb; \
					if [[ $$hb =~ ^[Yy]$$ ]]; then \
						/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
						echo "Restart your shell if brew isn't in PATH."; \
					else \
						echo "Cannot install Docker Compose without Homebrew. Aborting."; exit 1; \
					fi; \
				fi; \
				echo "→ Installing Docker Compose with Homebrew…"; \
				brew install docker-compose; \
			elif [ "$(IS_DEBIAN)" = "1" ]; then \
				echo "→ Installing Docker Compose (apt)…"; \
				sudo apt-get update && sudo apt-get install -y docker-compose-plugin; \
			else \
				echo "Unsupported OS. Please install Docker Compose manually."; exit 1; \
			fi; \
		else \
			echo "Skipped installing Docker Compose."; exit 1; \
		fi; \
	fi

compose-up: ## Start services and wait for health=healthy
	@if [ "$(COMPOSE)" = "no" ]; then echo "Docker Compose not found. Install it first."; exit 1; fi
	@found=""; found_dir=""; \
	for d in $(COMPOSE_SEARCH_DIRS); do \
	  for f in $(COMPOSE_FILENAMES); do \
	    if [ -f "$$d/$$f" ]; then found="$$d/$$f"; found_dir="$$d"; break; fi; \
	  done; \
	  [ -n "$$found" ] && break; \
	  echo "ℹ️  No compose file in $$d"; \
	done; \
	[ -z "$$found" ] && { echo "✗ No docker-compose file found in: $(COMPOSE_SEARCH_DIRS)"; exit 1; }; \
	file=$$(basename "$$found"); \
	echo "→ Starting services with $(COMPOSE) in $$found_dir using $$file…"; \
	( cd "$$found_dir" && $(COMPOSE) -p $(COMPOSE_PROJECT) -f "$$file" up -d --wait --wait-timeout $(WAIT_TIMEOUT) )

wait-services: ## Wait for Postgres & Tika to be ready (uses COMPOSE_DIR/COMPOSE_FILE_NAME)
	@bash -eo pipefail <<-'BASH'
		# Values injected by make
		COMPOSE_CMD="$(COMPOSE)"
		PROJECT="$(COMPOSE_PROJECT)"
		TIMEOUT="$(WAIT_TIMEOUT)"
		ENV_FILE_PATH="${ENV_FILE_PATH:-$(ENV_FILE)}"
		DIR="$(COMPOSE_DIR)"
		FILE="$(COMPOSE_FILE_NAME)"
		[ -z "$$DIR" ] && DIR="."
		[ -z "$$FILE" ] && FILE="docker-compose.yml"

		echo "→ Waiting for services in $$DIR (timeout $${TIMEOUT}s)…"
		start=$$(date +%s)

		# Helper to run "docker compose" or "docker-compose" (handles the space in the v2 subcommand)
		compose() { (cd "$$DIR" && eval "$$COMPOSE_CMD -p \"$$PROJECT\" -f \"$$FILE\" \"$$@\""); }

		# Detect DB service
		db_service=$$(compose ps --services 2>/dev/null | grep -E '^(db|postgres|postgresql)(-[0-9]+)?$$' || true)

		# Tika URL from env (fallback)
		tika_line=$$(grep -m1 -E '^TIKA_URL=' "$$ENV_FILE_PATH" 2>/dev/null || true)
		tika_url=$${tika_line#TIKA_URL=}
		[ -z "$$tika_url" ] && tika_url="http://localhost:9998"
		tika_version_url="$${tika_url%/}/version"

		wait_db() {
		  while :; do
		    if [ -n "$$db_service" ] && compose ps "$$db_service" >/dev/null 2>&1; then
		      if compose exec -T "$$db_service" sh -c 'command -v pg_isready >/dev/null && pg_isready -q' >/dev/null 2>&1; then
		        echo "✓ Postgres is ready (pg_isready)"; return 0
		      fi
		    fi
		    db_host_line=$$(grep -m1 -E '^DB_HOST=' "$$ENV_FILE_PATH" 2>/dev/null || true)
			db_host=$${db_host_line#DB_HOST=}; [ -z "$$db_host" ] && db_host=localhost
			db_port_line=$$(grep -m1 -E '^DB_PORT=' "$$ENV_FILE_PATH" 2>/dev/null || true)
			db_port=$${db_port_line#DB_PORT=}; [ -z "$$db_port" ] && db_port=5432
		    (exec 3<>/dev/tcp/"$$db_host"/"$$db_port") >/dev/null 2>&1 && { echo "✓ Postgres TCP $$db_host:$$db_port open"; return 0; }
		    now=$$(date +%s); [ $$((now-start)) -ge "$$TIMEOUT" ] && { echo "✗ Timed out waiting for Postgres"; return 1; }
		    sleep 2
		  done
		}

		wait_tika() {
		  while :; do
		    curl -sSf "$$tika_version_url" >/dev/null 2>&1 && { echo "✓ Tika is ready ($$tika_version_url)"; return 0; }
		    now=$$(date +%s); [ $$((now-start)) -ge "$$TIMEOUT" ] && { echo "✗ Timed out waiting for Tika at $$tika_version_url"; return 1; }
		    sleep 2
		  done
		}

		rc=0; wait_db || rc=1; wait_tika || rc=1; exit $$rc
	BASH

compose-down: ## Stop and remove services
	@if [ "$(COMPOSE)" = "no" ]; then echo "Docker Compose not found."; exit 1; fi
	@$(COMPOSE) -p $(COMPOSE_PROJECT) down

compose-logs: ## Follow compose logs
	@if [ "$(COMPOSE)" = "no" ]; then echo "Docker Compose not found."; exit 1; fi
	@$(COMPOSE) -p $(COMPOSE_PROJECT) logs -f

init-env:
	@if [ ! -f "$(ENV_FILE)" ]; then \
		if [ ! -f "$(ENV_EXAMPLE)" ]; then \
			echo "Template $(ENV_EXAMPLE) not found."; exit 1; \
		fi; \
		cp "$(ENV_EXAMPLE)" "$(ENV_FILE)"; \
		echo "Created $(ENV_FILE) from template."; \
	fi
	@$(MAKE) prompt-groq-key
	@$(MAKE) check-env

prompt-groq-key:
	@if grep -q "GROQ_API_KEY=CHANGEME" "$(ENV_FILE)" 2>/dev/null; then \
		echo ""; \
		echo "🔑 GROQ API Key Setup"; \
		echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"; \
		echo "You need a Groq API key to use this application."; \
		echo "Get yours free at: https://console.groq.com/keys"; \
		echo ""; \
		while true; do \
			read -p "Please enter your Groq API key: " groq_key; \
			if [ -n "$$groq_key" ] && [ "$$groq_key" != "CHANGEME" ]; then \
				if echo "$$groq_key" | grep -qE '^gsk_[a-zA-Z0-9_-]+$$'; then \
					sed -i.bak "s/GROQ_API_KEY=CHANGEME/GROQ_API_KEY=$$groq_key/" "$(ENV_FILE)" && rm -f "$(ENV_FILE).bak"; \
					echo "✓ API key saved successfully!"; \
					break; \
				else \
					echo "⚠️  That doesn't look like a valid Groq API key (should start with 'gsk_')"; \
					echo "   Please try again or press Ctrl+C to exit."; \
				fi; \
			else \
				echo "⚠️  Please enter a valid API key or press Ctrl+C to exit."; \
			fi; \
		done; \
		echo ""; \
	fi

check-env:
	@set -e; \
	if [ ! -f "$(ENV_FILE)" ]; then \
		echo "Missing $(ENV_FILE). Run 'make init-env'."; exit 1; \
	fi; \
	missing=0; \
	for v in GROQ_API_KEY DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME TIKA_URL; do \
	  val=$$(grep -E "^$$v=" "$(ENV_FILE)" | cut -d= -f2- || true); \
	  if [ -z "$$val" ] || echo "$$val" | grep -q '^CHANGEME'; then \
	    echo "✗ $$v is missing/CHANGEME (set it in $(ENV_FILE))"; missing=1; \
	  else \
	    echo "✓ $$v set"; \
	  fi; \
	done; \
	if [ $$missing -eq 1 ]; then echo "Fix the above and re-run."; exit 1; fi

setup: bootstrap init-env ## Install deps and start docker-compose
	@echo "→ Setting up backend…"
	@cd backend && make install || (echo "No backend install; running 'go mod tidy'"; cd backend && go mod tidy)
	@echo "→ Setting up frontend…"
	@cd frontend && make setup  || (echo "No frontend setup; running 'npm ci'"; cd frontend && npm ci)
	@$(MAKE) compose-up

## ──────────────────────────────────────────────────────────────────────────────
## Build
## ──────────────────────────────────────────────────────────────────────────────
build-backend: ## build the Go backend binary
	@echo "→ Building backend…"
	@cd backend && make build

build-frontend: ## build the Next.js frontend
	@echo "→ Building frontend…"
	@cd frontend && make build

build: build-backend build-frontend ## build both services

## ──────────────────────────────────────────────────────────────────────────────
## Development
## ──────────────────────────────────────────────────────────────────────────────
dev-backend: ## run backend in dev mode
	@echo "→ Starting backend dev…"
	@cd backend && make dev

dev-frontend: ## run frontend in dev mode
	@echo "→ Starting frontend dev…"
	@cd frontend && make dev

dev: ## start backend & frontend concurrently
	@echo "→ Starting backend & frontend in parallel…"
	@$(MAKE) dev-backend &    # backend in background
	@$(MAKE) dev-frontend &   # frontend in background
	@wait

## ──────────────────────────────────────────────────────────────────────────────
## Test
## ──────────────────────────────────────────────────────────────────────────────
test-backend: ## run backend tests
	@echo "→ Testing backend…"
	@cd backend && make test

test-frontend: ## run frontend tests
	@echo "→ Testing frontend…"
	@cd frontend && make test

test: test-backend test-frontend ## run all tests

## ──────────────────────────────────────────────────────────────────────────────
## Clean
## ──────────────────────────────────────────────────────────────────────────────
clean-backend: ## clean backend artifacts
	@echo "→ Cleaning backend…"
	@cd backend && make clean

clean-frontend: ## clean frontend artifacts
	@echo "→ Cleaning frontend…"
	@cd frontend && make clean

clean: clean-backend clean-frontend ## clean both services

## ──────────────────────────────────────────────────────────────────────────────
## Diagnostics
## ──────────────────────────────────────────────────────────────────────────────
doctor: ## Print tool versions
	@echo "Go:     $$(go version 2>/dev/null || echo 'not found')"
	@echo "Node:   $$(node -v 2>/dev/null || echo 'not found')"
	@echo "npm:    $$(npm -v 2>/dev/null || echo 'not found')"
	@echo "Docker: $$(docker --version 2>/dev/null || echo 'not found')"
	@echo "Compose:$$(docker compose version 2>/dev/null || docker-compose -v 2>/dev/null || echo 'not found')"
