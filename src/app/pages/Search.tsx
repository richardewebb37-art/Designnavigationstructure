import { Search as SearchIcon, Filter, X, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { works, universes } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';

export function Search() {
  const { searchQuery, setSearchQuery, setCurrentPage, setSelectedStoryId } = useApp();
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'original' | 'inspired'>('all');
  const [sortBy, setSortBy] = useState<'relevant' | 'popular' | 'recent'>('relevant');
  const [showFilters, setShowFilters] = useState(false);

  const trendingSearches = ['Sci-Fi', 'Marvel', 'Fantasy', 'Cyberpunk', 'Time Travel'];

  // Filter works based on search and filters
  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesUniverse = !selectedUniverse || work.universe === selectedUniverse;
    const matchesType = selectedType === 'all' || work.type === selectedType;
    
    return matchesSearch && matchesUniverse && matchesType;
  });

  // Sort works
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'recent') return 1; // Mock - would use actual dates
    return 0; // relevant is default order
  });

  const clearFilters = () => {
    setSelectedUniverse(null);
    setSelectedType('all');
    setSortBy('relevant');
  };

  const activeFiltersCount = [
    selectedUniverse !== null,
    selectedType !== 'all',
    sortBy !== 'relevant'
  ].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="relative p-6 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        <h1 className="font-black text-3xl text-white mb-6 tracking-tight">Search The Fictionverse</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories, authors, tags, universes..."
            className="w-full pl-14 pr-12 py-4 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white placeholder-slate-400 font-bold text-lg outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-600 hover:bg-slate-500 rounded-lg flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
              showFilters
                ? 'bg-yellow-600 text-white border-2 border-yellow-400'
                : 'bg-slate-700 text-slate-300 border-2 border-slate-600 hover:border-yellow-400'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-all"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-slate-800 rounded-xl border-2 border-slate-600 space-y-6">
          {/* Universe Filter */}
          <div>
            <h3 className="font-black text-white mb-3">Universe</h3>
            <div className="flex flex-wrap gap-2">
              {universes.map(universe => (
                <button
                  key={universe.id}
                  onClick={() => setSelectedUniverse(selectedUniverse === universe.name ? null : universe.name)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all border-2 ${
                    selectedUniverse === universe.name
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-purple-400'
                  }`}
                >
                  {universe.icon} {universe.name}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <h3 className="font-black text-white mb-3">Type</h3>
            <div className="flex gap-2">
              {['all', 'original', 'inspired'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as typeof selectedType)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="font-black text-white mb-3">Sort By</h3>
            <div className="flex gap-2">
              {['relevant', 'popular', 'recent'].map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort as typeof sortBy)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${
                    sortBy === sort
                      ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-green-400'
                  }`}
                >
                  {sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {!searchQuery && (
        <div className="p-6 bg-slate-800 rounded-xl border-2 border-slate-600">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            <h3 className="font-black text-white">Trending Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-4 py-2 bg-slate-700 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-orange-600 rounded-lg border-2 border-slate-600 hover:border-yellow-400 text-slate-300 hover:text-white font-bold transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-2xl text-white">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Stories'}
            <span className="text-slate-400 font-bold ml-3">({sortedWorks.length})</span>
          </h2>
        </div>

        {sortedWorks.length === 0 ? (
          <div className="text-center py-12 p-8 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600">
            <SearchIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg mb-2">No stories found</p>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorks.map(work => (
              <WorkCard 
                key={work.id}
                work={work}
                onClick={() => {
                  setSelectedStoryId(work.id);
                  setCurrentPage('story');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
