import { Heart, Eye, Bookmark, Share2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface DiscoveryContent {
  id: string;
  title: string;
  author: string;
  authorId: string;
  description: string;
  thumbnail: string;
  universe?: string;
  type: 'original' | 'inspired';
  tags: string[];
  likes: number;
  views: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  updatedAt: string;
}

interface DiscoveryCardProps {
  content: DiscoveryContent;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onShare: (id: string) => void;
  onClick: (id: string) => void;
}

export function DiscoveryCard({ content, onLike, onBookmark, onShare, onClick }: DiscoveryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article
      onClick={() => onClick(content.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
    >
      {/* Bold comic book border glow */}
      <div className="absolute -inset-1 bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Card background */}
      <div className="relative bg-slate-800 rounded-xl overflow-hidden border-2 sm:border-4 border-slate-700 group-hover:border-yellow-400 transition-colors">
        {/* Image with comic effect */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          {/* Actual image */}
          <ImageWithFallback
            src={content.thumbnail}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          
          {/* Comic book overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          <div 
            className={`absolute inset-0 mix-blend-multiply transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-20'}`}
            style={{ 
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '4px 4px'
            }} 
          />
          
          {/* Type badge */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-black uppercase tracking-wide rounded-lg border-2 transform -rotate-2 shadow-lg ${
            content.type === 'original'
              ? 'bg-blue-600 text-white border-blue-300'
              : 'bg-red-600 text-white border-yellow-400'
          }`}>
            {content.type === 'original' ? '⚡ ORIGINAL' : '★ INSPIRED'}
          </div>

          {/* Quick Actions (visible on hover) */}
          <div className={`absolute top-3 left-3 flex gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(content.id);
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all ${
                content.isBookmarked
                  ? 'bg-yellow-600 border-2 border-yellow-400'
                  : 'bg-slate-900/80 border-2 border-white/20 hover:border-yellow-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 text-white ${content.isBookmarked ? 'fill-white' : ''}`} strokeWidth={2.5} />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(content.id);
              }}
              className="w-8 h-8 rounded-lg bg-slate-900/80 backdrop-blur-sm border-2 border-white/20 hover:border-blue-400 flex items-center justify-center transition-all"
            >
              <Share2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* Updated Badge */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded text-xs text-slate-300 font-bold">
            {getTimeAgo(content.updatedAt)}
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-4 sm:p-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-800 to-slate-900">
          {/* Action line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
          
          {/* Universe tag */}
          {content.universe && (
            <div className="inline-block px-2.5 py-1 rounded-full bg-purple-900/50 border border-purple-500">
              <span className="text-purple-300 font-black text-xs uppercase">{content.universe}</span>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-yellow-400 transition-colors line-clamp-1 uppercase tracking-tight">
              {content.title}
            </h3>
            <p className="text-xs sm:text-sm text-blue-400 font-bold">BY {content.author.toUpperCase()}</p>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {content.description}
          </p>
          
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {content.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-2.5 py-1 bg-slate-700 text-yellow-400 text-xs rounded-md border border-slate-600 font-bold uppercase"
              >
                {tag}
              </span>
            ))}
            {content.tags.length > 2 && (
              <span className="px-2.5 py-1 bg-slate-700 text-slate-400 text-xs rounded-md border border-slate-600 font-bold">
                +{content.tags.length - 2}
              </span>
            )}
          </div>
          
          {/* Stats and Actions */}
          <div className="flex items-center justify-between pt-2 border-t-2 border-slate-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(content.id);
                }}
                className={`flex items-center gap-1 transition-all group/btn ${
                  content.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 group-hover/btn:scale-125 transition-transform ${content.isLiked ? 'fill-red-400' : ''}`} strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-black">{formatNumber(content.likes)}</span>
              </button>
              
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-black">{formatNumber(content.views)}</span>
              </div>

              <div className="flex items-center gap-1 text-green-400">
                <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-black">{formatNumber(content.comments)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}