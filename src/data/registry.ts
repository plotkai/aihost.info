import { McpServer, CategoryType, RegionType, TransportType, HostingType } from '../types/mcp';

// Automatically import all JSON files from the servers directory
const serverFiles = import.meta.glob<McpServer>('../data/servers/*.json', { eager: true });

// Collect and sort all servers
export const allServers: McpServer[] = Object.values(serverFiles).map((file: any) => {
  return (file.default || file) as McpServer;
}).sort((a, b) => (b.stars || 0) - (a.stars || 0));

export const categories: CategoryType[] = [
  'Developer Tools',
  'Databases & SQL',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Web & Scraping',
  'Communication & Productivity',
  'Search & Knowledge',
  'Security & Auth',
  'Finance & Crypto',
  'Utilities',
];

export const regions: RegionType[] = [
  'Global',
  'North America',
  'Europe',
  'Asia-Pacific',
  'Latin America',
];

export const transports: { id: TransportType; label: string; description: string }[] = [
  { id: 'stdio', label: 'Local (stdio)', description: 'Direct process execution on local machine' },
  { id: 'sse', label: 'Remote (SSE)', description: 'Server-Sent Events streaming over HTTP/HTTPS' },
  { id: 'websocket', label: 'WebSocket', description: 'Bi-directional real-time socket connection' },
];

export const hostings: { id: HostingType; label: string }[] = [
  { id: 'local', label: 'Local Runtime' },
  { id: 'cloud', label: 'Cloud Managed' },
  { id: 'hybrid', label: 'Hybrid' },
];

export function getServerBySlug(slug: string): McpServer | undefined {
  return allServers.find((server) => server.slug === slug || server.id === slug);
}

export function getFeaturedServers(): McpServer[] {
  return allServers.filter((s) => s.featured);
}

export function getStats() {
  const totalServers = allServers.length;
  const verifiedCount = allServers.filter((s) => s.verified).length;
  const totalTools = allServers.reduce((acc, s) => acc + (s.tools?.length || 0), 0);
  const cloudReady = allServers.filter((s) => s.aihostBridgeSupported).length;

  return {
    totalServers,
    verifiedCount,
    totalTools,
    cloudReady,
  };
}
