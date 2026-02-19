import { X, Image as ImageIcon, Link as LinkIcon, Tag, Loader } from 'lucide-react';
import { useState } from 'react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    content: string;
    imageUrl?: string;
    universeTag?: string;
    type: 'text' | 'image' | 'link';
    linkUrl?: string;
    linkTitle?: string;
  }) => Promise<void>;
}

const UNIVERSE_OPTIONS = [
  'Marvel',
  'DC Comics',
  'Star Wars',
  'Transformers',
  'G.I. Joe',
  'Harry Potter',
  'Lord of the Rings',
  'Anime/Manga',
  'Original Universe',
  'Other',
];

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [universeTag, setUniverseTag] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUniversePicker, setShowUniversePicker] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Please enter some content for your post');
      return;
    }

    if (postType === 'image' && !imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    if (postType === 'link' && !linkUrl.trim()) {
      alert('Please enter a link URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        imageUrl: postType === 'image' ? imageUrl.trim() : undefined,
        universeTag: universeTag || undefined,
        type: postType,
        linkUrl: postType === 'link' ? linkUrl.trim() : undefined,
        linkTitle: postType === 'link' ? linkTitle.trim() : undefined,
      });
      
      // Reset form
      setContent('');
      setImageUrl('');
      setLinkUrl('');
      setLinkTitle('');
      setUniverseTag('');
      setPostType('text');
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={!isSubmitting ? onClose : undefined} 
      />
      
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl border-2 sm:border-4 border-yellow-400 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 sm:h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-3 right-3 sm:top-6 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-all z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight pr-12">
            Create New Post
          </h2>
          
          {/* Post Type Tabs */}
          <div className="flex gap-2 sm:gap-3">
            {[
              { type: 'text' as const, label: 'Text', icon: '📝' },
              { type: 'image' as const, label: 'Image', icon: '🖼️' },
              { type: 'link' as const, label: 'Link', icon: '🔗' },
            ].map((tab) => (
              <button
                key={tab.type}
                onClick={() => setPostType(tab.type)}
                disabled={isSubmitting}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-black text-xs sm:text-sm uppercase transition-all ${
                  postType === tab.type
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-2 border-yellow-400'
                    : 'bg-slate-700 text-slate-300 border-2 border-slate-600 hover:bg-slate-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Content */}
            <div className="space-y-2">
              <label className="block font-black text-yellow-400 uppercase tracking-wide text-xs sm:text-sm">
                What's on your mind?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-lg text-white placeholder-gray-500 focus:outline-none resize-none font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Share your thoughts with the community..."
                rows={5}
                maxLength={2000}
              />
              <p className="text-xs text-slate-400 text-right">{content.length}/2000</p>
            </div>

            {/* Image URL (if image type) */}
            {postType === 'image' && (
              <div className="space-y-2">
                <label className="block font-black text-yellow-400 uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-lg text-white placeholder-gray-500 focus:outline-none font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="https://example.com/image.jpg"
                />
                {imageUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border-2 border-slate-600">
                    <div className="w-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 flex items-center justify-center p-12">
                      <div className="text-center">
                        <div className="text-6xl mb-3">🖼️</div>
                        <p className="text-sm text-slate-300 font-medium">Image Preview</p>
                        <p className="text-xs text-slate-400 mt-1 break-all px-4">{imageUrl.substring(0, 50)}{imageUrl.length > 50 ? '...' : ''}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Link URL (if link type) */}
            {postType === 'link' && (
              <>
                <div className="space-y-2">
                  <label className="block font-black text-yellow-400 uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Link URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-lg text-white placeholder-gray-500 focus:outline-none font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-black text-yellow-400 uppercase tracking-wide text-xs sm:text-sm">
                    Link Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-lg text-white placeholder-gray-500 focus:outline-none font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Give your link a title"
                  />
                </div>
              </>
            )}

            {/* Universe Tag */}
            <div className="space-y-2">
              <label className="block font-black text-yellow-400 uppercase tracking-wide text-xs sm:text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Universe Tag (Optional)
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUniversePicker(!showUniversePicker)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 focus:border-yellow-400 rounded-lg text-white text-left font-medium text-sm sm:text-base hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {universeTag || 'Select a universe...'}
                </button>

                {showUniversePicker && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUniversePicker(false)} 
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 z-20 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setUniverseTag('');
                          setShowUniversePicker(false);
                        }}
                        className="w-full px-4 py-3 text-left text-slate-400 hover:bg-slate-700 transition-colors font-medium text-sm"
                      >
                        None
                      </button>
                      {UNIVERSE_OPTIONS.map((universe) => (
                        <button
                          key={universe}
                          onClick={() => {
                            setUniverseTag(universe);
                            setShowUniversePicker(false);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors font-medium text-sm"
                        >
                          {universe}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-700 border-2 border-slate-600 text-white font-black uppercase hover:bg-slate-600 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 border-2 border-yellow-400 text-white font-black uppercase transition-all shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}