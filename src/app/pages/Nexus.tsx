import { Plus, BookMarked, Archive, Sparkles, Layers } from 'lucide-react';
import { useState } from 'react';
import { works } from '../data/mockData';
import { WorkCard } from '../components/WorkCard';
import { SubmissionModal } from '../components/SubmissionModal';

type NexusTab = 'library' | 'archive' | 'inspired' | 'original';

export function Nexus() {
  const [activeTab, setActiveTab] = useState<NexusTab>('inspired');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [savedWorks] = useState(works.slice(0, 4));

  const getTabWorks = () => {
    switch (activeTab) {
      case 'library':
        return savedWorks;
      case 'archive':
        return works.filter((w) => Math.random() > 0.7); // Simulate archive works
      case 'inspired':
        return works.filter((w) => w.type === 'inspired');
      case 'original':
        return works.filter((w) => w.type === 'original');
      default:
        return works;
    }
  };

  const tabs = [
    { 
      id: 'inspired' as NexusTab, 
      label: 'Inspired By', 
      icon: Sparkles,
      description: 'Works inspired by existing universes',
      color: 'from-red-600 to-orange-500'
    },
    { 
      id: 'original' as NexusTab, 
      label: 'Original Works', 
      icon: Layers,
      description: 'Original universes & user-created worlds',
      color: 'from-blue-600 to-cyan-500'
    },
    { 
      id: 'archive' as NexusTab, 
      label: 'Archive', 
      icon: Archive,
      description: 'Historical & older titles',
      color: 'from-green-600 to-emerald-500'
    },
    { 
      id: 'library' as NexusTab, 
      label: 'My Library', 
      icon: BookMarked,
      description: 'Your saved & favorite works',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  const tabWorks = getTabWorks();
  const activeTabInfo = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowSubmissionModal(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl border-4 border-blue-400 text-white font-black uppercase shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" strokeWidth={3} />
            Submit Work
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Works', value: works.length, gradient: 'from-purple-600 to-pink-500', border: 'border-purple-400' },
          { label: 'Inspired', value: works.filter((w) => w.type === 'inspired').length, gradient: 'from-red-600 to-orange-500', border: 'border-red-400' },
          { label: 'Original', value: works.filter((w) => w.type === 'original').length, gradient: 'from-blue-600 to-cyan-500', border: 'border-blue-400' },
          { label: 'In Library', value: savedWorks.length, gradient: 'from-yellow-500 to-orange-500', border: 'border-yellow-400' },
        ].map((stat, index) => (
          <div key={index} className={`relative group overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 border-4 ${stat.border} bg-gradient-to-br ${stat.gradient}`}>
            <div className="absolute inset-0 opacity-20" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                   backgroundSize: '10px 10px'
                 }} 
            />
            <div className="relative p-6 text-center space-y-2">
              <div className="text-4xl font-black text-white">
                {stat.value}
              </div>
              <div className="text-sm text-white font-bold uppercase tracking-wide">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs - Library Sections */}
      <div className="relative overflow-hidden rounded-xl border-4 border-slate-700 bg-slate-800">
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative group flex flex-col items-center gap-2 px-4 py-5 rounded-lg transition-all duration-300 border-2 ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} border-yellow-400 text-white shadow-lg`
                    : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-blue-500'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={3} />
                <div className="text-center">
                  <div className="font-black uppercase text-sm">{tab.label}</div>
                  {!isActive && (
                    <div className="text-xs text-gray-400 mt-1 hidden md:block">{tab.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Description */}
      {activeTabInfo && (
        <div className={`relative overflow-hidden rounded-xl border-4 border-yellow-400 bg-gradient-to-r ${activeTabInfo.color} p-6`}>
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                 backgroundSize: '15px 15px'
               }} 
          />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm border-2 border-white/40">
              {(() => {
                const Icon = activeTabInfo.icon;
                return <Icon className="w-8 h-8 text-white" strokeWidth={3} />;
              })()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">{activeTabInfo.label}</h3>
              <p className="text-white/90 font-bold">{activeTabInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {tabWorks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tabWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-20 overflow-hidden rounded-xl border-4 border-slate-700">
            <div className="absolute inset-0 bg-slate-800" />
            <div className="relative space-y-6">
              <div className="text-6xl">📚</div>
              <div className="space-y-2">
                <p className="text-2xl text-white font-black uppercase">No Works in This Section Yet</p>
                <p className="text-gray-400 font-bold">
                  {activeTab === 'library' 
                    ? 'Start Saving Works to Your Library' 
                    : activeTab === 'archive'
                    ? 'Archive Will Be Populated Soon'
                    : 'Be the First to Submit!'}
                </p>
              </div>
              {activeTab !== 'library' && activeTab !== 'archive' && (
                <button
                  onClick={() => setShowSubmissionModal(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 border-4 border-yellow-400 text-white font-black uppercase shadow-lg hover:shadow-red-500/50 transition-all hover:scale-105 hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} />
                  Submit Your Work
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <SubmissionModal
        isOpen={showSubmissionModal}
        onClose={() => setShowSubmissionModal(false)}
        onSubmit={(data) => {
          console.log('Submission:', data);
          alert('Work submitted successfully!');
        }}
      />
    </div>
  );
}