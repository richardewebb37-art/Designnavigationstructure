import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { works, universes } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';

export function Discovery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'original' | 'inspired'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredWorks = works.filter((work) => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUniverse = !selectedUniverse || work.universe === selectedUniverse;
    const matchesType = selectedType === 'all' || work.type === selectedType;
    
    return matchesSearch && matchesUniverse && matchesType;
  });

  const hasActiveFilters = searchQuery || selectedUniverse || selectedType !== 'all';

  return (
    <div className="space-y-8">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="relative flex items-center">
            <div className="absolute inset-0 bg-slate-800 border-4 border-slate-700 group-focus-within:border-blue-500 rounded-xl transition-colors" />
            <Search className="absolute left-6 w-6 h-6 text-blue-400" strokeWidth={3} />
            <input
              type="text"
              placeholder="SEARCH WORKS, AUTHORS, UNIVERSES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-16 pr-14 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none font-bold uppercase tracking-wide"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 p-2 hover:bg-red-500 rounded-lg transition-all border-2 border-red-500"
              >
                <X className="w-5 h-5 text-white" strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-4 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 border-4 font-black uppercase ${
            hasActiveFilters
              ? 'bg-gradient-to-r from-red-600 to-orange-500 border-yellow-400 text-white'
              : 'bg-slate-800 border-slate-700 text-white hover:border-blue-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5" strokeWidth={3} />
            Filters
            {hasActiveFilters && (
              <span className="px-3 py-1 bg-black/30 text-xs rounded-full">ACTIVE</span>
            )}
          </div>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="relative overflow-hidden rounded-xl border-4 border-yellow-400">
          <div className="absolute inset-0 bg-slate-800" />
          <div className="relative p-6 space-y-6">
            {/* Content Type */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                Content Type
              </h3>
              <div className="flex gap-3">
                {['all', 'original', 'inspired'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-6 py-3 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-2 font-black uppercase ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 border-yellow-400 text-white'
                        : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Universe Filter */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                Universe
              </h3>
              <div className="flex gap-3 flex-wrap">
                {universes.map((universe) => (
                  <button
                    key={universe.id}
                    onClick={() => setSelectedUniverse(
                      selectedUniverse === universe.name ? null : universe.name
                    )}
                    className={`px-5 py-3 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-2 font-black uppercase ${
                      selectedUniverse === universe.name
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 border-yellow-400 text-white'
                        : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{universe.icon}</span>
                      <span className="text-sm">{universe.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedUniverse(null);
                  setSelectedType('all');
                }}
                className="w-full px-6 py-3 rounded-lg bg-red-600 border-2 border-red-500 text-white font-black uppercase hover:bg-red-700 transition-all hover:scale-105"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-white">
          <strong className="text-3xl font-black text-yellow-400">{filteredWorks.length}</strong> <span className="text-lg font-bold uppercase">{filteredWorks.length === 1 ? 'Work' : 'Works'} Found</span>
        </p>
      </div>

      {/* Results Grid */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <div className="relative text-center py-20 overflow-hidden rounded-xl border-4 border-slate-700">
          <div className="absolute inset-0 bg-slate-800" />
          <div className="relative space-y-4">
            <div className="text-6xl">🔍</div>
            <p className="text-2xl text-white font-black uppercase">No Works Found</p>
            <p className="text-gray-400 font-bold">Try Different Filters or Search Terms</p>
          </div>
        </div>
      )}
    </div>
  );
}