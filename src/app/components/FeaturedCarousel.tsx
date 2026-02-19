import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FeaturedItem {
  id: string;
  title: string;
  author: string;
  description: string;
  imageUrl?: string; // Optional - not used in current implementation
  universeTag?: string;
  category: 'trending' | 'staff-pick' | 'new';
  badge: string;
}

interface FeaturedCarouselProps {
  items: FeaturedItem[];
  onItemClick: (id: string) => void;
}

export function FeaturedCarousel({ items, onItemClick }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trending':
        return 'from-red-600 to-orange-600';
      case 'staff-pick':
        return 'from-purple-600 to-pink-600';
      case 'new':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-yellow-400 bg-slate-900 shadow-2xl">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 z-10" />

      {/* Main content */}
      <div className="relative">
        {/* Image */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(currentItem.category)} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-8xl sm:text-9xl mb-4">⭐</div>
              <p className="text-white font-black text-xl sm:text-2xl uppercase">{currentItem.badge}</p>
            </div>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          
          {/* Halftone pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '8px 8px'
            }} 
          />

          {/* Category Badge */}
          <div className={`absolute top-4 left-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentItem.category)} border-2 sm:border-3 border-white/50 backdrop-blur-sm flex items-center gap-2 shadow-lg`}>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
            <span className="text-white font-black text-xs sm:text-sm uppercase">{currentItem.badge}</span>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
            {/* Universe Tag */}
            {currentItem.universeTag && (
              <div className="inline-block px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500">
                <span className="text-purple-300 font-black text-xs sm:text-sm uppercase">{currentItem.universeTag}</span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight max-w-3xl">
              {currentItem.title}
            </h2>

            {/* Author */}
            <p className="text-sm sm:text-base text-blue-400 font-bold">BY {currentItem.author.toUpperCase()}</p>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl line-clamp-2">
              {currentItem.description}
            </p>

            {/* View Button */}
            <button
              onClick={() => onItemClick(currentItem.id)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-500 border-2 sm:border-3 border-yellow-400 text-white font-black uppercase rounded-lg hover:opacity-90 transition-all shadow-lg text-sm sm:text-base"
            >
              Explore Now
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 rounded-full flex items-center justify-center transition-all border-2 border-white/20 hover:border-yellow-400 z-10"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 rounded-full flex items-center justify-center transition-all border-2 border-white/20 hover:border-yellow-400 z-10"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={3} />
            </button>
          </>
        )}

        {/* Dots Navigation */}
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === currentIndex
                    ? 'w-8 sm:w-10 h-2 sm:h-3 bg-yellow-400 rounded-full'
                    : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/75 rounded-full'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}