import React from 'react';
import { Filter, Check, RotateCcw, Globe, Terminal, Shield } from 'lucide-react';
import { FilterState } from '../types/mcp';
import { categories, regions, transports } from '../data/registry';

interface FilterSidebarProps {
  filter: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalMatches: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filter,
  onChange,
  onReset,
  totalMatches,
}) => {
  const toggleCategory = (cat: string) => {
    const exists = filter.selectedCategories.includes(cat);
    const updated = exists
      ? filter.selectedCategories.filter((c) => c !== cat)
      : [...filter.selectedCategories, cat];
    onChange({ selectedCategories: updated });
  };

  const toggleRegion = (reg: string) => {
    const exists = filter.selectedRegions.includes(reg);
    const updated = exists
      ? filter.selectedRegions.filter((r) => r !== reg)
      : [...filter.selectedRegions, reg];
    onChange({ selectedRegions: updated });
  };

  const toggleTransport = (t: string) => {
    const exists = filter.selectedTransports.includes(t);
    const updated = exists
      ? filter.selectedTransports.filter((item) => item !== t)
      : [...filter.selectedTransports, t];
    onChange({ selectedTransports: updated });
  };

  const isFiltered =
    filter.selectedCategories.length > 0 ||
    filter.selectedRegions.length > 0 ||
    filter.selectedTransports.length > 0 ||
    filter.selectedHostings.length > 0 ||
    filter.verifiedOnly ||
    filter.searchQuery.length > 0;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Filters</span>
          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            {totalMatches}
          </span>
        </div>
        {isFiltered && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Verified Filter */}
      <div className="glass-panel p-3 rounded-xl">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Verified Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={filter.verifiedOnly}
            onChange={(e) => onChange({ verifiedOnly: e.target.checked })}
            className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-brand-500 focus:ring-brand-500/50 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {/* Categories / Purpose */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 font-semibold">
          Category & Purpose
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isChecked = filter.selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                  isChecked
                    ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 font-medium border border-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{cat}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Demography & Region */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Globe className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Demography & Region
          </h3>
        </div>
        <div className="space-y-1">
          {regions.map((reg) => {
            const isChecked = filter.selectedRegions.includes(reg);
            return (
              <button
                key={reg}
                onClick={() => toggleRegion(reg)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                  isChecked
                    ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300 font-medium border border-sky-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{reg}</span>
                {isChecked && <Check className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transport Protocols */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
            Transport Type
          </h3>
        </div>
        <div className="space-y-1">
          {transports.map((t) => {
            const isChecked = filter.selectedTransports.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTransport(t.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all text-left ${
                  isChecked
                    ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs">{t.label}</div>
                </div>
                {isChecked && <Check className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
