import React from 'react';
import { Sparkles, Terminal, ShieldCheck, Database, Wrench, Cloud, Search, ArrowRight } from 'lucide-react';
import { getStats } from '../data/registry';

interface HeroProps {
  onSelectCategory: (category: string) => void;
  selectedCategories: string[];
  onOpenWaitlist: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  selectedCategories,
  onOpenWaitlist,
}) => {
  const stats = getStats();

  const quickPills = [
    { name: 'Developer Tools', icon: Wrench },
    { name: 'Databases & SQL', icon: Database },
    { name: 'Cloud & DevOps', icon: Cloud },
    { name: 'Search & Knowledge', icon: Search },
    { name: 'AI & Machine Learning', icon: Sparkles },
  ];

  return (
    <div className="relative overflow-hidden pt-10 pb-8 border-b border-slate-200 dark:border-slate-800/60">
      {/* Background glow flares */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-brand-500/10 via-sky-500/15 to-indigo-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 mb-6 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-400 animate-ping" />
          <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">Model Context Protocol</span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span>Global Server Registry & Configurator</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Supercharge your AI with the <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 dark:from-brand-400 dark:via-sky-400 dark:to-indigo-400">
            Universal MCP Directory
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Search hundreds of community and enterprise MCP servers. Generate 1-click configs for{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-medium">Claude Desktop</strong>,{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-medium">Cursor</strong>,{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-medium">Google Antigravity</strong>, and{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-medium">Windsurf</strong>.
        </p>

        {/* Quick category pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <span className="text-xs text-slate-500 mr-2 font-mono uppercase tracking-wider">
            Popular:
          </span>
          {quickPills.map((pill) => {
            const Icon = pill.icon;
            const isSelected = selectedCategories.includes(pill.name);
            return (
              <button
                key={pill.name}
                onClick={() => onSelectCategory(pill.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/50 shadow-sm shadow-brand-500/20'
                    : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pill.name}</span>
              </button>
            );
          })}
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="glass-panel p-3.5 rounded-xl text-center">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{stats.totalServers}+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Servers Indexed</div>
          </div>
          <div className="glass-panel p-3.5 rounded-xl text-center">
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">{stats.totalTools}+</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tools & Functions</div>
          </div>
          <div className="glass-panel p-3.5 rounded-xl text-center">
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">{stats.verifiedCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Verified & Tested</div>
          </div>
          <div 
            onClick={onOpenWaitlist}
            className="glass-panel p-3.5 rounded-xl text-center cursor-pointer hover:border-sky-500/50 transition-colors group"
          >
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-300 font-mono flex items-center justify-center gap-1">
              <span>Cloud</span>
              <ArrowRight className="w-4 h-4 text-sky-500 dark:text-sky-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">aihost Managed Proxy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
