import { Heart, Users, Book, Calendar, Settings, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { works } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { formatDistanceToNow } from 'date-fns';

export function Profile() {
  const { currentUser, setCurrentPage, setSelectedStoryId } = useApp();
  
  // Mock user's published works
  const userWorks = works.filter(w => ['2', '4', '6'].includes(w.id));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="relative p-8 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />
        
        <div className="relative z-10">
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center text-5xl border-4 border-yellow-400 shadow-lg flex-shrink-0">
              {currentUser.avatar}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="font-black text-4xl text-white tracking-tight">{currentUser.displayName}</h1>
                  <p className="text-xl text-yellow-400 font-bold">@{currentUser.username}</p>
                </div>
                <button 
                  onClick={() => setCurrentPage('settings')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl text-white font-black border-2 border-blue-400 transition-all"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </button>
              </div>
              
              <p className="text-slate-300 text-lg mb-4 leading-relaxed max-w-2xl">{currentUser.bio}</p>
              
              <div className="flex items-center gap-2 text-slate-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDistanceToNow(new Date(currentUser.joinDate), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-2xl text-white">{currentUser.worksPublished}</p>
                  <p className="text-sm text-slate-400 font-bold">Works</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-2xl text-white">{currentUser.totalLikes.toLocaleString()}</p>
                  <p className="text-sm text-slate-400 font-bold">Total Likes</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-2xl text-white">{currentUser.followers}</p>
                  <p className="text-sm text-slate-400 font-bold">Followers</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-700/50 rounded-xl border-2 border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-2xl text-white">{currentUser.following}</p>
                  <p className="text-sm text-slate-400 font-bold">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-slate-700">
        <button className="px-6 py-3 font-black text-white bg-gradient-to-b from-slate-700 to-slate-800 border-b-4 border-yellow-400 -mb-0.5">
          Published Works
        </button>
        <button className="px-6 py-3 font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
          Drafts
        </button>
        <button className="px-6 py-3 font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
          Bookmarks
        </button>
        <button className="px-6 py-3 font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
          Activity
        </button>
      </div>

      {/* Published Works Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-black text-2xl text-white">Your Published Works</h2>
          <button 
            onClick={() => {
              setSelectedStoryId(null);
              setCurrentPage('editor');
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-xl text-white font-black border-2 border-green-400 transition-all"
          >
            + New Story
          </button>
        </div>

        {userWorks.length === 0 ? (
          <div className="text-center py-12 p-8 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600">
            <Book className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-lg mb-4">No published works yet</p>
            <button 
              onClick={() => {
                setSelectedStoryId(null);
                setCurrentPage('editor');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-black border-2 border-blue-400"
            >
              Create Your First Story
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userWorks.map(work => (
              <div key={work.id} className="relative">
                <WorkCard 
                  work={work} 
                  onClick={() => {
                    setSelectedStoryId(work.id);
                    setCurrentPage('story');
                  }}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedStoryId(work.id);
                      setCurrentPage('editor');
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg border-2 border-blue-400 transition-all"
                  >
                    <Edit className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg border-2 border-slate-600 hover:border-slate-500 transition-all">
                    <Settings className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="p-6 bg-slate-800 rounded-2xl border-2 border-slate-600">
        <h2 className="font-black text-2xl text-white mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Published a new chapter', story: 'Neon Dreams', time: '3 hours ago', icon: '📝' },
            { action: 'Received 50 new likes', story: 'Chronicles of the Void', time: '1 day ago', icon: '❤️' },
            { action: 'New follower', story: null, time: '2 days ago', icon: '👥' },
            { action: 'Updated story description', story: 'Whispers of Eternity', time: '3 days ago', icon: '✏️' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">
                  {activity.action}
                  {activity.story && <span className="text-yellow-400"> • {activity.story}</span>}
                </p>
                <p className="text-sm text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}