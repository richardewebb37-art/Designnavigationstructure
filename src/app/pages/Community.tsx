import { Search, Plus, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { threads } from '../data/mockData';
import { ThreadCard } from '../components/ThreadCard';

export function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Action */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowNewPost(true)}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl border-4 border-yellow-400 text-white font-black uppercase shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" strokeWidth={3} />
            New Post
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <div className="relative flex items-center">
          <div className="absolute inset-0 bg-slate-800 border-4 border-slate-700 group-focus-within:border-green-500 rounded-xl transition-colors" />
          <Search className="absolute left-6 w-6 h-6 text-green-400" strokeWidth={3} />
          <input
            type="text"
            placeholder="SEARCH DISCUSSIONS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="relative w-full pl-16 pr-6 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none font-bold uppercase tracking-wide"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            icon: MessageSquare, 
            value: threads.length, 
            label: 'Active Threads',
            gradient: 'from-blue-600 to-cyan-500',
            border: 'border-blue-400'
          },
          { 
            icon: TrendingUp, 
            value: threads.sort((a, b) => b.likes - a.likes)[0]?.likes || 0, 
            label: 'Top Trending',
            gradient: 'from-red-600 to-orange-500',
            border: 'border-red-400'
          },
          { 
            icon: Users, 
            value: threads.reduce((sum, thread) => sum + thread.replies, 0), 
            label: 'Total Replies',
            gradient: 'from-green-600 to-emerald-500',
            border: 'border-green-400'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 border-4 ${stat.border} bg-gradient-to-br ${stat.gradient}`}>
              <div className="absolute inset-0 opacity-20" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                     backgroundSize: '10px 10px'
                   }} 
              />
              <div className="relative p-6 space-y-3">
                <Icon className="w-8 h-8 text-white" strokeWidth={3} />
                <div className="text-4xl font-black text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white font-bold uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussions */}
      <div className="space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform -skew-x-3 rounded-lg" />
          <h2 className="relative text-3xl font-black text-white uppercase tracking-tight px-6 py-3">Recent Discussions</h2>
        </div>
        
        {filteredThreads.length > 0 ? (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-20 overflow-hidden rounded-xl border-4 border-slate-700">
            <div className="absolute inset-0 bg-slate-800" />
            <div className="relative space-y-4">
              <div className="text-6xl">💬</div>
              <p className="text-2xl text-white font-black uppercase">No Discussions Found</p>
              <p className="text-gray-400 font-bold">Try a Different Search or Start a New Thread</p>
            </div>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewPost(false)} />
          
          <div className="relative max-w-lg w-full overflow-hidden rounded-2xl border-4 border-yellow-400">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
            
            <div className="relative p-8 space-y-6">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                Create New Post
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-black text-yellow-400 uppercase tracking-wide text-sm">Title</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700 border-2 border-slate-600 rounded-lg" />
                    <input
                      type="text"
                      className="relative w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none font-bold"
                      placeholder="What's on your mind?"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block font-black text-yellow-400 uppercase tracking-wide text-sm">Content</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700 border-2 border-slate-600 rounded-lg" />
                    <textarea
                      className="relative w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none h-32 resize-none font-bold"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-slate-700 border-2 border-slate-600 text-white font-black uppercase hover:bg-slate-600 transition-all hover:scale-105"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowNewPost(false);
                      alert('Post created!');
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 border-2 border-yellow-400 text-white font-black uppercase transition-all hover:scale-105 shadow-lg hover:shadow-red-500/50"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}