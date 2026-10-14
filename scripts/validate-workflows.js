// Validates every workflows/*/workflow.json and office-automations/*/workflow.json:
//  - connections point to existing nodes
//  - $('Node') / $node["Node"] references resolve
//  - Code node JavaScript parses
//  - no secrets, real emails or credential IDs slipped in (anonymization guard)
const fs = require("fs");
const path = require("path");

const roots = ["workflows", "office-automations"].map((d) => path.join(__dirname, "..", d));
const SECRET_PATTERNS = [
  [/sk-[A-Za-z0-9_-]{16,}/, "API key"],
  [/Token token=/i, "hard-coded token header"],
  [/Bearer [A-Za-z0-9._-]{16,}/, "hard-coded bearer token"],
  [/[?&]sig=[A-Za-z0-9%_-]{10,}/, "signed URL"],
  [/[\w.+-]+@(?!example\.com\b)[\w-]+\.[a-z]{2,}/i, "email address outside example.com"],
];

let failures = 0;
for (const [root, dir] of roots.flatMap((r) => fs.readdirSync(r).sort().map((d) => [r, d]))) {
  const file = path.join(root, dir, "workflow.json");
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const wf = JSON.parse(raw);
  const names = new Set(wf.nodes.map((n) => n.name));
  const problems = [];

  for (const [src, outputs] of Object.entries(wf.connections)) {
    if (!names.has(src)) problems.push(`connection from unknown node "${src}"`);
    for (const branch of Object.values(outputs).flat()) {
      for (const c of branch || []) if (!names.has(c.node)) problems.push(`connection to unknown node "${c.node}"`);
    }
  }
  for (const m of raw.matchAll(/\$(?:node\[|\()\\?["']([^"'\\]+)\\?["']/g)) {
    if (!names.has(m[1])) problems.push(`reference to unknown node "${m[1]}"`);
  }
  for (const n of wf.nodes) {
    const code = n.parameters && n.parameters.jsCode;
    if (!code) continue;
    try {
      new Function("items", "$input", "$json", "$node", "$", "$execution", "$runIndex", `return (async () => {${code}\n})`);
    } catch (e) {
      problems.push(`syntax error in "${n.name}": ${e.message}`);
    }
    for (const cred of Object.values(n.credentials || {})) {
      if (cred.id) problems.push(`credential id left in "${n.name}"`);
    }
  }
  for (const [re, label] of SECRET_PATTERNS) if (re.test(raw)) problems.push(`possible ${label}`);

  failures += problems.length;
  console.log(`${problems.length ? "FAIL" : "ok  "} ${path.basename(root)}/${dir} (${wf.nodes.length} nodes)`);
  for (const p of problems) console.log(`     - ${p}`);
}
process.exit(failures ? 1 : 0);
