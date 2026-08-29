import React, { useState } from 'react';
import { Star, ShieldCheck, Copy, Check, Wrench, Globe, Sparkles, ChevronRight } from 'lucide-react';
import { McpServer } from '../types/mcp';
import { generateClientConfig } from '../utils/configGenerators';

interface ServerCardProps {
  server: McpServer;
  onSelect: (slug: string) => void;
  onOpenWaitlist: () => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onSelect,
  onOpenWaitlist,
}) => {
  const [copiedClient, setCopiedClient] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleCopyConfig = (e: React.MouseEvent, client: 'claude' | 'cursor' | 'antigravity') => {
    e.stopPropagation();
    const snippet = generateClientConfig(server, client);
    navigator.clipboard.writeText(snippet);
    setCopiedClient(client);
    setTimeout(() => setCopiedClient(null), 2000);
  };

  const logo = server.logoUrl || (server.icon && (server.icon.startsWith('http') || server.icon.startsWith('/')) ? server.icon : undefined);

  return (
    <div
      onClick={() => onSelect(server.slug)}
      className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Top row: Badges & Stars */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Server Avatar / Icon / Logo */}
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-400 font-mono font-bold text-base shadow-sm dark:shadow-md group-hover:border-brand-500/50 group-hover:scale-105 transition-all overflow-hidden flex-shrink-0">
              {logo && !imgError ? (
                <img
                  src={logo}
                  alt={server.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                server.name.charAt(0)
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                  {server.name}
                </h3>
                {server.verified && (
                  <span title="Verified & Tested MCP Server" className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-brand-400 fill-brand-500/20" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>{server.company || server.author}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  {server.demography.region}
                </span>
              </div>
            </div>
          </div>

          {/* Stars */}
          {server.stars !== undefined && (
            <div className="flex items-center gap-1 text-xs font-mono font-medium px-2 py-1 rounded-md bg-amber-50 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 text-amber-700 dark:text-amber-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{server.stars.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Category & Tag pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-500/20">
            {server.category}
          </span>
          {server.transport.map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {t}
            </span>
          ))}
          {server.aihostBridgeSupported && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onOpenWaitlist();
              }}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1 hover:bg-sky-500/25"
            >
              <Sparkles className="w-2.5 h-2.5" />
              Cloud Ready
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {server.shortDescription}
        </p>
      </div>

      {/* Footer Details: Tools Count & Quick Copy */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Wrench className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>{server.tools?.length || 0} tools provided</span>
        </div>

        {/* Action Button & Quick Copy */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => handleCopyConfig(e, 'claude')}
            title="Copy Claude Desktop config snippet"
            className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {copiedClient === 'claude' ? (
              <>
                <Check className="w-3 h-3 text-brand-500 dark:text-brand-400" />
                <span className="text-brand-600 dark:text-brand-400 font-sans">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Config</span>
              </>
            )}
          </button>

          <span className="p-1 rounded text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all">
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};
