import { Heart, MessageSquare } from 'lucide-react';
import { Thread } from '../data/mockData';

interface ThreadCardProps {
  thread: Thread;
  onClick?: () => void;
}

export function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <article
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-800 border-4 border-slate-700 hover:border-blue-500"
    >
      {/* Comic book glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Halftone pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '8px 8px'
           }} 
      />
      
      <div className="relative p-6 flex gap-5">
        {/* Avatar - Comic style */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 border-4 border-yellow-400 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
            {thread.avatar}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="text-xl font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">
            {thread.title}
          </h3>
          
          <p className="text-sm text-blue-400 font-bold uppercase">
            BY {thread.author.toUpperCase()}
            <span className="text-gray-500 ml-2">{formatTimestamp(thread.timestamp)}</span>
          </p>
          
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {thread.content}
          </p>
          
          <div className="flex items-center gap-6 pt-2">
            <button className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors group/btn">
              <Heart className="w-5 h-5 fill-red-400 group-hover/btn:scale-125 transition-transform" strokeWidth={2.5} />
              <span className="font-black">{thread.likes}</span>
            </button>
            
            <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group/btn">
              <MessageSquare className="w-5 h-5 group-hover/btn:scale-125 transition-transform" strokeWidth={2.5} />
              <span className="font-black">{thread.replies}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}