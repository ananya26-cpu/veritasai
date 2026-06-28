# VeritasAI — KYC Anomaly Detection & Compliance Monitoring System

![Status](https://img.shields.io/badge/status-active-00FF41)
![Stack](https://img.shields.io/badge/stack-Python%20%7C%20FastAPI%20%7C%20Next.js%20%7C%20Gemini-blue)

## Overview

VeritasAI is an AI-powered KYC anomaly detection and compliance monitoring system built to simulate the kind of privacy risk oversight infrastructure used by global financial institutions like American Express.

Inspired by the $230M DOJ fine against AmEx for deficient recordkeeping and dummy EIN usage in small business onboarding — VeritasAI automates exactly the validation layer that failed.

---

## The Problem It Solves

In 2025, American Express paid $230 million to settle DOJ charges that included:
- Sales representatives entering dummy EINs (e.g. `123456788`) for business accounts
- Misrepresenting income and financial data during onboarding
- Deficient recordkeeping across small business credit card applications

VeritasAI detects all of these anomalies automatically at the point of data entry.

---

## Features

- **KYC Validation Engine** — flags dummy EINs, missing fields, income anomalies, unrecognized card types
- **Risk Scorer** — assigns HIGH / MEDIUM / LOW risk per record
- **AI Explanation Layer** — Gemini API explains each flag in plain English for non-technical reviewers
- **Audit Log** — every analyzed record stored with timestamp, flags, and risk score
- **Compliance Dashboard** — real-time summary of total records, high risk count, flag rate
- **Terminal UI** — dark, monospace interface built for compliance analysts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLite, SQLAlchemy |
| AI Layer | Google Gemini API |
| Frontend | Next.js, Tailwind CSS |
| Deployment | Render (backend), Vercel (frontend) |
| Repo | GitHub |

---

## Project Structure
