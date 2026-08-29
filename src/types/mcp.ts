export type CategoryType =
  | 'Developer Tools'
  | 'Databases & SQL'
  | 'Cloud & DevOps'
  | 'AI & Machine Learning'
  | 'Web & Scraping'
  | 'Communication & Productivity'
  | 'Search & Knowledge'
  | 'Security & Auth'
  | 'Finance & Crypto'
  | 'Utilities';

export type TransportType = 'stdio' | 'sse' | 'websocket';

export type RegionType = 'Global' | 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America';

export type HostingType = 'local' | 'cloud' | 'hybrid';

export type ClientId = 'claude' | 'cursor' | 'antigravity' | 'windsurf' | 'cline';

export interface EnvVarDefinition {
  name: string;
  required: boolean;
  description: string;
  placeholder?: string;
  default?: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required?: boolean;
    description?: string;
  }>;
}

export interface ResourceDefinition {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface PromptDefinition {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface ClientConfigSnippet {
  command: string;
  args: string[];
  env?: Record<string, string>;
  serverUrl?: string;
}

export interface QuickstartStep {
  title: string;
  code?: string;
  language?: string;
  description?: string;
}

export interface UsageExample {
  title: string;
  prompt: string;
  expectedToolCall?: string;
}

export interface McpServer {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: CategoryType;
  demography: {
    region: RegionType;
    country?: string;
    origin?: string;
  };
  company: string;
  author: string;
  authorUrl?: string;
  repositoryUrl: string;
  homepageUrl?: string;
  license: string;
  transport: TransportType[];
  verified: boolean;
  featured?: boolean;
  stars?: number;
  tags: string[];
  icon?: string;
  logoUrl?: string;
  hosting: HostingType;
  envVars: EnvVarDefinition[];
  tools: ToolDefinition[];
  resources?: ResourceDefinition[];
  prompts?: PromptDefinition[];
  installConfigs: {
    claude?: ClientConfigSnippet;
    cursor?: ClientConfigSnippet;
    antigravity?: ClientConfigSnippet;
    windsurf?: ClientConfigSnippet;
    cline?: ClientConfigSnippet;
  };
  quickstart: {
    prerequisites?: string[];
    installSteps: QuickstartStep[];
    examples?: UsageExample[];
  };
  aihostBridgeSupported?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedRegions: string[];
  selectedTransports: string[];
  selectedHostings: string[];
  verifiedOnly: boolean;
  sortBy: 'stars' | 'name' | 'newest' | 'tools';
}

export interface SubmissionPayload {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: CategoryType;
  region: RegionType;
  company: string;
  author: string;
  repositoryUrl: string;
  homepageUrl?: string;
  license: string;
  transport: TransportType[];
  hosting: HostingType;
  tags: string[];
  command: string;
  args: string[];
  envVars: EnvVarDefinition[];
  tools: ToolDefinition[];
  logoUrl?: string;
  submitterEmail?: string;
  notes?: string;
}

export interface WaitlistPayload {
  email: string;
  assistant: string;
  requestedServers: string;
  userType: 'developer' | 'enterprise' | 'creator' | 'hobbyist';
  notes?: string;
}
