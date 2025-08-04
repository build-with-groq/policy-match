# PolicyMatch Backend

This directory contains the backend service for PolicyMatch—a Go-based API that powers OCR extraction, policy parsing, and compliance checking.

## 🚀 Features

- **Document Ingestion**  
  Accepts PDF, DOCX, TXT, and image uploads; forwards to Apache Tika for text & metadata extraction.

- **Policy Parsing & Rule Extraction**  
  Sends raw text to Groq LLMs (e.g. `meta-llama/llama-4-maverick-17b-128e-instruct`) to identify and structure policy rules.

- **Compliance Engine**  
  Compares extracted rules to saved policy documents in PostgreSQL, flags aligned vs. violated clauses, and computes confidence scores.

- **Plugin-Ready Design**  
  Easily swap or extend LLM models, policy sources, and storage backends.

## 📂 Structure

```
backend/
├── cmd/                # Entrypoints
│   └── main/           # Application bootstrap
│   └── server/         # HTTP router & server config
├── internal/           # Application code
│   ├── client/         # External service clients (Tika, database)
│   ├── config/         # Configuration loading & validation
│   ├── dto/            # Data transfer objects
│   ├── handler/        # HTTP handlers & routing
│   ├── locales/        # i18n support
│   ├── log/            # Logging setup
│   ├── middleware/     # HTTP middleware (CORS, auth)
│   ├── repository/     # Persistence layer (PostgreSQL)
│   ├── service/        # Business logic
│   └── utils/          # Shared utilities
├── Makefile            # Build, run, and clean targets
├── docker-compose.yml  # PostgreSQL & Tika
├── .env.example        # Environment variable template
└── go.mod              # Module dependencies
```

## ⚙️ Prerequisites

* Go 1.20+
* Docker & Docker Compose (for PostgreSQL & Tika)
* GNU Make
* A valid **GROQ\_API\_KEY** (get one at [https://console.groq.com](https://console.groq.com))

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
GROQ_API_KEY=your_groq_api_key
LLM_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
TIKA_URL=http://localhost:9998
DB_HOST=your_psql_db_host
DB_PORT=your_psql_db_port
DB_USER=your_psql_db_username
DB_PASSWORD=your_psql_db_password
DB_NAME=your_psql_db_name
```

## 🛠️ Make Targets

* **`make setup`**: Installs Go dependencies
* **`make build`**: Compiles the `policy-match` binary
* **`make run`**: Runs the service locally (requires `.env`)
* **`make test`**: Executes unit and integration tests
* **`make clean`**: Removes binaries and caches

## 🐳 Docker

Start supporting services:

```bash
cd backend
docker-compose up -d
```

This brings up:

* **PostgreSQL** on `localhost:5432`
* **Apache Tika** on `localhost:9998`

## 🏃 Development

1. Ensure Docker services are running.
2. Set up `.env`.
3. Start the API:

   ```bash
   make run
   ```

By default, the server listens on `http://localhost:8080`.

## 📦 Production Build

Build the optimized binary and docker image:

```bash
make build
docker build -t policy-match:latest .
```

---

*Developed by **Mshari Alaeena** at Groq.*
