import { Home, Compass, Layers, Users, Calendar, Search } from 'lucide-react';
import { Page } from '../context/AppContext';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Home', color: 'red' },
    { id: 'discover' as Page, icon: Compass, label: 'Discover', color: 'blue' },
    { id: 'nexus' as Page, icon: Layers, label: 'Nexus', color: 'yellow' },
    { id: 'community' as Page, icon: Users, label: 'Community', color: 'green' },
    { id: 'events' as Page, icon: Calendar, label: 'Events', color: 'orange' },
    { id: 'search' as Page, icon: Search, label: 'Search', color: 'purple' },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors: any = {
      red: {
        bg: 'from-red-600 to-red-700',
        border: 'border-red-400',
        text: 'text-red-400',
        shadow: 'shadow-red-500/50'
      },
      blue: {
        bg: 'from-blue-600 to-blue-700',
        border: 'border-blue-400',
        text: 'text-blue-400',
        shadow: 'shadow-blue-500/50'
      },
      yellow: {
        bg: 'from-yellow-500 to-orange-500',
        border: 'border-yellow-400',
        text: 'text-yellow-400',
        shadow: 'shadow-yellow-500/50'
      },
      green: {
        bg: 'from-green-600 to-emerald-600',
        border: 'border-green-400',
        text: 'text-green-400',
        shadow: 'shadow-green-500/50'
      },
      orange: {
        bg: 'from-orange-600 to-red-600',
        border: 'border-orange-400',
        text: 'text-orange-400',
        shadow: 'shadow-orange-500/50'
      },
      purple: {
        bg: 'from-purple-600 to-purple-700',
        border: 'border-purple-400',
        text: 'text-purple-400',
        shadow: 'shadow-purple-500/50'
      }
    };
    return colors[color];
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-24 z-50">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl border-t-4 border-blue-500" />
      {/* Comic book accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
      
      <div className="relative h-full flex items-center justify-around max-w-3xl mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const colorClasses = getColorClasses(item.color, isActive);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center gap-1.5 py-2 px-2 transition-all group"
            >
              {isActive && (
                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${colorClasses.bg} rounded-full`} />
              )}
              
              <div className={`relative p-2.5 rounded-lg transition-all border-2 ${
                isActive 
                  ? `bg-gradient-to-br ${colorClasses.bg} ${colorClasses.border} shadow-lg ${colorClasses.shadow}` 
                  : 'bg-slate-700/50 border-slate-600 group-hover:border-gray-400'
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`} strokeWidth={2.5} />
              </div>
              
              <span className={`text-[10px] font-bold uppercase tracking-wide transition-all ${
                isActive ? colorClasses.text : 'text-gray-500 group-hover:text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}