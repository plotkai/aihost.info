/**
 * Cloudflare Worker for aihost.info
 * Handles:
 * 1. POST /api/submit-mcp -> Creates a GitHub Pull Request with the new server JSON
 * 2. POST /api/waitlist -> Stores waitlist submissions in Cloudflare KV / D1
 */

export interface Env {
  GITHUB_TOKEN?: string; // Personal Access Token with repo scope
  GITHUB_REPO_OWNER?: string; // e.g. "plotkai"
  GITHUB_REPO_NAME?: string; // e.g. "aihost.info"
  WAITLIST_KV?: KVNamespace; // Optional Cloudflare KV binding
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    // Endpoint: Submit MCP Server (Raises PR)
    if (url.pathname === '/api/submit-mcp' && request.method === 'POST') {
      try {
        const body = await request.json() as any;

        if (!body.name || !body.slug || !body.category || !body.repositoryUrl) {
          return new Response(JSON.stringify({ error: 'Missing required fields (name, slug, category, repositoryUrl)' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        // Clean slug
        const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const fileName = `src/data/servers/${slug}.json`;

        // Construct standardized McpServer JSON
        const serverJson = {
          id: slug,
          name: body.name,
          slug: slug,
          shortDescription: body.shortDescription || '',
          longDescription: body.longDescription || body.shortDescription || '',
          category: body.category,
          demography: {
            region: body.region || 'Global',
            country: body.country || 'Global',
            origin: body.company || body.author || 'Community',
          },
          company: body.company || body.author || 'Community',
          author: body.author || 'Community',
          authorUrl: body.authorUrl || '',
          repositoryUrl: body.repositoryUrl,
          homepageUrl: body.homepageUrl || body.repositoryUrl,
          license: body.license || 'MIT',
          transport: body.transport || ['stdio'],
          verified: false,
          stars: 0,
          tags: body.tags || [],
          logoUrl: body.logoUrl || undefined,
          hosting: body.hosting || 'local',
          envVars: body.envVars || [],
          tools: body.tools || [],
          installConfigs: {
            claude: {
              command: body.command || 'npx',
              args: body.args || ['-y', slug],
            },
            cursor: {
              command: body.command || 'npx',
              args: body.args || ['-y', slug],
            },
            antigravity: {
              command: body.command || 'npx',
              args: body.args || ['-y', slug],
            },
          },
          quickstart: {
            prerequisites: ['Node.js 18+'],
            installSteps: [
              {
                title: 'Add to Configuration',
                description: `Configure ${body.name} in your MCP client settings.`,
              },
            ],
          },
          aihostBridgeSupported: body.hosting === 'cloud' || body.transport?.includes('sse'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const fileContent = JSON.stringify(serverJson, null, 2);

        // If GitHub token is configured in environment, raise PR automatically
        if (env.GITHUB_TOKEN && env.GITHUB_REPO_OWNER && env.GITHUB_REPO_NAME) {
          const owner = env.GITHUB_REPO_OWNER;
          const repo = env.GITHUB_REPO_NAME;
          const branchName = `submit-${slug}-${Date.now()}`;

          // 1. Get default branch ref (main)
          const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
            headers: {
              'User-Agent': 'aihost-worker',
              'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
            },
          });
          const refData = await refRes.json() as any;
          const baseSha = refData.object?.sha;

          if (!baseSha) {
            throw new Error('Could not fetch main branch SHA from GitHub API');
          }

          // 2. Create submission branch
          await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
            method: 'POST',
            headers: {
              'User-Agent': 'aihost-worker',
              'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ref: `refs/heads/${branchName}`,
              sha: baseSha,
            }),
          });

          // 3. Create file in branch
          await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
              'User-Agent': 'aihost-worker',
              'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Add ${body.name} to MCP registry`,
              content: btoa(unescape(encodeURIComponent(fileContent))),
              branch: branchName,
            }),
          });

          // 4. Create Pull Request
          const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            method: 'POST',
            headers: {
              'User-Agent': 'aihost-worker',
              'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: `Listing: ${body.name} (${body.category})`,
              head: branchName,
              base: 'main',
              body: `### New MCP Server Submission\n\n- **Name:** ${body.name}\n- **Category:** ${body.category}\n- **Repository:** ${body.repositoryUrl}\n- **Submitter:** ${body.submitterEmail || 'Community'}\n- **Notes:** ${body.notes || 'None'}\n\nAutomated submission via aihost.info.`,
            }),
          });
          const prData = await prRes.json() as any;

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Pull request created successfully!',
              prUrl: prData.html_url,
              fileName,
              serverJson,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
            }
          );
        }

        // If no GitHub token, return validated JSON payload for manual PR
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Submission validated! Download or copy the generated JSON file.',
            fileName,
            serverJson,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    // Endpoint: Join Waitlist
    if (url.pathname === '/api/waitlist' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        if (!body.email || !body.email.includes('@')) {
          return new Response(JSON.stringify({ error: 'Valid email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }

        const waitlistEntry = {
          email: body.email,
          assistant: body.assistant || 'Not specified',
          requestedServers: body.requestedServers || '',
          userType: body.userType || 'developer',
          notes: body.notes || '',
          timestamp: new Date().toISOString(),
        };

        // Save to KV if available
        if (env.WAITLIST_KV) {
          await env.WAITLIST_KV.put(`waitlist:${body.email}`, JSON.stringify(waitlistEntry));
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'You have been added to the aihost.info cloud waitlist!',
            data: waitlistEntry,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          }
        );
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }
    }

    return new Response(
      JSON.stringify({ status: 'aihost.info worker active', endpoints: ['/api/submit-mcp', '/api/waitlist'] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      }
    );
  },
};
