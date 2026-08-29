import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Sparkles, Github, Menu, X, Cpu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  currentRoute: string;
  onOpenWaitlist: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentRoute,
  onOpenWaitlist,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('aihost_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'dark'; // default dark
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('aihost_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/85 dark:bg-[#080c14]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-500 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] dark:bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-300 transition-colors">
                  aihost<span className="text-brand-500 dark:text-brand-400">.info</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Global Model Context Protocol Directory
              </p>
            </div>
          </div>

          {/* Search bar inside header if not on home hero */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search MCP servers, tools, tags, companies..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentRoute !== '/') onNavigate('/');
                }}
                className="w-full pl-10 pr-12 py-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/50 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                /
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="hidden md:flex items-center gap-2.5">

            <button
              onClick={onOpenWaitlist}
              className="group relative flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-300 hover:border-sky-400 hover:text-sky-700 dark:hover:text-white transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 group-hover:rotate-12 transition-transform" />
              <span>Cloud Bridge</span>
              <span className="text-[9px] bg-sky-500/20 text-sky-600 dark:text-sky-300 px-1 py-0.2 rounded font-mono">
                WAITLIST
              </span>
            </button>

            <button
              onClick={() => onNavigate('/submit')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-medium transition-all shadow-md shadow-brand-500/20 hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Server</span>
            </button>

            {/* Dark / Light Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-all"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            <a
              href="https://github.com/plotkai/aihost.info"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile hamburger & theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-300 dark:border-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={onOpenWaitlist}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30"
            >
              Cloud Bridge
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-2">
            <input
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (currentRoute !== '/') onNavigate('/');
              }}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500"
            />
            <button
              onClick={() => {
                onNavigate('/');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Directory Registry
            </button>
            <button
              onClick={() => {
                onNavigate('/submit');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10"
            >
              + Submit an MCP Server
            </button>
            <button
              onClick={() => {
                onOpenWaitlist();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-sky-600 dark:text-sky-300 hover:bg-sky-500/10"
            >
              Join Cloud Bridge Waitlist
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
