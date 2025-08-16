# PolicyMatch
<h2 align="center">
 <br>
 <img src="docs/thumbnail.png" alt="Policy Match" width="400">
 <br>
 <br>
 Policy Match: A full-stack policy compliance scanner powered by Groq that uses OCR and LLMs to extract rules from uploaded documents and check them against predefined policies.
 <br>
</h2>

https://github.com/user-attachments/assets/e93a8163-1720-4c3f-b5ea-0aa8b3f9cf76

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#architecture-&-tech-stack">Architecture & Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#customization">Customization</a> •
  <a href="#next-steps">Next Steps</a> •
  <a href="#license">License</a>
</p>

## Overview

This application automates policy reviews by extracting text from documents, parsing policies with LLMs, and highlighting compliance or violations—all in seconds. Fork, customize, and deploy as a foundation for your own compliance workflows.

## Key Features

* **OCR Extraction**
  Upload PDFs or images; Apache Tika extracts text & metadata.
* **Policy Parsing**
  LLMs identify and structure policy rules for comparison.
* **Compliance Checking**
  Compare extracted rules against stored policies; flag aligned vs. violated clauses.
* **Human-in-the-Loop Flags**
  Confidence scoring highlights low-confidence checks for review.
* **Real-time Results**
  Instant feedback on compliance percentage and specific violations.
* **Scalable Plugin Design**
  Easily swap LLM models, policy sources, or storage backends.

## Architecture & Tech Stack

**Pipeline:**

1. **Document Upload** → 2. **OCR (Apache Tika)** → 3. **Rule Extraction (Groq LLM)** → 4. **Compliance Comparison** → 5. **Result Presentation**

**Tech Stack:**

* **Backend:**

  * Go 1.20+ service (`policy-match` binary)
  * Apache Tika (OCR)
  * PostgreSQL (metadata storage)
  * Docker & Docker Compose
  * GNU Make workflows
* **Frontend:**

  * Next.js 13 (App Router)
  * Tailwind CSS & shadcn/ui components
  * Vite-powered dev server
* **Orchestration:**

  * Root Makefile for install, build, dev, test, clean
  * `docker-compose.yml` for database & OCR service

## Quick Start

### Prerequisites

* Go 1.20+
* Node.js 18+ & npm (or yarn/pnpm)
* Docker & Docker Compose
* GNU Make
* **Groq API Key** ([get yours](https://console.groq.com/keys))

> **Note:** You can install Go, Node.js, npm, or Docker Compose using the Makefile commands, it will prompt you to install what is missing.

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/build-with-groq/policy-match
   cd policy-match
   ```
2. **Install required tools**

```bash
make bootstrap
```

This will:

* Check for **Go**, **Node.js**, **npm**, **Docker**, and **Docker Compose**
* Prompt to install any missing tools interactively

3. **Copy environment files**

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

4. **Fill in variables**

* `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
LLM_MODEL=meta-llama/llama-4-maverick-17b-128e-instruct
TIKA_URL=http://localhost:9998
```

* `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

5. **Install dependencies & start services**

```bash
make setup
```

This installs backend & frontend dependencies, starts Docker Compose services, and waits for Postgres & Tika to be ready.

### Usage

1. **Start services**

   ```bash
   make dev
   ```

   * Backend on `http://localhost:8080`
   * Frontend on `http://localhost:3000`
2. **Open the app**
   Visit `http://localhost:3000`
3. **Upload Document**
   Select a file to scan and choose a policy to compare.
4. **View Results**
   See compliance percentage, highlighted violations, and any human-review flags.

## Customization

* **LLM Model:** Change `LLM_MODEL` in `backend/.env` to use a different Groq model.
* **Policy Sources:** Swap or add new policy documents in the database.
* **UI Components:** Modify or extend shadcn/ui components in `frontend/components/`.
* **Storage Backends:** Replace PostgreSQL with another datastore by updating `docker-compose.yml` and Go code.

## Next Steps

### For Developers
- **Create your free GroqCloud account:** Access official API docs, the playground for experimentation, and more resources via [Groq Console](https://console.groq.com)
- **Build and customize:** Fork this repo and start customizing to build out your own Chrome extension with AI capabilities
- **Explore Chrome Extension APIs:** Learn more about [Chrome Extension development](https://developer.chrome.com/docs/extensions/) to add advanced features
- **Get support:** Connect with other developers building on Groq, chat with our team, and submit feature requests on our [Groq Developer Forum](https://community.groq.com)

### For Founders and Business Leaders
- **See enterprise capabilities:** This template showcases production-ready AI that can handle realtime business workloads in browser extensions
- **Discuss your needs:** [Contact our team](https://groq.com/enterprise-access/) to explore how Groq can accelerate your AI initiatives and browser-based applications

---

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

---

*Developed by **Mshari Alaeena** at Groq • [LinkedIn](https://www.linkedin.com/in/malaeena/).*
