import { Heart, MessageCircle, Share2, BookmarkPlus, ArrowLeft, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { works } from '../data/mockData';

export function StoryDetail() {
  const { selectedStoryId, setCurrentPage, storyProgress, updateStoryProgress } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [readingProgress, setReadingProgress] = useState(0);

  const story = works.find(w => w.id === selectedStoryId);

  useEffect(() => {
    if (story) {
      const progress = storyProgress.find(p => p.storyId === story.id);
      if (progress) {
        setReadingProgress(progress.progress);
      }
    }
  }, [story, storyProgress]);

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-white font-bold text-xl">Story not found</p>
        <button
          onClick={() => setCurrentPage('nexus')}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black rounded-xl"
        >
          Back to Nexus
        </button>
      </div>
    );
  }

  const totalChapters = 15; // Mock data
  const mockChapterContent = `
    The stars gleamed against the infinite darkness of space as the ship drifted silently through the void. Commander Sarah Chen stood at the viewport, her reflection ghostly against the cosmic backdrop. It had been three months since they left Earth, and the mysteries of the universe were only beginning to reveal themselves.

    "Commander, we're approaching the anomaly," Lieutenant Rodriguez's voice crackled through the comm system. Sarah turned from the window, her mind racing with possibilities. This was what they had come for—the strange energy signature that had been detected from the outer rim.

    The bridge hummed with activity as the crew prepared for their first close encounter with the unknown. Sarah took her position in the captain's chair, feeling the weight of responsibility settle on her shoulders. Whatever they found out here could change everything humanity thought it knew about the universe.

    "All stations report ready, Commander," Rodriguez said, his fingers dancing across the holographic display.

    "Take us in," Sarah commanded, her voice steady despite the adrenaline coursing through her veins. "Nice and slow."

    The ship moved forward, its engines barely a whisper as they approached the swirling mass of energy ahead. Colors that had no name danced across its surface, beautiful and terrifying in equal measure. Sarah leaned forward in her chair, unable to tear her eyes away from the sight.

    This was just the beginning of their journey into the unknown...
  `;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollProgress = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    if (scrollProgress > readingProgress) {
      setReadingProgress(Math.min(100, scrollProgress));
      updateStoryProgress(story.id, Math.min(100, scrollProgress));
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('nexus')}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl border-2 border-slate-600 hover:border-yellow-400 transition-all text-white font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Nexus
      </button>

      {/* Story Header */}
      <div className="relative mb-8 p-8 rounded-2xl border-4 border-yellow-400 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="font-black text-4xl text-white mb-2 tracking-tight">{story.title}</h1>
              <p className="text-xl text-yellow-400 font-bold mb-3">by {story.author}</p>
              {story.universe && (
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg border-2 border-purple-400 text-white font-bold text-sm">
                  {story.universe} Universe
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-lg mb-6 leading-relaxed">{story.description}</p>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <Heart className="w-5 h-5" />
              <span className="font-bold">{story.likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Eye className="w-5 h-5" />
              <span className="font-bold">12.4K views</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Clock className="w-5 h-5" />
              <span className="font-bold">45 min read</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold">234 comments</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-700 border-2 border-slate-600 rounded-lg text-sm font-bold text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                isLiked
                  ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 ${
                isBookmarked
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 border-yellow-400 text-white'
                  : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-yellow-400'
              }`}
            >
              <BookmarkPlus className="w-5 h-5" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl border-2 border-slate-600 hover:border-blue-400 text-slate-300 font-bold transition-all">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>

          {/* Reading Progress */}
          {readingProgress > 0 && (
            <div className="mt-6 p-4 bg-blue-900/30 border-2 border-blue-400 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-400">Reading Progress</span>
                <span className="text-sm font-bold text-blue-400">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Navigation */}
      <div className="mb-6 p-4 bg-slate-800 rounded-xl border-2 border-slate-600 flex items-center justify-between">
        <button
          onClick={() => setCurrentChapter(Math.max(1, currentChapter - 1))}
          disabled={currentChapter === 1}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg text-white font-bold disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <div className="text-center">
          <span className="text-white font-black text-lg">Chapter {currentChapter}</span>
          <span className="text-slate-400 font-bold"> of {totalChapters}</span>
        </div>
        <button
          onClick={() => setCurrentChapter(Math.min(totalChapters, currentChapter + 1))}
          disabled={currentChapter === totalChapters}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg text-white font-bold disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Reading Area */}
      <div
        onScroll={handleScroll}
        className="relative p-8 md:p-12 bg-slate-800/50 rounded-2xl border-2 border-slate-600 max-h-[600px] overflow-y-auto prose prose-invert max-w-none"
      >
        <h2 className="font-black text-2xl text-yellow-400 mb-6">Chapter {currentChapter}: The Discovery</h2>
        <div className="text-slate-200 text-lg leading-relaxed space-y-4">
          {mockChapterContent.split('\n\n').map((paragraph, idx) => (
            paragraph.trim() && <p key={idx}>{paragraph.trim()}</p>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 p-6 bg-slate-800 rounded-2xl border-2 border-slate-600">
        <h3 className="font-black text-2xl text-white mb-6">Comments (234)</h3>
        <div className="space-y-4">
          {[
            { author: 'CosmicReader', avatar: '🚀', comment: 'This is absolutely incredible! The pacing is perfect and the world-building is phenomenal.', time: '2 hours ago' },
            { author: 'SciFiFan99', avatar: '🌟', comment: 'Can\'t wait for the next chapter! The cliffhanger is killing me!', time: '5 hours ago' },
            { author: 'StarGazer', avatar: '⭐', comment: 'Your character development is outstanding. Sarah feels so real!', time: '1 day ago' }
          ].map((comment, idx) => (
            <div key={idx} className="p-4 bg-slate-700/50 rounded-xl border border-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-2xl">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{comment.author}</span>
                    <span className="text-xs text-slate-400">{comment.time}</span>
                  </div>
                  <p className="text-slate-300">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-4 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-xl text-white placeholder-slate-400 font-medium resize-none"
            rows={3}
          />
          <button className="mt-3 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl text-white font-black border-2 border-yellow-400 transition-all">
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}
