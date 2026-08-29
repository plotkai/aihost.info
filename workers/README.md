# aihost.info Cloudflare Worker

This worker provides backend automation for `aihost.info`:
1. **Automated GitHub PR Creation**: When developers submit an MCP via the `/submit` form, this worker generates the modular JSON file and opens a Pull Request on GitHub.
2. **Cloud Waitlist Storage**: Captures waitlist signups for the future on-demand MCP proxy bridge.

## Deployment Steps

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to your Cloudflare account:
   ```bash
   wrangler login
   ```

3. Set your GitHub Personal Access Token secret (needs `repo` permissions):
   ```bash
   wrangler secret put GITHUB_TOKEN
   ```

4. Deploy the worker:
   ```bash
   wrangler deploy
   ```

5. Once deployed, configure the worker URL inside the web app submission settings if desired, or use the default `https://aihost.info/api/...` route via Cloudflare Routes / DNS.
