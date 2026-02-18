import { TrendingUp, Plus, Zap, Star, Flame } from 'lucide-react';
import { works, universes } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { UniverseChip } from '../components/UniverseChip';

export function Dashboard() {
  const featuredWorks = works.slice(0, 3);
  const latestWorks = works.slice(3, 6);
  const trendingUniverses = universes.slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Hero Section - Comic Book Style */}
      <section className="relative py-12 overflow-hidden rounded-2xl border-4 border-yellow-400">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500" />
        
        {/* Comic book halftone effect */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
               backgroundSize: '20px 20px'
             }} 
        />
        
        {/* Action lines */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 15px, #fff 15px, #fff 17px)',
             }}
        />
        
        <div className="relative z-10 text-center space-y-6 px-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-sm border-2 border-yellow-400">
            <Zap className="w-5 h-5 text-yellow-300" strokeWidth={3} />
            <span className="text-sm text-white font-black uppercase tracking-wider">Fan Content Universe</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none"
                style={{ 
                  textShadow: '3px 3px 0 rgba(0,0,0,0.5), -2px -2px 0 rgba(255,215,0,0.3)'
                }}>
              Unleash Your Creativity
            </h1>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-black transform skew-x-[-10deg]" />
              <p className="relative text-lg sm:text-xl md:text-2xl text-yellow-300 font-black uppercase tracking-wide px-6 py-2">
                Where Fan Legends Are Born
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-4 justify-center pt-2 flex-wrap">
            <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 rounded-xl border-4 border-blue-400 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
              <div className="flex items-center gap-2 text-white font-black uppercase text-sm sm:text-base">
                <Plus className="w-5 h-5" strokeWidth={3} />
                Create Story
              </div>
            </button>
            
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-900 rounded-xl border-4 border-slate-900 font-black uppercase shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-sm sm:text-base">
              Explore Worlds
            </button>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 transform -skew-x-6 rounded-lg" />
          <div className="relative flex items-center gap-3 px-6 py-3">
            <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" strokeWidth={3} />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Featured Works</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* Latest Submissions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 transform -skew-x-6 rounded-lg" />
            <h2 className="relative text-3xl font-black text-white uppercase tracking-tight px-6 py-3">Latest Submissions</h2>
          </div>
          <button className="px-4 py-2 bg-yellow-400 text-slate-900 rounded-lg border-2 border-yellow-500 font-black uppercase text-sm hover:bg-yellow-300 transition-all hover:scale-105">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      {/* Trending Universes */}
      <section className="space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 transform -skew-x-6 rounded-lg" />
          <div className="relative flex items-center gap-3 px-6 py-3">
            <Flame className="w-7 h-7 text-orange-400" strokeWidth={3} />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Trending Universes</h2>
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {trendingUniverses.map((universe) => (
            <UniverseChip key={universe.id} universe={universe} />
          ))}
        </div>
      </section>
    </div>
  );
}