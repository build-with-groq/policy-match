# PolicyMatch

A full-stack **policy compliance scanner** powered by **Groq** that uses OCR and LLMs to extract rules from uploaded documents and check them against predefined policies.

<img src="https://console.groq.com/powered-by-groq.svg" alt="Powered by Groq" width="150"/>

## 🚀 Project Overview

* **Backend**

  * Go service (`policy-match` binary)
  * Entrypoint in `cmd/`
  * Business logic in `internal/`
  * Makefile for build, test, run, and dev workflows
  * Docker Compose for PostgreSQL & Apache Tika

* **Frontend**

  * Next.js 13 application
  * Tailwind CSS + shadcn/ui components
  * Makefile for setup, dev, build, lint, test, and Docker workflows

* **Orchestration**

  * Root Makefile to install, build, develop, test, and clean both services in one place

## 🛠️ Features

* **OCR Extraction**
  – Upload documents; Apache Tika extracts text & metadata
* **Policy Parsing**
  – LLMs identify policy rules and structure them for comparison
* **Compliance Checking**
  – Compare extracted rules against stored policy documents
  – Highlight aligned vs. violated clauses
* **Human Intervention Flags**
  – Confidence scoring; flag low-confidence checks for review
* **Scalable Architecture**
  – Plugin-ready design for adding new LLM models, policy sources, or storage backends

## 📁 Repo Layout

```
/
├── backend/                # Go server
│   ├── cmd/                # entrypoints (e.g. server)
│   ├── internal/           # application logic & handlers
│   ├── Makefile            # build, run, test, clean
│   ├── docker-compose.yml  # PostgreSQL & Tika services
│   └── .env.example        # required env vars
├── frontend/               # Next.js app
│   ├── app/                # Next.js App Router
│   ├── components/         # UI components
│   ├── public/             # static assets
│   ├── styles/             # global styles
│   ├── Makefile            # setup, dev, build, test, clean
│   └── .env.local.example  # client env vars
├── Makefile                # orchestrate install, build, dev, test, clean
└── README.md               # this file
```

## ⚙️ Prerequisites

* Go 1.20+
* Node.js 18+ & npm (or yarn/pnpm)
* **Groq API Key** (free at [console.groq.com](https://console.groq.com))
* Docker & Docker Compose (for database & OCR)
* GNU Make

## 💾 Environment Variables

1. **Backend**
   Copy `backend/.env.example` → `backend/.env` and fill in your keys:

   ```env
   # example
   GROQ_API_KEY=your_groq_api_key
   LLM_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
   TIKA_URL=http://localhost:9998
   ```
2. **Frontend**
   Copy `frontend/.env.local.example` → `frontend/.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

> **Note:** Frontend env files only contain public URLs—no secrets.

## 🔧 Setup

From the root folder, install everything:

```bash
make setup
```

This will:

1. Install and build the Go backend
2. Install Node dependencies and create `.env.local` in the frontend

## 🏃‍♂️ Development

Run both services in parallel:

```bash
make dev
```

* **Backend** on port `8080`
* **Frontend** on port `3000`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Build & Release

Build both services:

```bash
make build
```

Artifacts:

* `backend/policy-match` (Go binary)
* `frontend/.next/` (Next.js production bundle)

## 🧹 Clean

Remove build artifacts and caches:

```bash
make clean
```

## 🐳 Docker

Start database and OCR service:

```bash
cd backend
docker-compose up -d
```

Alternatively, build and run the entire stack via Docker Compose if configured.

## 🎯 Useful Make Targets

```bash
make setup           # Install deps for both services
make build           # Compile backend and build frontend
make dev             # Run both in dev mode
make test            # Run all tests
make clean           # Clean both services
```

Dive into each subfolder for more specialized targets (`make backend.build`, `make frontend.dev`, etc.).

---

Developed by **Mshari Alaeena** at Groq.
