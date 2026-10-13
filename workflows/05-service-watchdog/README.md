# 05 · Service watchdog

Every 5 minutes it checks over SSH that all **systemd services** of a self-hosted application are running (here, the helpdesk: web, websocket and worker processes). If they keep failing, it restarts them, checks the recovery and notifies the team.

The same pattern runs a second watchdog for the application's **Elasticsearch** (it checks that the search index answers, not only that the process is up).

## Flow

```mermaid
flowchart LR
    S[Every 5 min] --> C1[SSH check #1] --> H1{Healthy?}
    H1 -- yes --> OK[End]
    H1 -- no --> W1[Wait 60s] --> C2[SSH check #2] --> H2{Healthy?}
    H2 -- yes --> OK
    H2 -- no --> W2[Wait 60s] --> C3[SSH check #3] --> H3{Healthy?}
    H3 -- yes --> OK
    H3 -- no --> R[SSH restart] --> W3[Wait 45s] --> V[Verify up to 4×<br/>30s apart]
    V -- recovered --> E1[Email: recovered]
    V -- still failing --> E2[Email: still failing]
```

## Key design decisions

| Decision | Why |
|---|---|
| **3 consecutive failed checks before restarting** | A restart has a cost, so it only happens after a sustained failure and not after a brief glitch |
| **The scripts always `exit 0` and print `RESULT=HEALTHY/UNHEALTHY`** | The decision is made in n8n from stdout, so an SSH error is never confused with "service down" |
| **Each service is checked one by one** (`systemctl is-active`) | The alert says *which* service failed |
| **Secrets stay on the server** (the script reads an env file) | The workflow does not contain database or Elasticsearch passwords |

## Setup

- `SSH server` credential with permission to run `systemctl restart <service>`
- `SMTP` credential
- Edit the `SERVICES` list in the SSH nodes to match your application
