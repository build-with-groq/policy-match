# PolicyMatch Backend

A Go-based API service that powers **PolicyMatch**, automating document ingestion, policy rule extraction, and compliance checking using OCR and Groq LLMs.

---

## Overview

The backend service accepts uploaded documents or images, extracts text via Apache Tika, uses Groq LLMs to parse and structure policy rules, then compares those rules against stored policies in PostgreSQL—flagging compliance results and human-review cases in real time.

---

## Key Features

* **Document Ingestion**
  Supports PDF, DOCX, TXT, and image uploads for OCR processing.
* **OCR Extraction**
  Integrates Apache Tika to extract text and metadata from diverse file types.
* **Policy Parsing & Rule Extraction**
  Uses Groq LLMs (e.g., `meta-llama/llama-4-maverick-17b-128e-instruct`) to identify and structure rules.
* **Compliance Engine**
  Compares extracted rules against PostgreSQL-stored policies; highlights aligned vs. violated clauses and computes confidence scores.
* **Human-in-the-Loop Flags**
  Flags low-confidence or ambiguous checks for manual review.
* **Plugin-Ready Design**
  Easily swap LLM models, policy sources, or storage backends with minimal code changes.

---

## Architecture & Tech Stack

```
[Client Upload] → [API Server (Go/Gin)] → [Apache Tika OCR]
                               ↘ [Groq LLM Parsing]
                               ↘ [PostgreSQL Compliance Check]
→ [JSON Result with Compliance Percentage & Flags]
```

* **Language & Framework:** Go 1.20+ with Gin router
* **OCR:** Apache Tika (via Docker Compose)
* **LLM API:** Groq chat completion
* **Database:** PostgreSQL for policy storage and results
* **Configuration:** Viper (env, file)
* **Build & CI:** GNU Make, Docker, GitHub Actions (optional)

---

## Quick Start

### Prerequisites

* Go 1.20 or higher
* Docker & Docker Compose
* GNU Make
* Groq API key (create at [https://console.groq.com](https://console.groq.com))

### 1. Clone the repo

```bash
git clone https://github.com/build-with-groq/policy-match
cd backend
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env, set your GROQ_API_KEY, LLM_MODEL, TIKA_URL, and PostgreSQL creds:
# GROQ_API_KEY=...
# LLM_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
# TIKA_URL=http://localhost:9998
# DB_HOST=...
# DB_PORT=5432
# DB_USER=...
# DB_PASSWORD=...
# DB_NAME=policymatch
# ORIGIN=https://your-subdomain.groqlabs.com  # Required for production deployment
```

### 3. Start dependencies

```bash
docker-compose up -d
```

This runs:

* PostgreSQL on `localhost:5432`
* Apache Tika on `localhost:9998`

### 4. Build & Run

```bash
make build   # compiles `policy-match` binary
make run     # starts API server on http://localhost:8080
# or `make dev` for live-reload in dev mode
```

Open [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health) to verify status.

---

## Customization

* **Swap LLM Models:** Update `LLM_MODEL` in `.env` to another Groq-supported model.
* **Add Policy Sources:** Insert new policies into PostgreSQL or extend repository layer.
* **Alternative OCR:** Replace Tika client in `internal/client/` with another OCR service.
* **Storage Backends:** Plug in MongoDB or another database by implementing the repository interface.

---

## Next Steps

* **Batch Processing:** Support multi-document or bulk scans.
* **Audit Logs:** Add request/response logging for compliance audits.
* **Metrics & Monitoring:** Integrate Prometheus and Grafana dashboards.
* **Authentication:** Secure endpoints with JWT or OAuth2.
* **CI/CD:** Automate builds and deployments with GitHub Actions or Jenkins.

---

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.

---

*Developed by **Mshari Alaeena** at Groq • [LinkedIn](https://www.linkedin.com/in/malaeena/).*
