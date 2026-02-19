import { Calendar, Filter, Search, TrendingUp, Users, Award, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EventCard, Event } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';

type EventStatus = 'all' | 'upcoming' | 'ongoing' | 'past';
type SortOption = 'date' | 'popular' | 'universe';

export function Events() {
  const [filter, setFilter] = useState<EventStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would fetch from backend
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Marvel Writing Challenge: Multiverse Madness',
          description: 'Create your own story exploring the multiverse! Write about alternate realities, what-if scenarios, or crossover events.',
          fullDescription: `🌟 Join the Marvel Multiverse Madness Challenge! 🌟

This month's challenge invites you to explore the infinite possibilities of the Marvel multiverse. Create compelling stories that take place in alternate realities, explore what-if scenarios, or bring together heroes from different universes.

PRIZES:
🥇 1st Place: Featured story on homepage + Exclusive badge
🥈 2nd Place: Premium account for 3 months
🥉 3rd Place: Custom avatar design

RULES:
• Minimum 2,000 words
• Must be Marvel-inspired
• Original plot required
• Submit by end date
• One entry per person

JUDGING CRITERIA:
- Originality and creativity
- Character development
- Plot structure
- Writing quality
- Universe authenticity

Good luck, writers! We can't wait to read your multiversal adventures! ✨`,
          // imageUrl removed to prevent external fetch errors in guest mode
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          universeTag: 'Marvel',
          category: 'Writing Challenge',
          participants: 234,
          maxParticipants: 500,
          isRSVP: false,
          isBookmarked: false,
          location: 'Virtual Event',
        },
        {
          id: '2',
          title: 'Live Q&A with Featured Writer',
          description: 'Join us for an exclusive Q&A session with this month\'s featured writer! Ask about their creative process, writing tips, and more.',
          fullDescription: `📚 Live Q&A Session with Award-Winning Writer! 📚

This week we're hosting an exclusive live Q&A session with Sarah Martinez, author of the viral DC Comics fanfic "Gotham Nights"!

Sarah will be answering your questions about:
• Her writing process and techniques
• How she develops compelling characters
• Tips for new writers
• Her journey in fan fiction
• Upcoming projects

EVENT SCHEDULE:
7:00 PM - Welcome and introduction
7:15 PM - Sarah's writing journey
7:30 PM - Q&A session (submit questions live!)
8:15 PM - Writing tips and advice
8:30 PM - Closing remarks

This is a rare opportunity to learn from one of our community's most talented writers. Don't miss it!

Submit your questions in advance or ask live during the event! 🎤`,
          // imageUrl removed to prevent external fetch in guest mode
          startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
          status: 'ongoing',
          category: 'Community Event',
          participants: 412,
          isRSVP: true,
          isBookmarked: true,
          location: 'Virtual Event',
        },
        {
          id: '3',
          title: 'Transformers Fan Art Contest',
          description: 'Show off your artistic skills! Create original fan art featuring your favorite Transformers characters. Top 3 winners get featured!',
          fullDescription: `🎨 Transformers Fan Art Contest! 🎨

Calling all artists! Show us your best Transformers fan art for a chance to win amazing prizes and get featured on our platform!

CONTEST DETAILS:
Create original artwork featuring Transformers characters, scenes, or concepts. All art styles welcome - digital, traditional, 3D, mixed media!

CATEGORIES:
• Character Design
• Action Scenes
• Concept Art
• Comic Style

PRIZES:
🏆 Grand Prize: Art featured on homepage + $100 gift card
🥈 Runner-up: Featured in gallery + Premium account
🥉 Third Place: Custom artist badge

SUBMISSION REQUIREMENTS:
• Original artwork only
• High resolution (min 2000px width)
• Include brief description
• Credit any references used
• One entry per category

Share your Cybertron-inspired creations with the community! 🤖✨`,
          // imageUrl removed to prevent external fetch in guest mode
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          universeTag: 'Transformers',
          category: 'Art Contest',
          participants: 156,
          maxParticipants: 300,
          isRSVP: false,
          isBookmarked: false,
          location: 'Virtual Event',
        },
        {
          id: '4',
          title: 'Star Wars Universe Workshop: World Building 101',
          description: 'Learn the art of world-building from experienced writers. Perfect for creating your own corners of the Star Wars galaxy!',
          fullDescription: `⭐ Star Wars World-Building Workshop ⭐

Master the art of creating compelling worlds and expanding the Star Wars universe with this comprehensive workshop!

WORKSHOP TOPICS:
• Developing unique planets and cultures
• Creating believable alien species
• Designing technology and vehicles
• Writing authentic dialogue
• Maintaining canon consistency
• Building compelling conflicts

INSTRUCTORS:
Two veteran Star Wars fan fiction writers with combined 15+ years of experience!

WORKSHOP FORMAT:
• 90-minute interactive session
• Live demonstrations
• Q&A throughout
• Downloadable resources
• Group brainstorming exercises
• One-on-one feedback opportunities

WHO SHOULD ATTEND:
Writers of all levels interested in Star Wars fan fiction or original sci-fi world-building!

Limited spots available - RSVP now! May the Force be with you! 🌟`,
          // imageUrl removed to prevent external fetch errors in guest mode
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          universeTag: 'Star Wars',
          category: 'Workshop',
          participants: 89,
          maxParticipants: 150,
          isRSVP: false,
          isBookmarked: false,
          location: 'Virtual Event',
        },
        {
          id: '5',
          title: 'Monthly Original Universe Showcase',
          description: 'Present your original universe to the community! Get feedback, find collaborators, and inspire others with your unique creations.',
          fullDescription: `🌍 Original Universe Showcase Event! 🌍

Share your original universe with the Fictionverse community! Whether you're looking for feedback, collaborators, or just want to inspire others, this is your chance to shine!

EVENT STRUCTURE:
• 10-minute presentations per creator
• 5-minute Q&A after each presentation
• Networking session at the end
• Optional: Request specific feedback

WHAT TO PRESENT:
• Your universe's core concept
• Key characters and factions
• Unique elements and themes
• World-building highlights
• Story opportunities

WHY PARTICIPATE:
✨ Get valuable feedback from the community
✨ Find potential co-authors or artists
✨ Build your audience
✨ Network with other creators
✨ Inspire and be inspired!

BEST PRESENTATION AWARD:
Voted by attendees - winner gets featured on homepage for a week!

Prepare a 10-minute presentation and join us! 🎤`,
          // imageUrl removed to prevent external fetch in guest mode
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          status: 'upcoming',
          universeTag: 'Original Universe',
          category: 'Community Meetup',
          participants: 67,
          maxParticipants: 100,
          isRSVP: false,
          isBookmarked: true,
          location: 'Virtual Event',
        },
        {
          id: '6',
          title: 'DC Comics Speed Writing Sprint',
          description: 'Write a complete short story in 3 hours! Fast-paced, fun, and a great way to challenge yourself and meet other writers.',
          fullDescription: `⚡ DC Comics Speed Writing Sprint! ⚡

Challenge yourself with this intense 3-hour writing sprint! Write a complete DC Comics-inspired short story from start to finish!

SPRINT DETAILS:
Duration: 3 hours
Goal: Complete short story (1,000-3,000 words)
Theme: DC Comics Universe
Focus: Speed and creativity over perfection!

SPRINT SCHEDULE:
Hour 1: Planning and outlining
Hour 2: Writing sprint (with breaks)
Hour 3: Final sprint and wrap-up

WRITING PROMPTS PROVIDED:
We'll give you 3 prompts to choose from at the start!

WHY JOIN:
💪 Push your writing speed
💪 Practice finishing stories
💪 Get immediate feedback
💪 Win participation badges
💪 Have fun with the community!

AFTER THE SPRINT:
• Share your story (optional)
• Get instant feedback
• Vote for favorite stories
• Winners get spotlight features

All skill levels welcome! The goal is to have fun and write! 📝✨`,
          // imageUrl removed to prevent external fetch errors in guest mode
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
          status: 'past',
          universeTag: 'DC Comics',
          category: 'Writing Challenge',
          participants: 342,
          maxParticipants: 500,
          isRSVP: false,
          isBookmarked: false,
          location: 'Virtual Event',
        },
      ];

      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        const isCurrentlyRSVP = event.isRSVP;
        return {
          ...event,
          isRSVP: !isCurrentlyRSVP,
          participants: isCurrentlyRSVP ? event.participants - 1 : event.participants + 1,
        };
      }
      return event;
    }));

    // Update selected event if it's open
    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        isRSVP: !selectedEvent.isRSVP,
        participants: selectedEvent.isRSVP ? selectedEvent.participants - 1 : selectedEvent.participants + 1,
      });
    }
  };

  const handleBookmark = (eventId: string) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return { ...event, isBookmarked: !event.isBookmarked };
      }
      return event;
    }));

    // Update selected event if it's open
    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        isBookmarked: !selectedEvent.isBookmarked,
      });
    }
  };

  const handleShare = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      // In production, this would copy a shareable link
      alert(`Event link copied! Share "${event.title}" with your friends!`);
    }
  };

  const handleEventClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  };

  // Filter and sort events
  let filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.universeTag?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    return matchesFilter && matchesSearch;
  });

  // Sort events
  if (sortBy === 'date') {
    filteredEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  } else if (sortBy === 'popular') {
    filteredEvents.sort((a, b) => b.participants - a.participants);
  } else if (sortBy === 'universe') {
    filteredEvents.sort((a, b) => (a.universeTag || '').localeCompare(b.universeTag || ''));
  }

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const ongoingCount = events.filter((e) => e.status === 'ongoing').length;
  const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Stats */}
      {(upcomingCount > 0 || ongoingCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {ongoingCount > 0 && (
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 border-2 sm:border-4 border-green-400 rounded-lg sm:rounded-xl animate-pulse">
              <span className="text-white font-black uppercase tracking-wide text-sm sm:text-base">
                🔴 {ongoingCount} Live Now!
              </span>
            </div>
          )}
          {upcomingCount > 0 && (
            <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 border-2 sm:border-4 border-blue-400 rounded-lg sm:rounded-xl">
              <span className="text-white font-black uppercase tracking-wide text-sm sm:text-base">
                📅 {upcomingCount} Coming Soon
              </span>
            </div>
          )}
        </div>
      )}

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" strokeWidth={3} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 focus:border-green-500 rounded-xl text-white placeholder-gray-500 focus:outline-none font-bold text-sm sm:text-base"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 hover:border-blue-500 rounded-xl text-white font-black uppercase transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Filter className="w-5 h-5" strokeWidth={3} />
            Sort
          </button>

          {showSortMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSortMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden">
                {[
                  { value: 'date' as const, label: 'By Date' },
                  { value: 'popular' as const, label: 'Most Popular' },
                  { value: 'universe' as const, label: 'By Universe' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors font-bold text-sm ${
                      sortBy === option.value
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { 
            icon: TrendingUp, 
            value: events.length, 
            label: 'Total Events',
            gradient: 'from-blue-600 to-cyan-500',
            border: 'border-blue-400'
          },
          { 
            icon: Users, 
            value: totalParticipants, 
            label: 'Participants',
            gradient: 'from-purple-600 to-pink-600',
            border: 'border-purple-400'
          },
          { 
            icon: Award, 
            value: upcomingCount, 
            label: 'Upcoming',
            gradient: 'from-green-600 to-emerald-500',
            border: 'border-green-400'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`relative overflow-hidden rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-2 sm:border-4 ${stat.border} bg-gradient-to-br ${stat.gradient}`}>
              <div className="absolute inset-0 opacity-20" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                     backgroundSize: '10px 10px'
                   }} 
              />
              <div className="relative p-3 sm:p-6 space-y-1 sm:space-y-3">
                <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" strokeWidth={3} />
                <div className="text-xl sm:text-4xl font-black text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white font-bold uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {(['all', 'upcoming', 'ongoing', 'past'] as EventStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all border-2 sm:border-4 font-black uppercase whitespace-nowrap text-sm sm:text-base ${
              filter === status
                ? 'bg-gradient-to-r from-red-600 to-orange-500 border-yellow-400 text-white shadow-lg'
                : 'bg-slate-800 border-slate-700 text-gray-300 hover:border-blue-500'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 transform -skew-x-3 rounded-lg" />
            <h2 className="relative text-2xl sm:text-3xl font-black text-white uppercase tracking-tight px-4 sm:px-6 py-2 sm:py-3">
              {filter === 'all' ? 'All Events' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Events`}
            </h2>
          </div>
          <span className="text-yellow-400 font-black text-sm sm:text-lg">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'EVENT' : 'EVENTS'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onBookmark={handleBookmark}
                onClick={handleEventClick}
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
              <div className="inline-block p-5 rounded-2xl bg-yellow-500/20 border-2 sm:border-4 border-yellow-500">
                <Calendar className="w-12 h-12 text-yellow-400" strokeWidth={3} />
              </div>
              <div className="space-y-2">
                <p className="text-xl sm:text-2xl text-white font-black uppercase">No {filter !== 'all' && filter} Events Found</p>
                <p className="text-gray-400 font-bold text-sm sm:text-base">Check back later for epic challenges and activities!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        onRSVP={handleRSVP}
        onBookmark={handleBookmark}
        onShare={handleShare}
      />
    </div>
  );
}