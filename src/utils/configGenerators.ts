import { McpServer, ClientId } from '../types/mcp';

export function generateClientConfig(
  server: McpServer,
  client: ClientId,
  userEnvValues: Record<string, string> = {}
): string {
  const specificConfig = server.installConfigs?.[client] || server.installConfigs?.claude;

  // Build the env map with user entered values or defaults/placeholders
  const envMap: Record<string, string> = {};
  if (server.envVars && server.envVars.length > 0) {
    server.envVars.forEach((v) => {
      envMap[v.name] = userEnvValues[v.name] || v.placeholder || `<YOUR_${v.name}>`;
    });
  }

  const serverConfig: any = {
    command: specificConfig?.command || 'npx',
    args: specificConfig?.args || ['-y', `@modelcontextprotocol/server-${server.id}`],
  };

  if (Object.keys(envMap).length > 0) {
    serverConfig.env = envMap;
  }

  const completeConfig = {
    mcpServers: {
      [server.id]: serverConfig,
    },
  };

  return JSON.stringify(completeConfig, null, 2);
}

export function getClientConfigFilePath(client: ClientId): { os: string; path: string }[] {
  switch (client) {
    case 'claude':
      return [
        { os: 'macOS', path: '~/Library/Application Support/Claude/claude_desktop_config.json' },
        { os: 'Windows', path: '%APPDATA%\\Claude\\claude_desktop_config.json' },
      ];
    case 'cursor':
      return [
        { os: 'macOS / Linux / Windows', path: 'Cursor Settings > Features > MCP > Add New MCP Server' },
      ];
    case 'antigravity':
      return [
        { os: 'macOS / Linux', path: '~/.gemini/config/mcp_config.json or .agents/mcp_config.json' },
        { os: 'Windows', path: '%USERPROFILE%\\.gemini\\config\\mcp_config.json' },
      ];
    case 'windsurf':
      return [
        { os: 'macOS / Linux / Windows', path: '~/.codeium/windsurf/mcp_config.json' },
      ];
    case 'cline':
      return [
        { os: 'VS Code Extension', path: 'Cline Settings > MCP Servers tab' },
      ];
    default:
      return [];
  }
}
