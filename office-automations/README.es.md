# Automatizaciones de oficina · Microsoft 365 y Google Workspace

🇬🇧 [Read in English](README.md)

Siete workflows de n8n para el trabajo diario de oficina con **Microsoft 365** y **Google Workspace**: correo, Excel y Sheets, Drive, Teams y el calendario.

> Listos para importar: conecta tus credenciales de Microsoft o Google, define las variables de entorno y actívalos.

## Los workflows

| # | Workflow | Ecosistema | Qué hace |
|---|---|---|---|
| 01 | [Facturas de Outlook → Excel](01-outlook-invoices-to-excel) | Microsoft 365 | Llega una factura en PDF por correo → la IA extrae proveedor, número, fechas e importes → **el código comprueba** que base + IVA = total → fila en una tabla de Excel → el correo se mueve a "Procesadas". Lo dudoso va a Teams para revisarlo. |
| 02 | [Resumen diario del correo → Teams](02-daily-email-digest-teams) | Microsoft 365 | Cada día laborable a las 07:30 resume los correos sin leer, los agrupa en *urgente*, *responder hoy* y *para tu información* y te lo envía por Teams. |
| 03 | [Soporte en Gmail → borrador + registro](03-gmail-support-drafts) | Google Workspace | Cada correo de soporte se clasifica (categoría, prioridad, tono) y recibe un **borrador** de respuesta en Gmail para que una persona lo revise y lo envíe. Todo queda registrado en Google Sheets. |
| 04 | [Documentos de Drive → Sheets](04-drive-documents-to-sheets) | Google Workspace | Un documento que se deja en una carpeta de Drive se identifica (factura, ticket, albarán, presupuesto, contrato), se renombra con un nombre estándar, se mueve a *Procesados* o *Revisar* y se registra en Sheets. |
| 05 | [Informe semanal de KPIs](05-weekly-kpi-report) | Google Workspace | Cada lunes lee una hoja de KPIs, **calcula en código** la variación respecto a la semana anterior y la IA redacta el comentario. El informe llega por email con una tabla en HTML. |
| 06 | [Briefings de reuniones](06-meeting-briefings) | Google Workspace | 30 minutos antes de una reunión con invitados externos, reúne el historial reciente de correos con ellos y te envía un briefing: contexto, temas abiertos y orden del día sugerido. |
| 07 | [Formulario web → CRM + bienvenida](07-form-to-crm-welcome) | Microsoft 365 | Un lead rellena un formulario de n8n → la IA analiza su necesidad y redacta un email de bienvenida personalizado → fila en un CRM en Excel → bienvenida enviada desde Outlook → los leads calientes se anuncian en Teams. |

## Diseño común

- **Salidas estructuradas.** Todas las llamadas al LLM usan la Responses API de OpenAI con un esquema JSON estricto, así que los nodos siguientes siempre reciben los campos que esperan. El modelo se define con `OPENAI_MODEL` (por defecto `gpt-5.6-luna`).
- **Las cuentas y las reglas las hace el código.** Totales, porcentajes, nombres de fichero, prioridades y validaciones se calculan en nodos Code. El modelo lee documentos y escribe texto; no decide cifras.
- **Una persona mantiene el control.** Las respuestas de soporte se guardan como borrador en Gmail y nunca se envían solas. Las facturas y los documentos dudosos van a un canal o a una carpeta de revisión.
- **Sin IDs dentro de los workflows.** Los IDs de carpetas, libros, hojas, chats y canales son variables de entorno (`$env.*`). Las credenciales se referencian por nombre.

Las variables de entorno de cada workflow están en el [README en inglés](README.md#environment-variables).

> Necesitan `N8N_BLOCK_ENV_ACCESS_IN_NODE=false`, para que los workflows puedan leer `$env`. El `docker-compose.yml` del repo ya lo configura.

## Cómo se han validado

| Comprobación | Resultado |
|---|---|
| Importarlos en n8n y abrirlas en el editor | Los 7 cargan con **0 avisos** |
| Lógica de los nodos Code, ejecutada con datos de ejemplo | **23 comprobaciones correctas**: la suma de la factura, el nombre de los ficheros, los cálculos de KPIs, que cada reunión se avise una sola vez, la puntuación de leads… |
| La petición real a OpenAI de cada workflow, enviada con datos de ejemplo | Las 7 peticiones aceptadas en modo esquema JSON estricto, con resultados correctos: importes leídos de "1,028.50", ningún total inventado, una petición de reembolso marcada como `needs_human` |
