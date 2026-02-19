import { Heart, MessageSquare, Share2, MoreVertical, Flag, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export interface Post {
  id: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  universeTag?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  timestamp: string;
  type: 'text' | 'image' | 'link';
  linkUrl?: string;
  linkTitle?: string;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare, onDelete, onReport }: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { currentUser } = useApp();
  const isOwnPost = currentUser?.id === post.authorId;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="group relative overflow-hidden rounded-xl bg-slate-800 border-2 sm:border-4 border-slate-700 hover:border-yellow-400 transition-all duration-300">
      {/* Halftone pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '8px 8px'
           }} 
      />
      
      <div className="relative p-4 sm:p-6">
        {/* Header - Author info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 border-2 sm:border-3 border-yellow-400 flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
              {post.authorAvatar}
            </div>
            
            <div className="min-w-0">
              <h4 className="text-white font-black text-sm sm:text-base truncate">{post.authorDisplayName}</h4>
              <p className="text-blue-400 text-xs sm:text-sm font-bold">@{post.authorUsername}</p>
              <p className="text-slate-400 text-xs font-medium">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
            >
              <MoreVertical className="w-5 h-5 text-white" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 top-10 z-20 w-48 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden">
                  {isOwnPost && onDelete && (
                    <>
                      <button
                        onClick={() => {
                          onDelete(post.id);
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-slate-700 transition-colors font-bold text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Post
                      </button>
                    </>
                  )}
                  {!isOwnPost && onReport && (
                    <button
                      onClick={() => {
                        onReport(post.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-yellow-400 hover:bg-slate-700 transition-colors font-bold text-sm"
                    >
                      <Flag className="w-4 h-4" />
                      Report Post
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Universe Tag */}
        {post.universeTag && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-900/50 border-2 border-purple-500 text-purple-300 text-xs font-black uppercase">
              {post.universeTag}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mb-4">
          <p className="text-white text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border-2 border-slate-600 bg-gradient-to-br from-blue-600/30 to-purple-600/30">
            <div className="w-full flex items-center justify-center p-12">
              <div className="text-center">
                <div className="text-6xl mb-3">🖼️</div>
                <p className="text-sm text-slate-300 font-medium">Image Content</p>
              </div>
            </div>
          </div>
        )}

        {/* Link Preview */}
        {post.type === 'link' && post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 p-4 rounded-lg bg-slate-700 border-2 border-slate-600 hover:border-blue-500 transition-all"
          >
            <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-1">
              <Share2 className="w-4 h-4" />
              External Link
            </div>
            {post.linkTitle && (
              <h5 className="text-white font-bold text-sm">{post.linkTitle}</h5>
            )}
            <p className="text-slate-400 text-xs truncate">{post.linkUrl}</p>
          </a>
        )}

        {/* Interactions */}
        <div className="flex items-center gap-4 sm:gap-6 pt-3 border-t-2 border-slate-700">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 text-sm transition-all group/btn ${
              post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
            }`}
          >
            <Heart 
              className={`w-5 h-5 group-hover/btn:scale-125 transition-transform ${
                post.isLiked ? 'fill-red-400' : ''
              }`} 
              strokeWidth={2.5} 
            />
            <span className="font-black">{post.likes}</span>
          </button>
          
          <button
            onClick={() => onComment(post.id)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors group/btn"
          >
            <MessageSquare className="w-5 h-5 group-hover/btn:scale-125 transition-transform" strokeWidth={2.5} />
            <span className="font-black">{post.comments}</span>
          </button>
          
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-green-400 transition-colors group/btn"
          >
            <Share2 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" strokeWidth={2.5} />
            <span className="font-black">{post.shares}</span>
          </button>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}