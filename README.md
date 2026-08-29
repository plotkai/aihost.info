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

To list a new MCP server in the registry, create a standalone JSON file under `src/data/servers/<slug>.json`:

### Complete JSON Schema Reference

```json
{
  "id": "my-mcp-server",
  "name": "My MCP Server",
  "slug": "my-mcp-server",
  "shortDescription": "High-performance MCP server for interacting with service X.",
  "longDescription": "Detailed overview of features, supported operations, architecture, and assistant workflows.",
  "category": "Developer Tools",
  "demography": {
    "region": "Global",
    "country": "International",
    "origin": "Organization or Author Name"
  },
  "company": "Organization Name",
  "author": "author_github_handle",
  "authorUrl": "https://github.com/author_github_handle",
  "repositoryUrl": "https://github.com/org/mcp-server-repo",
  "homepageUrl": "https://example.com/product",
  "license": "MIT",
  "transport": ["stdio", "sse"],
  "verified": true,
  "featured": false,
  "stars": 1500,
  "tags": ["tools", "api", "database", "ai"],
  "icon": "database",
  "logoUrl": "https://cdn.simpleicons.org/postgresql",
  "hosting": "local",
  "envVars": [
    {
      "name": "API_KEY",
      "required": true,
      "description": "Your API authorization secret key.",
      "placeholder": "sk_live_...",
      "default": ""
    },
    {
      "name": "API_ENDPOINT",
      "required": false,
      "description": "Optional custom API gateway URL.",
      "placeholder": "https://api.example.com/v1"
    }
  ],
  "tools": [
    {
      "name": "query_resource",
      "description": "Search and retrieve records by keyword filter.",
      "parameters": [
        {
          "name": "query",
          "type": "string",
          "required": true,
          "description": "Search query or natural language phrase."
        },
        {
          "name": "limit",
          "type": "number",
          "required": false,
          "description": "Max results to return (default: 10)."
        }
      ]
    },
    {
      "name": "create_item",
      "description": "Create a new entity in the remote system.",
      "parameters": [
        {
          "name": "title",
          "type": "string",
          "required": true,
          "description": "Title of the item."
        },
        {
          "name": "metadata",
          "type": "object",
          "required": false,
          "description": "Arbitrary key-value metadata pairs."
        }
      ]
    }
  ],
  "resources": [
    {
      "uri": "service://workspace/current",
      "name": "Active Workspace Context",
      "description": "Live workspace schema and status.",
      "mimeType": "application/json"
    }
  ],
  "prompts": [
    {
      "name": "debug_connection",
      "description": "Guided prompt to inspect server health and permissions.",
      "arguments": [
        {
          "name": "verbose",
          "description": "Include trace diagnostics",
          "required": false
        }
      ]
    }
  ],
  "installConfigs": {
    "claude": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    },
    "cursor": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    },
    "antigravity": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    },
    "windsurf": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    },
    "cline": {
      "command": "npx",
      "args": ["-y", "@org/mcp-server"],
      "env": {
        "API_KEY": "YOUR_API_KEY"
      }
    }
  },
  "quickstart": {
    "prerequisites": [
      "Node.js 18+ or Docker runtime",
      "Valid API credentials"
    ],
    "installSteps": [
      {
        "title": "Install and Test Locally",
        "description": "Verify your credentials using the CLI binary.",
        "code": "npx -y @org/mcp-server --test",
        "language": "bash"
      },
      {
        "title": "Configure Assistant Settings",
        "description": "Paste the generated configuration JSON into your assistant's MCP config file."
      }
    ],
    "examples": [
      {
        "title": "Query records in assistant",
        "prompt": "Find all open tickets created in the last 7 days and summarize their priorities."
      }
    ]
  },
  "aihostBridgeSupported": true,
  "createdAt": "2026-01-15T00:00:00Z",
  "updatedAt": "2026-02-20T00:00:00Z"
}
```

### Supported Enums

| Field | Allowed Values |
|---|---|
| **`category`** | `'Developer Tools'`, `'Databases & SQL'`, `'Cloud & DevOps'`, `'AI & Machine Learning'`, `'Web & Scraping'`, `'Communication & Productivity'`, `'Search & Knowledge'`, `'Security & Auth'`, `'Finance & Crypto'`, `'Utilities'` |
| **`demography.region`** | `'Global'`, `'North America'`, `'Europe'`, `'Asia-Pacific'`, `'Latin America'` |
| **`transport`** | `'stdio'`, `'sse'`, `'websocket'` |
| **`hosting`** | `'local'`, `'cloud'`, `'hybrid'` |

You can also visit the [**/submit**](https://aihost.info/submit) page in the app to build, validate, and preview your JSON schema interactively!

---

## ☁️ Deploying the Cloudflare Worker

See the [workers/README.md](file:///Users/plotkai/products/aihost.info/workers/README.md) guide for 1-command deployment instructions with Cloudflare Wrangler.

---

## 📄 License

MIT © [aihost.info](https://aihost.info)
