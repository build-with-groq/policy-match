include .env
export

BINARY=policy-match
CMD_DIR=./cmd

.PHONY: all build run install test clean

all: build

build:
	go build -o $(BINARY) $(CMD_DIR)

run: build
	@echo "Starting server (with .env)..."
	@./$(BINARY)

install:
	@echo "→ Backend: fetching Go modules…"
	@go mod tidy

dev:
	@echo "Running in dev mode (with .env)..."
	@env $$(grep -v '^#' .env | xargs) go run $(CMD_DIR)

test:
	go test ./internal/... ./cmd/...

clean:
	rm -f $(BINARY)
