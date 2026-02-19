import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storyAPI } from '../utils/api';
import { universes } from '../data/mockData';

export function StoryEditor() {
  const { selectedStoryId, setCurrentPage, setSelectedStoryId } = useApp();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'original' | 'inspired'>('original');
  const [universe, setUniverse] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [chapters, setChapters] = useState<{ title: string; content: string }[]>([
    { title: 'Chapter 1', content: '' }
  ]);
  const [activeChapter, setActiveChapter] = useState(0);
  
  useEffect(() => {
    if (selectedStoryId) {
      loadStory();
    }
  }, [selectedStoryId]);
  
  const loadStory = async () => {
    if (!selectedStoryId) return;
    
    setLoading(true);
    try {
      const { story } = await storyAPI.getById(selectedStoryId);
      setTitle(story.title);
      setDescription(story.description);
      setType(story.type);
      setUniverse(story.universe || '');
      setTags(story.tags || []);
      setChapters(story.chapters?.length > 0 ? story.chapters : [{ title: 'Chapter 1', content: '' }]);
    } catch (error: any) {
      console.error('Failed to load story:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to load story' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleAddChapter = () => {
    setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, content: '' }]);
    setActiveChapter(chapters.length);
  };
  
  const handleRemoveChapter = (index: number) => {
    if (chapters.length === 1) {
      setMessage({ type: 'error', text: 'Story must have at least one chapter' });
      return;
    }
    
    setChapters(chapters.filter((_, i) => i !== index));
    if (activeChapter >= chapters.length - 1) {
      setActiveChapter(Math.max(0, activeChapter - 1));
    }
  };
  
  const handleUpdateChapter = (index: number, field: 'title' | 'content', value: string) => {
    const newChapters = [...chapters];
    newChapters[index][field] = value;
    setChapters(newChapters);
  };
  
  const handleSave = async (isDraft: boolean = false) => {
    setLoading(true);
    setMessage(null);
    
    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required' });
      setLoading(false);
      return;
    }
    
    if (!description.trim()) {
      setMessage({ type: 'error', text: 'Description is required' });
      setLoading(false);
      return;
    }
    
    try {
      const storyData = {
        title,
        description,
        type,
        universe: type === 'inspired' ? universe : undefined,
        tags,
        chapters,
        status: isDraft ? 'draft' : 'published',
      };
      
      if (selectedStoryId) {
        await storyAPI.update(selectedStoryId, storyData);
        setMessage({ type: 'success', text: 'Story updated successfully!' });
      } else {
        const { story } = await storyAPI.create(storyData);
        setSelectedStoryId(story.id);
        setMessage({ type: 'success', text: 'Story created successfully!' });
      }
      
      setTimeout(() => {
        setCurrentPage('profile');
      }, 2000);
    } catch (error: any) {
      console.error('Error saving story:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save story' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedStoryId) return;
    
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    try {
      await storyAPI.delete(selectedStoryId);
      setMessage({ type: 'success', text: 'Story deleted successfully' });
      setTimeout(() => {
        setCurrentPage('profile');
      }, 1500);
    } catch (error: any) {
      console.error('Error deleting story:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete story' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('profile')}
        className="mb-2 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border-2 border-slate-600 hover:border-yellow-400 transition-all text-white font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Profile
      </button>

      {/* Header */}
      <div className="relative p-6 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        <h1 className="font-black text-3xl text-white tracking-tight">
          {selectedStoryId ? 'Edit Story' : 'Create New Story'}
        </h1>
        <p className="text-slate-400 font-bold">
          {selectedStoryId ? 'Update your existing work' : 'Share your creative vision with the world'}
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-xl border-2 ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-400 text-green-400' 
            : 'bg-red-900/30 border-red-400 text-red-400'
        }`}>
          <p className="font-bold">{message.text}</p>
        </div>
      )}

      {/* Form */}
      <div className="p-8 bg-slate-800 rounded-2xl border-2 border-slate-600 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white font-bold mb-2">Story Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-bold outline-none transition-all"
            placeholder="Enter your story title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white font-bold mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-medium outline-none transition-all resize-none"
            placeholder="Describe your story..."
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-white font-bold mb-2">Story Type</label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setType('original');
                setUniverse('');
              }}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                type === 'original'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-blue-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400'
              }`}
            >
              Original Work
            </button>
            <button
              onClick={() => setType('inspired')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                type === 'inspired'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-purple-400'
              }`}
            >
              Inspired By Universe
            </button>
          </div>
        </div>

        {/* Universe (if inspired) */}
        {type === 'inspired' && (
          <div>
            <label className="block text-white font-bold mb-2">Universe</label>
            <div className="flex flex-wrap gap-2">
              {universes.map(u => (
                <button
                  key={u.id}
                  onClick={() => setUniverse(u.name)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all border-2 ${
                    universe === u.name
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-400 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-purple-400'
                  }`}
                >
                  {u.icon} {u.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block text-white font-bold mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-medium outline-none transition-all"
              placeholder="Add a tag and press Enter"
            />
            <button
              onClick={handleAddTag}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white font-bold border-2 border-green-400 transition-all hover:from-green-500 hover:to-green-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-700 border-2 border-slate-600 rounded-lg text-sm font-bold text-slate-300 flex items-center gap-2"
              >
                #{tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-white font-bold">Chapters</label>
            <button
              onClick={handleAddChapter}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white font-bold text-sm border-2 border-blue-400 transition-all hover:from-blue-500 hover:to-blue-600"
            >
              <Plus className="w-4 h-4" />
              Add Chapter
            </button>
          </div>

          {/* Chapter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setActiveChapter(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all border-2 ${
                  activeChapter === index
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                {chapter.title}
                {chapters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveChapter(index);
                    }}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </button>
            ))}
          </div>

          {/* Chapter Editor */}
          <div className="space-y-4 p-6 bg-slate-700/50 rounded-xl border-2 border-slate-600">
            <input
              type="text"
              value={chapters[activeChapter]?.title || ''}
              onChange={(e) => handleUpdateChapter(activeChapter, 'title', e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-bold outline-none transition-all"
              placeholder="Chapter title"
            />
            <textarea
              value={chapters[activeChapter]?.content || ''}
              onChange={(e) => handleUpdateChapter(activeChapter, 'content', e.target.value)}
              rows={15}
              className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white font-medium outline-none transition-all resize-none"
              placeholder="Write your chapter content here..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-black border-2 border-green-400 disabled:border-slate-600 transition-all disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Publish Story'}
          </button>
          
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 rounded-xl text-white font-bold border-2 border-slate-600 disabled:border-slate-700 transition-all disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>

          {selectedStoryId && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="ml-auto flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 rounded-xl text-white font-black border-2 border-red-400 disabled:border-slate-600 transition-all disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Delete Story
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
