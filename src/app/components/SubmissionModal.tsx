import { X } from 'lucide-react';
import { useState } from 'react';
import { universes } from '../data/mockData';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function SubmissionModal({ isOpen, onClose, onSubmit }: SubmissionModalProps) {
  const [formData, setFormData] = useState({
    type: 'original' as 'original' | 'inspired',
    title: '',
    author: '',
    universe: '',
    source: '',
    description: '',
    tags: '',
    agreed: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Please agree to the terms');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-purple-500/30">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Submit Your Work
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-purple-500/50"
            >
              <X className="w-5 h-5 text-purple-300" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Work Type */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Work Type</label>
              <div className="grid grid-cols-2 gap-4">
                {['original', 'inspired'].map((type) => (
                  <label key={type} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={() => setFormData({ ...formData, type: type as any })}
                      className="sr-only peer"
                    />
                    <div className="relative p-6 rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105">
                      <div className="absolute inset-0 bg-slate-700/50 border-2 border-purple-500/20 peer-checked:border-purple-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-500/20 peer-checked:to-pink-500/20" />
                      <div className="relative text-center">
                        <div className="text-3xl mb-2">{type === 'original' ? '✨' : '🌟'}</div>
                        <div className="font-semibold text-white capitalize">{type}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Title */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Title *</label>
              <div className="relative">
                <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 focus:outline-none"
                  placeholder="Enter your work title"
                />
              </div>
            </div>
            
            {/* Author */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Author Name *</label>
              <div className="relative">
                <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 focus:outline-none"
                  placeholder="Your pen name"
                />
              </div>
            </div>
            
            {/* Inspired Fields */}
            {formData.type === 'inspired' && (
              <>
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-white">Universe *</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                    <select
                      required
                      value={formData.universe}
                      onChange={(e) => setFormData({ ...formData, universe: e.target.value })}
                      className="relative w-full px-4 py-3 bg-transparent text-white focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">Select a universe</option>
                      {universes.filter(u => u.name !== 'Original').map((universe) => (
                        <option key={universe.id} value={universe.name} className="bg-slate-800">
                          {universe.icon} {universe.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-white">Source *</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                    <input
                      type="text"
                      required={formData.type === 'inspired'}
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 focus:outline-none"
                      placeholder="Original work/creator"
                    />
                  </div>
                </div>
              </>
            )}
            
            {/* Description */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Description</label>
              <div className="relative">
                <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 focus:outline-none h-24 resize-none"
                  placeholder="Brief description"
                />
              </div>
            </div>
            
            {/* Tags */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-white">Tags</label>
              <div className="relative">
                <div className="absolute inset-0 bg-slate-700/50 backdrop-blur-xl border border-purple-500/30 rounded-xl" />
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="relative w-full px-4 py-3 bg-transparent text-white placeholder-purple-300/50 focus:outline-none"
                  placeholder="fantasy, romance, adventure"
                />
              </div>
            </div>
            
            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded border-purple-500/50 bg-slate-700/50 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-sm text-purple-200/80 leading-relaxed">
                I agree that my work respects copyright and originality guidelines, and I have the right to publish this content.
              </span>
            </label>
            
            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="relative flex-1 px-6 py-4 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-slate-700/50 border border-purple-500/20" />
                <span className="relative text-white font-semibold">Cancel</span>
              </button>
              
              <button
                type="submit"
                className="relative flex-1 px-6 py-4 rounded-xl overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-white font-semibold">Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
