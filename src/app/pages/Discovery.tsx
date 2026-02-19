import { Search, Filter, X, TrendingUp, Sparkles, Clock, Loader, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DiscoveryCard, DiscoveryContent } from '../components/DiscoveryCard';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { universes } from '../data/mockData';
import { useApp } from '../context/AppContext';

type SortOption = 'newest' | 'popular' | 'trending';

export function Discovery() {
  const { setCurrentPage, setSelectedStoryId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'original' | 'inspired'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<DiscoveryContent[]>([]);

  // Load content on mount
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would fetch from backend
      const mockContent: DiscoveryContent[] = [
        {
          id: '1',
          title: 'The Multiverse Chronicles',
          author: 'MarvelFan42',
          authorId: 'user1',
          description: 'An epic journey through alternate realities where Spider-Man teams up with versions of himself from different universes to stop a cosmic threat.',
          thumbnail: 'https://images.unsplash.com/photo-1759863726410-ce278dded3a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcmhlcm8lMjBjb21pYyUyMGFjdGlvbnxlbnwxfHx8fDE3NzE0Mjk4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
          universe: 'Marvel',
          type: 'inspired',
          tags: ['Spider-Man', 'Multiverse', 'Action'],
          likes: 1247,
          views: 15632,
          comments: 234,
          isLiked: false,
          isBookmarked: false,
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'Gotham Nights: Rise of the Shadows',
          author: 'DarkKnight88',
          authorId: 'user2',
          description: 'A gritty detective noir story following Batman as he unravels a conspiracy that threatens to destroy Gotham from within.',
          thumbnail: 'https://images.unsplash.com/photo-1600480505021-e9cfb05527f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRtYW4lMjBkYXJrJTIwa25pZ2h0fGVufDF8fHx8MTc3MTU0MDExNHww&ixlib=rb-4.1.0&q=80&w=1080',
          universe: 'DC Comics',
          type: 'inspired',
          tags: ['Batman', 'Mystery', 'Noir'],
          likes: 2156,
          views: 28943,
          comments: 412,
          isLiked: true,
          isBookmarked: true,
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          title: 'Echoes of Aetheria',
          author: 'FantasyWriter99',
          authorId: 'user3',
          description: 'In a world where magic flows like water, a young mage discovers they hold the key to preventing an ancient evil from returning.',
          thumbnail: 'https://images.unsplash.com/photo-1675611559364-4b3e04347077?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbWFnaWMlMjBjYXN0bGV8ZW58MXx8fHwxNzcxNTQwMTE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'original',
          tags: ['Fantasy', 'Magic', 'Adventure'],
          likes: 892,
          views: 12456,
          comments: 167,
          isLiked: false,
          isBookmarked: false,
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          title: 'Cybertron Origins: The First War',
          author: 'TransformerLegend',
          authorId: 'user4',
          description: 'Before Optimus and Megatron, there was peace. This is the story of how war came to Cybertron and changed the Transformers forever.',
          thumbnail: 'https://images.unsplash.com/photo-1657276055907-1ebd236c9850?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc2Zvcm1lcnMlMjByb2JvdCUyMG1lY2h8ZW58MXx8fHwxNzcxNTQwMTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
          universe: 'Transformers',
          type: 'inspired',
          tags: ['Transformers', 'Sci-Fi', 'War'],
          likes: 1534,
          views: 19234,
          comments: 289,
          isLiked: false,
          isBookmarked: true,
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '5',
          title: 'Stellar Horizon',
          author: 'SpaceExplorer',
          authorId: 'user5',
          description: 'A space opera following a ragtag crew of explorers as they discover ancient alien technology that could change the fate of humanity.',
          thumbnail: 'https://images.unsplash.com/photo-1762590322961-7a982c39e000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGV4cGxvcmF0aW9uJTIwbmVidWxhfGVufDF8fHx8MTc3MTQ0MTk0OXww&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'original',
          tags: ['Sci-Fi', 'Space', 'Adventure'],
          likes: 1678,
          views: 21845,
          comments: 345,
          isLiked: true,
          isBookmarked: false,
          updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '6',
          title: 'The Force Awakens: Legacy',
          author: 'JediMaster77',
          authorId: 'user6',
          description: 'Years after the fall of the Empire, a new generation of Jedi must rise to face a threat emerging from the Unknown Regions.',
          thumbnail: 'https://images.unsplash.com/photo-1641478865500-4be4250d5c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyJTIwd2FycyUyMGdhbGF4eXxlbnwxfHx8fDE3NzE1NDAxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          universe: 'Star Wars',
          type: 'inspired',
          tags: ['Star Wars', 'Jedi', 'Adventure'],
          likes: 3245,
          views: 45678,
          comments: 567,
          isLiked: false,
          isBookmarked: false,
          updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '7',
          title: 'Chronicles of the Shadowrealm',
          author: 'DarkFantasyAuthor',
          authorId: 'user7',
          description: 'In a realm where shadows have power, a reluctant hero must master the darkness within to save their kingdom from destruction.',
          thumbnail: 'https://images.unsplash.com/photo-1759350922618-8fba22ad4357?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZmFudGFzeSUyMHNoYWRvd3N8ZW58MXx8fHwxNzcxNTQwMTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'original',
          tags: ['Dark Fantasy', 'Magic', 'Epic'],
          likes: 1123,
          views: 16789,
          comments: 234,
          isLiked: false,
          isBookmarked: false,
          updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '8',
          title: 'Avengers: Quantum Paradox',
          author: 'MCUFanatic',
          authorId: 'user8',
          description: 'When a quantum experiment goes wrong, the Avengers find themselves trapped in a time loop, reliving the same day over and over.',
          thumbnail: 'https://images.unsplash.com/photo-1608889175638-9322300c46e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmVuZ2VycyUyMHN1cGVyaGVybyUyMHRlYW18ZW58MXx8fHwxNzcxNTQwMTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          universe: 'Marvel',
          type: 'inspired',
          tags: ['Avengers', 'Time Travel', 'Action'],
          likes: 2789,
          views: 34567,
          comments: 489,
          isLiked: true,
          isBookmarked: true,
          updatedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setContent(mockContent);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (id: string) => {
    setContent(content.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
        };
      }
      return item;
    }));
  };

  const handleBookmark = (id: string) => {
    setContent(content.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    }));
  };

  const handleShare = (id: string) => {
    const item = content.find(c => c.id === id);
    if (item) {
      alert(`Share "${item.title}" - Link copied!`);
    }
  };

  const handleContentClick = (id: string) => {
    setSelectedStoryId(id);
    setCurrentPage('story');
  };

  const handleFeaturedClick = (id: string) => {
    handleContentClick(id);
  };

  // Filter and sort content
  let filteredContent = content.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesUniverse = !selectedUniverse || item.universe === selectedUniverse;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesUniverse && matchesType;
  });

  // Sort content
  if (sortBy === 'newest') {
    filteredContent.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } else if (sortBy === 'popular') {
    filteredContent.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === 'trending') {
    // Combine likes and recency for trending
    filteredContent.sort((a, b) => {
      const aScore = a.likes + (new Date(a.updatedAt).getTime() / 1000000);
      const bScore = b.likes + (new Date(b.updatedAt).getTime() / 1000000);
      return bScore - aScore;
    });
  }

  const hasActiveFilters = searchQuery || selectedUniverse || selectedType !== 'all';

  // Featured carousel items
  const featuredItems = content.slice(0, 5).map(item => ({
    id: item.id,
    title: item.title,
    author: item.author,
    description: item.description,
    // imageUrl removed - not used by FeaturedCarousel component
    universeTag: item.universe,
    category: item.likes > 2000 ? 'trending' as const : item.views > 30000 ? 'staff-pick' as const : 'new' as const,
    badge: item.likes > 2000 ? 'Trending' : item.views > 30000 ? 'Staff Pick' : 'New Release',
  }));

  const activeFiltersCount = [
    selectedUniverse !== null,
    selectedType !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Featured Carousel */}
      <FeaturedCarousel items={featuredItems} onItemClick={handleFeaturedClick} />

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" strokeWidth={3} />
          <input
            type="text"
            placeholder="Search stories, authors, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 focus:border-yellow-400 rounded-xl text-white placeholder-gray-500 focus:outline-none font-bold text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-6 py-3 sm:py-4 rounded-xl font-black uppercase transition-all border-2 sm:border-4 flex items-center justify-center gap-2 text-sm sm:text-base ${
            showFilters
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 text-white'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-400'
          }`}
        >
          <Filter className="w-5 h-5" strokeWidth={3} />
          Filters
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 hover:border-green-400 rounded-xl text-white font-black uppercase transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <TrendingUp className="w-5 h-5" strokeWidth={3} />
            {sortBy === 'trending' ? 'Trending' : sortBy === 'popular' ? 'Popular' : 'Newest'}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSortMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSortMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden">
                {[
                  { value: 'trending' as const, label: 'Trending', icon: TrendingUp },
                  { value: 'popular' as const, label: 'Most Popular', icon: Sparkles },
                  { value: 'newest' as const, label: 'Newest', icon: Clock },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors font-bold text-sm flex items-center gap-2 ${
                        sortBy === option.value
                          ? 'bg-green-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-slate-800 rounded-xl border-2 sm:border-4 border-slate-600 space-y-6">
          {/* Universe Filter */}
          <div>
            <h3 className="font-black text-white mb-3 text-sm sm:text-base uppercase tracking-wide">Universe</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedUniverse(null)}
                className={`px-4 py-2 rounded-lg font-bold transition-all border-2 text-sm ${
                  selectedUniverse === null
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-yellow-400'
                }`}
              >
                All
              </button>
              {universes.map(universe => (
                <button
                  key={universe.id}
                  onClick={() => setSelectedUniverse(selectedUniverse === universe.name ? null : universe.name)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all border-2 text-sm ${
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
            <h3 className="font-black text-white mb-3 text-sm sm:text-base uppercase tracking-wide">Type</h3>
            <div className="flex gap-2 flex-wrap">
              {['all', 'original', 'inspired'].map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as typeof selectedType)}
                  className={`px-6 py-2 rounded-lg font-bold transition-all border-2 text-sm ${
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUniverse(null);
                setSelectedType('all');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-sm transition-all"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transform -skew-x-3 rounded-lg" />
          <h2 className="relative text-2xl sm:text-3xl font-black text-white uppercase tracking-tight px-4 sm:px-6 py-2 sm:py-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Stories'}
          </h2>
        </div>
        <span className="text-yellow-400 font-black text-sm sm:text-lg">
          {filteredContent.length} {filteredContent.length === 1 ? 'STORY' : 'STORIES'}
        </span>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-12 h-12 text-yellow-400 animate-spin" />
        </div>
      ) : filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredContent.map((item) => (
            <DiscoveryCard
              key={item.id}
              content={item}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onShare={handleShare}
              onClick={handleContentClick}
            />
          ))}
        </div>
      ) : (
        <div className="relative text-center py-20 overflow-hidden rounded-xl border-2 sm:border-4 border-slate-700 bg-slate-800">
          <div className="absolute inset-0 opacity-5" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
               }} 
          />
          <div className="relative space-y-4">
            <div className="text-4xl sm:text-6xl">🔍</div>
            <p className="text-xl sm:text-2xl text-white font-black uppercase">No Stories Found</p>
            <p className="text-gray-400 font-bold text-sm sm:text-base">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  );
}