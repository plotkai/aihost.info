import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FilterSidebar } from './components/FilterSidebar';
import { ServerCard } from './components/ServerCard';
import { ServerDetail } from './components/ServerDetail';
import { SubmitForm } from './components/SubmitForm';
import { WaitlistModal } from './components/WaitlistModal';
import { Footer } from './components/Footer';
import { allServers, getServerBySlug } from './data/registry';
import { filterAndSearchServers } from './utils/search';
import { FilterState } from './types/mcp';
import { ArrowUpDown, Search, X } from 'lucide-react';

export const App: React.FC = () => {
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategories: [],
    selectedRegions: [],
    selectedTransports: [],
    selectedHostings: [],
    verifiedOnly: false,
    sortBy: 'stars',
  });

  // URL parser & Router listener
  const parseLocation = () => {
    let path = window.location.pathname;
    const hash = window.location.hash;

    // Support hash router fallback for GitHub Pages if needed
    if (hash && hash.startsWith('#/')) {
      path = hash.slice(1);
    } else if (window.location.search.startsWith('?/')) {
      // 404.html single-page redirect handling
      path = '/' + window.location.search.slice(2).split('&')[0].replace(/~and~/g, '&');
    }

    if (path.startsWith('/servers/')) {
      const slug = path.replace('/servers/', '').replace(/\/$/, '');
      setSelectedSlug(slug);
      setCurrentRoute('/servers/' + slug);
    } else if (path === '/submit' || path === '/submit/') {
      setSelectedSlug(null);
      setCurrentRoute('/submit');
    } else if (path === '/waitlist' || path === '/waitlist/') {
      setSelectedSlug(null);
      setIsWaitlistOpen(true);
      setCurrentRoute('/');
    } else {
      setSelectedSlug(null);
      setCurrentRoute('/');
    }
  };

  useEffect(() => {
    parseLocation();
    window.addEventListener('popstate', parseLocation);
    return () => window.removeEventListener('popstate', parseLocation);
  }, []);

  const navigate = (route: string) => {
    window.history.pushState({}, '', route);
    parseLocation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServer = (slug: string) => {
    navigate(`/servers/${slug}`);
  };

  const handleUpdateFilters = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategories: [],
      selectedRegions: [],
      selectedTransports: [],
      selectedHostings: [],
      verifiedOnly: false,
      sortBy: 'stars',
    });
  };

  const handleSelectCategory = (cat: string) => {
    setFilters((prev) => {
      const exists = prev.selectedCategories.includes(cat);
      return {
        ...prev,
        selectedCategories: exists ? [] : [cat],
      };
    });
    if (currentRoute !== '/') {
      navigate('/');
    }
  };

  // Filtered servers
  const filteredServers = useMemo(() => {
    return filterAndSearchServers(allServers, filters);
  }, [filters]);

  const activeServer = selectedSlug ? getServerBySlug(selectedSlug) : null;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500/30 selection:text-brand-200">
      <div>
        {/* Navigation Header */}
        <Header
          onNavigate={navigate}
          currentRoute={currentRoute}
          onOpenWaitlist={() => setIsWaitlistOpen(true)}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => handleUpdateFilters({ searchQuery: q })}
        />

        {/* Dynamic Route Content */}
        {currentRoute === '/submit' ? (
          <SubmitForm onBack={() => navigate('/')} />
        ) : activeServer ? (
          <ServerDetail
            server={activeServer}
            onBack={() => navigate('/')}
            onSelectCategory={(cat) => {
              handleSelectCategory(cat);
              navigate('/');
            }}
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
          />
        ) : (
          <main>
            {/* Hero Banner with stats */}
            <Hero
              onSelectCategory={handleSelectCategory}
              selectedCategories={filters.selectedCategories}
              onOpenWaitlist={() => setIsWaitlistOpen(true)}
            />

            {/* Main Content Area: Sidebar + Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar Filter */}
                <FilterSidebar
                  filter={filters}
                  onChange={handleUpdateFilters}
                  onReset={handleResetFilters}
                  totalMatches={filteredServers.length}
                />

                {/* Catalog Grid Area */}
                <div className="flex-1 w-full space-y-6">
                  {/* Controls Bar: Sort & Active Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {filteredServers.length} {filteredServers.length === 1 ? 'Server' : 'Servers'} Available
                      </span>
                      {filters.searchQuery && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                          Search: "{filters.searchQuery}"
                          <button
                            onClick={() => handleUpdateFilters({ searchQuery: '' })}
                            className="hover:text-slate-900 dark:hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}
                      {filters.selectedCategories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {cat}
                          <button
                            onClick={() => handleSelectCategory(cat)}
                            className="hover:text-slate-900 dark:hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">Sort by:</span>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleUpdateFilters({ sortBy: e.target.value as any })}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="stars">Most Popular (Stars)</option>
                        <option value="tools">Most Tools Offered</option>
                        <option value="name">Alphabetical (A-Z)</option>
                        <option value="newest">Recently Added</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid of Servers */}
                  {filteredServers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                      {filteredServers.map((server) => (
                        <ServerCard
                          key={server.id}
                          server={server}
                          onSelect={handleSelectServer}
                          onOpenWaitlist={() => setIsWaitlistOpen(true)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="glass-panel p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <Search className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">No MCP servers found</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        We couldn't find any server matching your current filters or search keywords.
                      </p>
                      <div className="flex justify-center gap-3 pt-2">
                        <button
                          onClick={handleResetFilters}
                          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          Clear All Filters
                        </button>
                        <button
                          onClick={() => navigate('/submit')}
                          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-xs font-bold text-slate-950 transition-colors"
                        >
                          Submit this Server
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />

      {/* Footer */}
      <Footer
        onNavigate={navigate}
        onSelectCategory={handleSelectCategory}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};
