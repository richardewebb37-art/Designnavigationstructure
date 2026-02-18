import { Heart, Eye } from 'lucide-react';
import { Work } from '../data/mockData';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WorkCardProps {
  work: Work;
  onClick?: () => void;
}

export function WorkCard({ work, onClick }: WorkCardProps) {
  const getImageUrl = (searchTerms: string) => {
    const hash = searchTerms.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://images.unsplash.com/photo-${1500000000000 + (hash % 100000000)}?w=600&h=400&fit=crop`;
  };

  return (
    <article
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
    >
      {/* Bold comic book border */}
      <div className="absolute -inset-1 bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Card background */}
      <div className="relative bg-slate-800 rounded-xl overflow-hidden border-4 border-slate-700 group-hover:border-yellow-400 transition-colors">
        {/* Image with comic effect */}
        <div className="relative h-56 overflow-hidden">
          <ImageWithFallback
            src={getImageUrl(work.thumbnail)}
            alt={work.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100"
          />
          {/* Comic book overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
          <div className="absolute inset-0 mix-blend-multiply opacity-20" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                 backgroundSize: '4px 4px'
               }} 
          />
          
          {/* Type badge with comic style */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-black uppercase tracking-wide rounded-lg border-2 transform -rotate-2 shadow-lg ${
            work.type === 'original'
              ? 'bg-blue-600 text-white border-blue-300'
              : 'bg-red-600 text-white border-yellow-400'
          }`}>
            {work.type === 'original' ? '⚡ ORIGINAL' : '★ INSPIRED'}
          </div>
        </div>
        
        {/* Content with action lines accent */}
        <div className="relative p-5 space-y-4 bg-gradient-to-b from-slate-800 to-slate-900">
          {/* Action line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors line-clamp-1 uppercase tracking-tight">
              {work.title}
            </h3>
            <p className="text-sm text-blue-400 font-bold">BY {work.author.toUpperCase()}</p>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {work.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {work.tags.slice(0, 2).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 bg-slate-700 text-yellow-400 text-xs rounded-md border border-slate-600 font-bold uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-red-400">
                <Heart className="w-4 h-4 fill-red-400" />
                <span className="text-sm font-black">{work.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-black">{Math.floor(work.likes * 12)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}