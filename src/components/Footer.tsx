import React from 'react';
import { Cpu, Github, ExternalLink, Sparkles } from 'lucide-react';
import { categories } from '../data/registry';

interface FooterProps {
  onNavigate: (route: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenWaitlist: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectCategory,
  onOpenWaitlist,
}) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060910] text-slate-600 dark:text-slate-400 text-xs py-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div 
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-sky-500 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-brand-400" />
                </div>
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                aihost<span className="text-brand-600 dark:text-brand-400">.info</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The global index and 1-click configuration generator for Model Context Protocol (MCP) servers.
            </p>
            <div className="pt-1">
              <a
                href="https://github.com/plotkai/aihost.info"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase font-mono tracking-wider text-[11px] mb-3">
              Explore Categories
            </h4>
            <ul className="space-y-1.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('/');
                    }}
                    className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation & Community */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase font-mono tracking-wider text-[11px] mb-3">
              Ecosystem & Tools
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('/submit')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  Submit an MCP Server
                </button>
              </li>
              <li>
                <button onClick={onOpenWaitlist} className="hover:text-sky-600 dark:hover:text-sky-300 transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                  <span>aihost Cloud Bridge (Waitlist)</span>
                </button>
              </li>
              <li>
                <a
                  href="https://modelcontextprotocol.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Official MCP Specification</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/modelcontextprotocol/servers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Anthropic MCP Reference Servers</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Vision */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 uppercase font-mono tracking-wider text-[11px] mb-3">
              Cloud Bridge Roadmap
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Coming soon: on-demand hosted execution. Execute remote MCP servers without local Docker/Node setups and manage authorization with simple API credits.
            </p>
            <button
              onClick={onOpenWaitlist}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-colors"
            >
              Get Early Access →
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-slate-700 dark:text-slate-400">aihost.info</strong> — Open MCP Server Directory.
          </div>
          <div className="flex items-center gap-1">
            Built for AI assistant builders worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
};
