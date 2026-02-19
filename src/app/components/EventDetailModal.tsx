import { X, Calendar, Clock, Users, MapPin, Share2, Bookmark, ExternalLink, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Event } from './EventCard';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRSVP: (eventId: string) => void;
  onBookmark: (eventId: string) => void;
  onShare: (eventId: string) => void;
}

export function EventDetailModal({ event, isOpen, onClose, onRSVP, onBookmark, onShare }: EventDetailModalProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event || event.status !== 'upcoming') return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = new Date(event.startDate).getTime();
      const difference = eventTime - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [event]);

  if (!isOpen || !event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border-2 sm:border-4 border-yellow-400 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-slate-900/80 backdrop-blur-sm hover:bg-slate-800 rounded-lg flex items-center justify-center transition-all z-10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Event Image */}
        <div className="relative h-48 sm:h-72 overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-br ${getStatusColor()} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-8xl sm:text-9xl mb-4">🎪</div>
              <p className="text-white font-black text-xl sm:text-2xl uppercase">{event.category}</p>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
          
          {/* Status Badge */}
          {event.status === 'ongoing' && (
            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-green-600 border-2 sm:border-3 border-green-400 flex items-center gap-2 animate-pulse">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="text-white font-black text-sm uppercase">Live Now</span>
            </div>
          )}

          {/* Universe Tag */}
          {event.universeTag && (
            <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-purple-900/80 backdrop-blur-sm border-2 sm:border-3 border-purple-500">
              <span className="text-purple-300 font-black text-sm uppercase">{event.universeTag}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Category */}
          <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${getStatusColor()} border-2`}>
            <span className="text-white font-black text-sm uppercase">{event.category}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
            {event.title}
          </h2>

          {/* Countdown Timer (for upcoming events) */}
          {event.status === 'upcoming' && (
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-2 border-blue-500 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Timer className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                <h3 className="text-lg font-black text-blue-400 uppercase">Event Starts In</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {[
                  { label: 'Days', value: countdown.days },
                  { label: 'Hours', value: countdown.hours },
                  { label: 'Minutes', value: countdown.minutes },
                  { label: 'Seconds', value: countdown.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="text-center">
                    <div className="bg-slate-800 border-2 border-slate-600 rounded-lg p-2 sm:p-4 mb-2">
                      <span className="text-2xl sm:text-4xl font-black text-white">{unit.value}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-700/50 border-2 border-slate-600 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <h4 className="text-sm font-black text-blue-400 uppercase mb-1">Date</h4>
                <p className="text-white font-bold text-sm">{formatDate(event.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700/50 border-2 border-slate-600 rounded-lg">
              <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <h4 className="text-sm font-black text-green-400 uppercase mb-1">Time</h4>
                <p className="text-white font-bold text-sm">{formatTime(event.startDate)}</p>
                {event.endDate && (
                  <p className="text-slate-400 text-xs">Until {formatTime(event.endDate)}</p>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3 p-4 bg-slate-700/50 border-2 border-slate-600 rounded-lg sm:col-span-2">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <div>
                  <h4 className="text-sm font-black text-yellow-400 uppercase mb-1">Location</h4>
                  <p className="text-white font-bold text-sm">{event.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-slate-700/50 border-2 border-slate-600 rounded-lg sm:col-span-2">
              <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div>
                <h4 className="text-sm font-black text-purple-400 uppercase mb-1">Participants</h4>
                <p className="text-white font-bold text-sm">
                  {event.participants} {event.maxParticipants ? `of ${event.maxParticipants}` : ''} people attending
                </p>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-yellow-400 uppercase">About This Event</h3>
            <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {event.fullDescription || event.description}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-slate-700">
            <button
              onClick={() => onRSVP(event.id)}
              disabled={event.status === 'past'}
              className={`flex-1 px-6 py-4 rounded-lg font-black text-sm sm:text-base uppercase transition-all ${
                event.isRSVP
                  ? 'bg-green-600 border-2 border-green-400 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400 text-white hover:opacity-90'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {event.isRSVP ? '✓ You\'re Going' : 'RSVP Now'}
            </button>
            
            <button
              onClick={() => onBookmark(event.id)}
              className={`px-6 py-4 rounded-lg border-2 transition-all font-black text-sm sm:text-base uppercase ${
                event.isBookmarked
                  ? 'bg-yellow-600 border-yellow-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Bookmark className={`w-5 h-5 ${event.isBookmarked ? 'fill-white' : ''}`} strokeWidth={2.5} />
                {event.isBookmarked ? 'Saved' : 'Save'}
              </div>
            </button>
            
            <button
              onClick={() => onShare(event.id)}
              className="px-6 py-4 rounded-lg bg-slate-700 border-2 border-slate-600 text-white hover:bg-slate-600 transition-all font-black text-sm sm:text-base uppercase"
            >
              <div className="flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" strokeWidth={2.5} />
                Share
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}