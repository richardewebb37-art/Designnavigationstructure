import { Calendar, Trophy, Target, Megaphone } from 'lucide-react';
import { Event } from '../data/mockData';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const getIcon = () => {
    switch (event.type) {
      case 'contest':
        return Trophy;
      case 'challenge':
        return Target;
      case 'announcement':
        return Megaphone;
      default:
        return Calendar;
    }
  };

  const getStatusStyle = () => {
    switch (event.status) {
      case 'ongoing':
        return {
          gradient: 'from-green-600 to-emerald-500',
          border: 'border-green-400',
          text: 'text-white',
          bg: 'bg-green-600'
        };
      case 'upcoming':
        return {
          gradient: 'from-blue-600 to-cyan-500',
          border: 'border-blue-400',
          text: 'text-white',
          bg: 'bg-blue-600'
        };
      case 'past':
        return {
          gradient: 'from-gray-600 to-slate-600',
          border: 'border-gray-500',
          text: 'text-white',
          bg: 'bg-gray-600'
        };
      default:
        return {
          gradient: 'from-gray-600 to-slate-600',
          border: 'border-gray-500',
          text: 'text-white',
          bg: 'bg-gray-600'
        };
    }
  };

  const Icon = getIcon();
  const statusStyle = getStatusStyle();

  return (
    <article
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 bg-slate-800 border-4 border-slate-700 hover:border-yellow-400"
    >
      {/* Comic book glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      
      {/* Halftone pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '8px 8px'
           }} 
      />
      
      <div className="relative p-6 flex items-start gap-5">
        {/* Icon - Comic style */}
        <div className="flex-shrink-0">
          <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 border-4 border-yellow-400 shadow-lg group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <h3 className="text-2xl font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-tight">
              {event.title}
            </h3>
            <span className={`px-4 py-2 text-xs font-black rounded-lg bg-gradient-to-r ${statusStyle.gradient} border-2 ${statusStyle.border} ${statusStyle.text} uppercase tracking-wider shadow-lg`}>
              {event.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            {event.description}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-blue-400 font-bold">
            <Calendar className="w-5 h-5" strokeWidth={2.5} />
            <span className="uppercase">
              {new Date(event.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}