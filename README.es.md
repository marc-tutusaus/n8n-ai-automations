# n8n AI Automations

🇬🇧 [Read in English](README.md)

![n8n](https://img.shields.io/badge/n8n-workflows-EA4B71?logo=n8n&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-Responses_API-412991?logo=openai&logoColor=white)
![Retell AI](https://img.shields.io/badge/Voice_AI-Retell-1f6feb)
![Docker](https://img.shields.io/badge/Docker-compose-2496ED?logo=docker&logoColor=white)

**Workflows de n8n que diseñé, construí y mantuve en producción** en una empresa de servicios IT. Conectan con LLMs un helpdesk, la facturación, un CMS, servidores y agentes telefónicos con IA.

> 🔒 **Anonimizados.** Son exportaciones de workflows reales. He eliminado los nombres de la empresa y de los clientes, los hosts, los emails, los IDs, los tokens y las credenciales. Los endpoints ahora son variables de entorno y las credenciales solo se referencian por nombre. La lógica y la gestión de errores son las que funcionaron en producción. Algunos prompts los he traducido al inglés y generalizado (por ejemplo, los nombres de los equipos).

## Workflows de producción

| # | Workflow | Área | Qué hace |
|---|---|---|---|
| 01 | [**Triaje de tickets con LLM**](workflows/01-llm-ticket-triage) | 🤖 IA aplicada | Clasifica cada ticket nuevo (equipo, tipo, prioridad, confianza) con **Structured Outputs**. Escribe una nota interna con la solución sugerida y una respuesta para el cliente, lo registra en Excel y avisa al equipo de desarrollo por Teams |
| 02 | [**Facturación automática de tickets**](workflows/02-ticket-auto-invoicing) | ⚙️ Proceso de negocio | Ticket facturable → albarán validado en el sistema de facturación → nota con el resultado → ticket a "pendiente de cierre" |
| 03 | [**Pipeline de contenido con IA**](workflows/03-ai-content-pipeline) | 🤖 IA generativa | Multicliente: encargo en Notion → artículo SEO (JSON) → traducciones → imagen con IA y logo superpuesto → borradores en WordPress enlazados con WPML/Polylang → programación → estado de vuelta en Notion. **54 nodos** |
| 04 | [**VPS que se recupera solo**](workflows/04-self-healing-vps) | 🛠️ Operaciones | Alerta de caída → confirmación → reinicio por SSH del servidor correcto → verificación → aviso, con reintentos limitados |
| 05 | [**Vigilante de servicios**](workflows/05-service-watchdog) | 🛠️ Operaciones | Comprueba servicios systemd cada 5 minutos, los reinicia si el fallo persiste y verifica la recuperación |
| 06 | [**Agente de voz: horario**](workflows/06-voice-agent-business-hours) | 📞 IA de voz | Da al agente telefónico contexto en tiempo real: abierto/cerrado, festivos (también los que dependen de Semana Santa) y hora local correcta con el cambio de horario |
| 07 | [**Agente de voz: captación de leads**](workflows/07-voice-agent-lead-capture) | 📞 IA de voz | Análisis de la llamada con LLM → filtros de calidad → email con el lead clasificado por nivel de interés |

Cada carpeta contiene el `workflow.json` (importable), un `README.md` con el diagrama y las decisiones de diseño (en inglés) y un payload de ejemplo.

## Automatizaciones de oficina · Microsoft 365 y Google Workspace

Siete workflows más para el trabajo diario de oficina: correo, Excel y Sheets, Drive, Teams y el calendario. → **[office-automations/](office-automations/README.es.md)**

| # | Workflow | Ecosistema |
|---|---|---|
| 01 | [Facturas de Outlook → Excel, con los totales comprobados en código](office-automations/01-outlook-invoices-to-excel) | Microsoft 365 |
| 02 | [Resumen diario del correo → Teams](office-automations/02-daily-email-digest-teams) | Microsoft 365 |
| 03 | [Soporte en Gmail → borradores de respuesta con IA + registro](office-automations/03-gmail-support-drafts) | Google Workspace |
| 04 | [Documentos de Drive → clasificados, renombrados y registrados en Sheets](office-automations/04-drive-documents-to-sheets) | Google Workspace |
| 05 | [Informe semanal de KPIs desde Sheets](office-automations/05-weekly-kpi-report) | Google Workspace |
| 06 | [Briefings de reuniones con Calendar y el historial de Gmail](office-automations/06-meeting-briefings) | Google Workspace |
| 07 | [Formulario web → CRM en Excel + bienvenida desde Outlook + aviso en Teams](office-automations/07-form-to-crm-welcome) | Microsoft 365 |

## Cómo construyo los workflows

- **La IA sugiere y una persona decide.** Las respuestas a clientes y todo lo que compromete a la empresa van a notas internas y borradores para que una persona los revise. El único email que la IA envía directamente es la bienvenida a leads (07), y su prompt prohíbe hablar de precios o hacer promesas.
- **Salidas estructuradas.** Esquemas JSON con `enum`s que coinciden con los valores del sistema de destino, y alternativas por si la respuesta no se puede interpretar.
- **Los errores se ven.** Se escriben donde trabaja la gente (nota en el ticket, estado en Notion, email), no solo en el log de ejecuciones de n8n.
- **Bucles limitados.** Cada reintento tiene un contador y un límite.
- **Sin secretos en los workflows.** Las credenciales están en el gestor de credenciales de n8n y los endpoints en variables de entorno.

## Probarlo en local

```bash
cp .env.example .env
docker compose up -d
```

Abre http://localhost:5678 → **Workflows → Import from file** → elige cualquier `workflows/*/workflow.json` u `office-automations/*/workflow.json` y asigna tus credenciales. El docker-compose usa n8n 2.43.5.

## Validación automática

[`scripts/validate-workflows.js`](scripts/validate-workflows.js) se ejecuta en GitHub Actions con cada cambio. Comprueba que las conexiones apuntan a nodos que existen, que las referencias entre nodos se resuelven y que el código JavaScript de los nodos Code es válido. También **detecta secretos** que se hayan colado: claves de API, tokens, URLs firmadas o emails reales.
