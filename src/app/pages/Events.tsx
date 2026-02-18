import { Calendar, Filter } from 'lucide-react';
import { useState } from 'react';
import { events } from '../data/mockData';
import { EventCard } from '../components/EventCard';

type EventStatus = 'all' | 'upcoming' | 'ongoing' | 'past';

export function Events() {
  const [filter, setFilter] = useState<EventStatus>('all');

  const filteredEvents = events.filter((event) => 
    filter === 'all' || event.status === filter
  );

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const ongoingCount = events.filter((e) => e.status === 'ongoing').length;

  return (
    <div className="space-y-8">
      {/* Status Badges */}
      {(upcomingCount > 0 || ongoingCount > 0) && (
        <div className="flex gap-3">
          {ongoingCount > 0 && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 border-4 border-green-400 rounded-xl">
              <span className="text-white font-black uppercase tracking-wide">{ongoingCount} Live Now!</span>
            </div>
          )}
          {upcomingCount > 0 && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 border-4 border-blue-400 rounded-xl">
              <span className="text-white font-black uppercase tracking-wide">{upcomingCount} Coming Soon</span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-lg">
          <Filter className="w-5 h-5 text-yellow-400" strokeWidth={3} />
          <span className="text-white font-black uppercase">Filter:</span>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          {(['all', 'upcoming', 'ongoing', 'past'] as EventStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 border-4 font-black uppercase ${
                filter === status
                  ? 'bg-gradient-to-r from-red-600 to-orange-500 border-yellow-400 text-white shadow-lg'
                  : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-blue-500'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transform -skew-x-3 rounded-lg" />
            <h2 className="relative text-3xl font-black text-white uppercase tracking-tight px-6 py-3">
              {filter === 'all' ? 'All Events' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Events`}
            </h2>
          </div>
          <span className="text-yellow-400 font-black text-lg">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'EVENT' : 'EVENTS'}
          </span>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => alert(`Event details for: ${event.title}`)}
              />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-20 overflow-hidden rounded-xl border-4 border-slate-700">
            <div className="absolute inset-0 bg-slate-800" />
            <div className="relative space-y-6">
              <div className="inline-block p-5 rounded-2xl bg-yellow-500/20 border-4 border-yellow-500">
                <Calendar className="w-12 h-12 text-yellow-400" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl text-white font-black uppercase">No {filter !== 'all' && filter} Events</p>
                <p className="text-gray-400 font-bold">Check Back Later for Epic Challenges!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}