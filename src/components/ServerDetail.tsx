import React, { useState } from 'react';
import { 
  ArrowLeft, Star, ShieldCheck, Github, Globe, Terminal, Wrench, Key, 
  Copy, Check, Sparkles, ExternalLink, BookOpen, MessageSquareCode 
} from 'lucide-react';
import { McpServer, ClientId } from '../types/mcp';
import { generateClientConfig, getClientConfigFilePath } from '../utils/configGenerators';

interface ServerDetailProps {
  server: McpServer;
  onBack: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenWaitlist: () => void;
}

export const ServerDetail: React.FC<ServerDetailProps> = ({
  server,
  onBack,
  onSelectCategory,
  onOpenWaitlist,
}) => {
  const [selectedClient, setSelectedClient] = useState<ClientId>('claude');
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [envInputs, setEnvInputs] = useState<Record<string, string>>({});

  const handleEnvChange = (name: string, value: string) => {
    setEnvInputs((prev) => ({ ...prev, [name]: value }));
  };

  const clientConfig = generateClientConfig(server, selectedClient, envInputs);
  const filePaths = getClientConfigFilePath(selectedClient);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const clients: { id: ClientId; name: string }[] = [
    { id: 'claude', name: 'Claude Desktop' },
    { id: 'cursor', name: 'Cursor' },
    { id: 'antigravity', name: 'Google Antigravity' },
    { id: 'windsurf', name: 'Windsurf' },
    { id: 'cline', name: 'Cline / Roo Code' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs & Back */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registry</span>
        </button>
        <span>/</span>
        <button
          onClick={() => onSelectCategory(server.category)}
          className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium"
        >
          {server.category}
        </button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{server.name}</span>
      </div>

      {/* Hero Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Avatar Icon */}
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-400 font-mono font-bold text-2xl shadow-sm dark:shadow-xl flex-shrink-0">
              {server.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {server.name}
                </h1>
                {server.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-400 border border-brand-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Server
                  </span>
                )}
                {server.aihostBridgeSupported && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                    <Sparkles className="w-3 h-3" />
                    aihost Cloud Supported
                  </span>
                )}
              </div>

              {/* Author, Region, License */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span>By <strong className="text-slate-800 dark:text-slate-200">{server.company || server.author}</strong></span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {server.demography.region} {server.demography.country ? `(${server.demography.country})` : ''}
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>License: <strong className="text-slate-700 dark:text-slate-300">{server.license}</strong></span>
                {server.stars !== undefined && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-300 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {server.stars.toLocaleString()} GitHub stars
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mt-4 max-w-3xl leading-relaxed">
                {server.longDescription || server.shortDescription}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {server.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-row md:flex-col gap-2.5 flex-shrink-0">
            {server.repositoryUrl && (
              <a
                href={server.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                <Github className="w-4 h-4" />
                <span>View Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </a>
            )}

            <button
              onClick={onOpenWaitlist}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500/15 to-indigo-500/15 hover:from-sky-500/25 hover:to-indigo-500/25 border border-sky-500/40 text-sm font-semibold text-sky-700 dark:text-sky-200 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span>Run in aihost Cloud</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Config Generator & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multi-Client Config Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Client Configuration Generator</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">1-Click Config</span>
            </div>

            {/* Client Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800/80 mb-5">
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`flex-1 min-w-[100px] text-xs font-semibold py-2 px-3 rounded-lg transition-all text-center ${
                    selectedClient === client.id
                      ? 'bg-brand-500 text-slate-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-900'
                  }`}
                >
                  {client.name}
                </button>
              ))}
            </div>

            {/* Live Environment Variable Fill-in */}
            {server.envVars && server.envVars.length > 0 && (
              <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Key className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Configure Environment Variables (Live Updates Config):</span>
                </div>
                {server.envVars.map((v) => (
                  <div key={v.name} className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                      <span>{v.name} {v.required && <strong className="text-amber-500 dark:text-amber-400">*</strong>}</span>
                      <span className="text-[10px] text-slate-500">{v.description}</span>
                    </label>
                    <input
                      type="text"
                      placeholder={v.placeholder || `Enter ${v.name}`}
                      value={envInputs[v.name] || ''}
                      onChange={(e) => handleEnvChange(v.name, e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-lg text-xs font-mono text-brand-700 dark:text-brand-300 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Generated Code Block */}
            <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 shadow-inner">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 dark:bg-slate-900/90 border-b border-slate-700 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-slate-300 dark:text-slate-400 ml-2">
                    {selectedClient === 'claude' ? 'claude_desktop_config.json' : 'mcp_config.json'}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(clientConfig)}
                  className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-md bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 transition-colors"
                >
                  {copiedConfig ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Config</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-100 dark:text-slate-200 overflow-x-auto leading-relaxed">
                <code>{clientConfig}</code>
              </pre>
            </div>

            {/* File Path Guide */}
            {filePaths.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-400 mb-1.5">
                  Target Config File Location:
                </div>
                <div className="space-y-1">
                  {filePaths.map((fp, i) => (
                    <div key={i} className="text-[11px] font-mono text-slate-800 dark:text-slate-300 flex items-start gap-2">
                      <span className="text-slate-500 font-sans min-w-[70px]">{fp.os}:</span>
                      <code className="text-brand-700 dark:text-brand-300/90 break-all">{fp.path}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quickstart & Documentation Guide */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quickstart & Installation</h2>
            </div>

            {server.quickstart.prerequisites && server.quickstart.prerequisites.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Prerequisites:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 pl-1">
                  {server.quickstart.prerequisites.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4 pt-2">
              {server.quickstart.installSteps.map((step, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-mono text-[10px] flex items-center justify-center border border-slate-300 dark:border-slate-700">
                      {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  {step.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 pl-7">{step.description}</p>
                  )}
                  {step.code && (
                    <div className="ml-7 relative rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-3 text-xs font-mono text-slate-100 dark:text-slate-200 overflow-x-auto">
                      <code>{step.code}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tools Explorer & AI Prompts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tools & Endpoints */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tools & Endpoints</h2>
              </div>
              <span className="text-xs font-mono bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {server.tools?.length || 0} tools
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {server.tools && server.tools.length > 0 ? (
                server.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 space-y-1.5 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-300">
                        {tool.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {tool.description}
                    </p>
                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
                        <div className="text-[10px] font-mono text-slate-500 mb-1">Parameters:</div>
                        <div className="flex flex-wrap gap-1">
                          {tool.parameters.map((param, pIdx) => (
                            <span
                              key={pIdx}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                              title={param.description}
                            >
                              {param.name}: <span className="text-indigo-600 dark:text-indigo-400">{param.type}</span>
                              {param.required && <span className="text-amber-500 dark:text-amber-400">*</span>}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">No specific tools cataloged.</p>
              )}
            </div>
          </div>

          {/* Example AI Prompts */}
          {server.quickstart.examples && server.quickstart.examples.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquareCode className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Try in Your Assistant</h2>
              </div>
              <div className="space-y-3">
                {server.quickstart.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2"
                  >
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-300">{ex.title}</div>
                    <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-800 dark:text-slate-200 font-mono italic">
                      "{ex.prompt}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* aihost.info Cloud Bridge CTA Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-100 via-sky-50 to-white dark:from-indigo-950/40 dark:via-sky-950/30 dark:to-slate-900 border border-sky-300 dark:border-sky-500/30 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>aihost.info Cloud Bridge</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Run this MCP in the Cloud on Demand
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              No need to run local Node/Docker runtimes or expose local ports. `aihost.info` provides managed cloud execution, automated auth, and usage credits.
            </p>
            <button
              onClick={onOpenWaitlist}
              className="w-full py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-sky-500/20"
            >
              Join the Cloud Bridge Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
