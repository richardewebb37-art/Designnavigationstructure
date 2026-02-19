import { Calendar, Clock, Users, Bookmark, Share2, MapPin } from 'lucide-react';
import { useState } from 'react';

export interface Event {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  imageUrl?: string; // Made optional - not used in current implementation
  startDate: string;
  endDate?: string;
  status: 'upcoming' | 'ongoing' | 'past';
  universeTag?: string;
  category: string;
  participants: number;
  maxParticipants?: number;
  isRSVP: boolean;
  isBookmarked: boolean;
  location?: string;
}

interface EventCardProps {
  event: Event;
  onRSVP: (eventId: string) => void;
  onBookmark: (eventId: string) => void;
  onClick: (eventId: string) => void;
}

export function EventCard({ event, onRSVP, onBookmark, onClick }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays > 0 && diffInDays < 7) return `In ${diffInDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'ongoing':
        return 'from-green-600 to-emerald-600';
      case 'upcoming':
        return 'from-blue-600 to-cyan-600';
      case 'past':
        return 'from-slate-600 to-slate-700';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  const getStatusBorder = () => {
    switch (event.status) {
      case 'ongoing':
        return 'border-green-400';
      case 'upcoming':
        return 'border-blue-400';
      case 'past':
        return 'border-slate-500';
      default:
        return 'border-blue-400';
    }
  };

  return (
    <article
      onClick={() => onClick(event.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-slate-800 border-2 sm:border-4 ${getStatusBorder()} hover:border-yellow-400`}
    >
      {/* Status Badge */}
      {event.status === 'ongoing' && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-green-600 border-2 border-green-400 flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-white font-black text-xs uppercase">Live</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <div className="text-center">
            <div className="text-7xl mb-2">🎪</div>
            <p className="text-white font-black text-sm uppercase">{event.category}</p>
          </div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        {/* Halftone pattern on hover */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-20' : 'opacity-0'}`}
          style={{ 
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '8px 8px'
          }} 
        />

        {/* Universe Tag */}
        {event.universeTag && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-purple-900/80 backdrop-blur-sm border-2 border-purple-500">
            <span className="text-purple-300 font-black text-xs uppercase">{event.universeTag}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-4 sm:p-6 space-y-4">
        {/* Category */}
        <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${getStatusColor()} border-2 ${getStatusBorder()}`}>
          <span className="text-white font-black text-xs uppercase">{event.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Date & Time */}
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-400">
            <Calendar className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-bold">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Clock className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-bold">{formatTime(event.startDate)}</span>
          </div>
        </div>

        {/* Location (if available) */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-yellow-400">
            <MapPin className="w-4 h-4" strokeWidth={2.5} />
            <span className="font-bold">{event.location}</span>
          </div>
        )}

        {/* Participants */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users className="w-4 h-4" strokeWidth={2.5} />
          <span className="font-bold">
            {event.participants} {event.maxParticipants ? `/ ${event.maxParticipants}` : ''} attending
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRSVP(event.id);
            }}
            disabled={event.status === 'past'}
            className={`flex-1 px-4 py-3 rounded-lg font-black text-sm uppercase transition-all ${
              event.isRSVP
                ? 'bg-green-600 border-2 border-green-400 text-white'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400 text-white hover:opacity-90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {event.isRSVP ? '✓ Going' : 'RSVP'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark(event.id);
            }}
            className={`px-4 py-3 rounded-lg border-2 transition-all ${
              event.isBookmarked
                ? 'bg-yellow-600 border-yellow-400 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${event.isBookmarked ? 'fill-white' : ''}`} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}