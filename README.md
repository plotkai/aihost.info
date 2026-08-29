# aihost.info — Global MCP Server Registry & Directory

[![Deploy to GitHub Pages](https://github.com/plotkai/aihost.info/actions/workflows/deploy.yml/badge.svg)](https://github.com/plotkai/aihost.info/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Domain](https://img.shields.io/badge/domain-aihost.info-green)](https://aihost.info)

A fast, searchable, community-driven registry and multi-client configuration generator for **Model Context Protocol (MCP)** servers worldwide.

Hosted statically on GitHub Pages at **[aihost.info](https://aihost.info)**.

---

## 🌟 Key Features

1. **Global Registry & Search**:
   - Real-time client-side search across server names, descriptions, exposed tools, authors, and tags.
   - Multi-faceted filtering by **Category / Purpose**, **Demography & Region**, **Transport Type** (stdio, SSE, WebSocket), and **Hosting Type**.
2. **Dedicated Server Pages**:
   - Full documentation, tools/functions catalog with parameter schemas, prerequisite API tokens, and example AI prompts.
3. **1-Click Multi-Client Config Generator**:
   - Interactive configuration generator for **Claude Desktop**, **Cursor**, **Google Antigravity**, **Windsurf**, and **Cline / Roo Code**.
   - Reactive environment variable input: type your token in the UI to update the JSON snippet live.
4. **Modular Architecture**:
   - Every MCP is defined in its own standalone JSON file in `src/data/servers/<slug>.json`.
   - Adding a new server is as simple as creating a single JSON file.
5. **Community Submissions & Automation**:
   - Interactive submission form with real-time JSON preview.
   - Cloudflare Worker backend (`workers/mcp-submission-worker.ts`) to validate submissions and automatically open GitHub Pull Requests.
6. **Cloud Bridge Waitlist**:
   - Early access signup for the upcoming `aihost.info` managed on-demand cloud bridge (remote MCP execution with credit billing and secret vaults).

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated GitHub Pages deploy workflow
├── public/
│   ├── 404.html                    # Single Page App routing redirect for GitHub Pages
│   ├── CNAME                       # Custom domain (aihost.info)
│   ├── favicon.svg                 # Brand icon
│   └── .nojekyll                   # Disables Jekyll processing
├── src/
│   ├── data/
│   │   ├── servers/                # Standalone JSON config per MCP server
│   │   │   ├── github.json
│   │   │   ├── postgres.json
│   │   │   ├── brave-search.json
│   │   │   ├── supabase.json
│   │   │   └── ...
│   │   └── registry.ts             # Auto-imports all server JSONs via Vite
│   ├── types/
│   │   └── mcp.ts                  # TypeScript schemas and models
│   ├── utils/
│   │   ├── configGenerators.ts     # Multi-client JSON generator
│   │   └── search.ts               # Search and faceted filter engine
│   ├── components/
│   │   ├── Header.tsx              # Navigation, search, links
│   │   ├── Hero.tsx                # Hero banner & statistics counter
│   │   ├── FilterSidebar.tsx       # Faceted filters
│   │   ├── ServerCard.tsx          # Card with badges and quick copy
│   │   ├── ServerDetail.tsx        # Dedicated server page with config tabs
│   │   ├── SubmitForm.tsx          # Interactive submit wizard & live JSON
│   │   ├── WaitlistModal.tsx       # Cloud bridge early access modal
│   │   └── Footer.tsx              # Footer and ecosystem resources
│   ├── App.tsx                     # Main application layout and routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Tailwind styles and glassmorphism
└── workers/
    ├── mcp-submission-worker.ts    # Cloudflare Worker for PR & Waitlist automation
    ├── wrangler.toml               # Cloudflare deployment config
    └── README.md                   # Worker deployment guide
```

---

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## ➕ Adding a New MCP Server

To list a new MCP server, create a JSON file in `src/data/servers/<your-server-slug>.json`:

```json
{
  "id": "my-server",
  "name": "My MCP Server",
  "slug": "my-server",
  "shortDescription": "Brief summary of features.",
  "longDescription": "Detailed overview.",
  "category": "Developer Tools",
  "demography": {
    "region": "Global",
    "country": "United States",
    "origin": "Organization or Author"
  },
  "company": "Organization",
  "author": "author",
  "repositoryUrl": "https://github.com/org/repo",
  "license": "MIT",
  "transport": ["stdio"],
  "verified": true,
  "tags": ["tools", "api"],
  "hosting": "local",
  "envVars": [
    {
      "name": "API_KEY",
      "required": true,
      "description": "API Key from provider."
    }
  ],
  "tools": [
    {
      "name": "tool_name",
      "description": "What the tool does."
    }
  ],
  "installConfigs": {
    "claude": {
      "command": "npx",
      "args": ["-y", "my-server"]
    }
  },
  "quickstart": {
    "installSteps": [
      {
        "title": "Configure Assistant",
        "description": "Add to your MCP settings file."
      }
    ]
  },
  "aihostBridgeSupported": true,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z"
}
```

Or visit the `/submit` page directly in the app to generate the JSON interactively!

---

## ☁️ Deploying the Cloudflare Worker

See the [workers/README.md](file:///Users/plotkai/products/aihost.info/workers/README.md) guide for 1-command deployment instructions with Cloudflare Wrangler.

---

## 📄 License

MIT © [aihost.info](https://aihost.info)
