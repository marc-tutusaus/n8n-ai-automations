# n8n AI Automations

🇪🇸 [Leer en español](README.es.md)

![n8n](https://img.shields.io/badge/n8n-workflows-EA4B71?logo=n8n&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Responses_API-412991?logo=openai&logoColor=white)
![Retell AI](https://img.shields.io/badge/Voice_AI-Retell-1f6feb)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker&logoColor=white)

**n8n workflows I designed, built and ran in production** at an IT services company. They connect a helpdesk, billing, CMS, servers and AI phone agents with LLMs.

> 🔒 **Anonymized.** These are exports of real workflows. Company and client names, hosts, emails, IDs, tokens and credentials were removed. Endpoints are now environment variables and credentials are referenced by name only. The logic and error handling are the ones that ran in production. Some prompts were translated to English and generalized (for example, team names).

## Workflows

| # | Workflow | Area | What it does |
|---|---|---|---|
| 01 | [**LLM ticket triage**](workflows/01-llm-ticket-triage) | 🤖 Applied AI | Classifies every new ticket (team, type, priority, confidence) with **Structured Outputs**, writes an internal note with a suggested fix and customer reply, logs to Excel, alerts the dev team on Teams |
| 02 | [**Ticket auto-invoicing**](workflows/02-ticket-auto-invoicing) | ⚙️ Business process | Billable ticket → validated delivery note in the billing system → result note → ticket set to pending close |
| 03 | [**AI content pipeline**](workflows/03-ai-content-pipeline) | 🤖 Generative AI | Multi-client: Notion brief → SEO article (JSON) → translations → AI image with logo overlay → WordPress drafts linked with WPML/Polylang → scheduled → status back to Notion. **54 nodes** |
| 04 | [**Self-healing VPS**](workflows/04-self-healing-vps) | 🛠️ Ops | Uptime alert → confirm outage → SSH reboot of the right server → verify → notify, with bounded retry loops |
| 05 | [**Service watchdog**](workflows/05-service-watchdog) | 🛠️ Ops | Checks systemd services every 5 min, restarts after sustained failure, verifies recovery |
| 06 | [**Voice agent: business hours**](workflows/06-voice-agent-business-hours) | 📞 Voice AI | Gives the AI phone agent real-time context: open/closed, holidays (including Easter-based), DST-safe local time |
| 07 | [**Voice agent: lead capture**](workflows/07-voice-agent-lead-capture) | 📞 Voice AI | Post-call LLM analysis → quality filters → lead email ranked by interest |

Each folder contains `workflow.json` (importable), a `README.md` with the flow diagram and design decisions, and a sample payload.

## How I build workflows

- **The AI suggests, a human decides.** LLM output goes to internal notes and drafts. Nothing reaches a customer unreviewed.
- **Structured outputs.** JSON schemas with `enum`s matching the target system, plus parse fallbacks.
- **Fail visibly.** Errors are written back where people work (ticket note, Notion status, email), not only in the n8n execution log.
- **Bounded loops.** Every retry has a counter and a limit.
- **No secrets in workflows.** Credentials live in the n8n credential store and endpoints in environment variables.

## Run locally

```bash
cp .env.example .env
docker compose up -d
```

Open http://localhost:5678 → **Workflows → Import from file** → choose any `workflows/*/workflow.json`, then link your credentials.
