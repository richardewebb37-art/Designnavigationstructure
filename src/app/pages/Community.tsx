import { Search, Plus, TrendingUp, Users, Heart, Filter, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PostCard, Post } from '../components/PostCard';
import { CreatePostModal } from '../components/CreatePostModal';
import { useApp } from '../context/AppContext';

export function Community() {
  const { currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'following' | 'trending'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // For now, use mock data - in production, this would fetch from the backend
      const mockPosts: Post[] = [
        {
          id: '1',
          authorId: 'user1',
          authorUsername: 'marvelFan2024',
          authorDisplayName: 'Marvel Fan',
          authorAvatar: '🦸',
          content: 'Just finished writing a new Spider-Man story! Set in an alternate timeline where Peter Parker becomes the Sorcerer Supreme instead of Doctor Strange. What do you all think? 🕷️✨',
          universeTag: 'Marvel',
          likes: 142,
          comments: 23,
          shares: 8,
          isLiked: false,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          type: 'text',
        },
        {
          id: '2',
          authorId: 'user2',
          authorUsername: 'dcComicsWriter',
          authorDisplayName: 'DC Comics Writer',
          authorAvatar: '🦇',
          content: 'Check out my fan art of the Bat-Family! Took me 20 hours to complete. Hope you enjoy it! 🎨',
          // imageUrl removed to prevent external fetch in guest mode
          universeTag: 'DC Comics',
          likes: 256,
          comments: 45,
          shares: 31,
          isLiked: true,
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          type: 'text', // Changed from 'image' to 'text' since we removed the image
        },
        {
          id: '3',
          authorId: 'user3',
          authorUsername: 'scifiCreator',
          authorDisplayName: 'Sci-Fi Creator',
          authorAvatar: '🚀',
          content: 'New chapter of my original space opera series is live! This one explores the ancient civilization that left behind those mysterious artifacts. Link below!',
          type: 'link',
          linkUrl: 'https://example.com/story/chapter-12',
          linkTitle: 'The Lost Artifacts - Chapter 12',
          universeTag: 'Original Universe',
          likes: 89,
          comments: 12,
          shares: 15,
          isLiked: false,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          authorId: 'user4',
          authorUsername: 'transformersFan',
          authorDisplayName: 'Transformers Fan',
          authorAvatar: '🤖',
          content: 'Who else is excited about the writing challenge this month? I\'m planning to write a story about the early days of Cybertron before the war. Any tips for world-building? 🌟',
          universeTag: 'Transformers',
          likes: 67,
          comments: 18,
          shares: 4,
          isLiked: false,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          type: 'text',
        },
        {
          id: '5',
          authorId: 'user5',
          authorUsername: 'fantasyWriter99',
          authorDisplayName: 'Fantasy Writer',
          authorAvatar: '⚔️',
          content: 'Just hit 10,000 words on my Lord of the Rings fanfic! It\'s a story about what happened to the Blue Wizards in the East. Thanks for all the support, everyone! 📚✨',
          universeTag: 'Lord of the Rings',
          likes: 134,
          comments: 29,
          shares: 12,
          isLiked: false,
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          type: 'text',
        },
        {
          id: '6',
          authorId: 'user6',
          authorUsername: 'animeLover',
          authorDisplayName: 'Anime Lover',
          authorAvatar: '🌸',
          content: 'Created a crossover story concept: What if My Hero Academia characters existed in the Attack on Titan universe? Would love to hear your thoughts! 💭',
          universeTag: 'Anime/Manga',
          likes: 198,
          comments: 52,
          shares: 23,
          isLiked: true,
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          type: 'text',
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData: {
    content: string;
    imageUrl?: string;
    universeTag?: string;
    type: 'text' | 'image' | 'link';
    linkUrl?: string;
    linkTitle?: string;
  }) => {
    // In production, this would call the backend API
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: currentUser?.id || 'guest-user',
      authorUsername: currentUser?.username || 'guest',
      authorDisplayName: currentUser?.displayName || 'Guest User',
      authorAvatar: currentUser?.avatar || '👤',
      content: postData.content,
      imageUrl: postData.imageUrl,
      universeTag: postData.universeTag,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      timestamp: new Date().toISOString(),
      type: postData.type,
      linkUrl: postData.linkUrl,
      linkTitle: postData.linkTitle,
    };

    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    // In production, this would open a comment modal or navigate to post detail
    alert(`Comment on post ${postId} - Feature coming soon!`);
  };

  const handleShare = (postId: string) => {
    // In production, this would share the post or open share options
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
    alert('Post shared! (Mock action)');
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleReport = (postId: string) => {
    alert('Post reported. Our moderation team will review it. (Mock action)');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorDisplayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.universeTag?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    return matchesSearch;
  });

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">Community Hub</h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium">Connect, share, and collaborate with fellow creators</p>
        </div>
        
        <button
          onClick={() => setShowNewPost(true)}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl border-2 sm:border-4 border-yellow-400 text-white font-black uppercase shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
        >
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" strokeWidth={3} />
            Create Post
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" strokeWidth={3} />
          <input
            type="text"
            placeholder="Search posts, users, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 focus:border-green-500 rounded-xl text-white placeholder-gray-500 focus:outline-none font-bold text-sm sm:text-base"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="w-full sm:w-auto px-6 py-3 sm:py-4 bg-slate-800 border-2 sm:border-4 border-slate-700 hover:border-blue-500 rounded-xl text-white font-black uppercase transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Filter className="w-5 h-5" strokeWidth={3} />
            Filter
          </button>

          {showFilterMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowFilterMenu(false)} 
              />
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-slate-800 border-2 border-slate-600 rounded-lg shadow-xl overflow-hidden">
                {['all', 'following', 'trending'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setFilterType(filter as any);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors font-bold text-sm capitalize ${
                      filterType === filter
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {filter === 'all' ? 'All Posts' : filter === 'following' ? 'Following' : 'Trending'}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { 
            icon: Heart, 
            value: totalLikes, 
            label: 'Total Likes',
            gradient: 'from-red-600 to-pink-600',
            border: 'border-red-400'
          },
          { 
            icon: TrendingUp, 
            value: posts.length, 
            label: 'Active Posts',
            gradient: 'from-blue-600 to-cyan-500',
            border: 'border-blue-400'
          },
          { 
            icon: Users, 
            value: totalComments, 
            label: 'Comments',
            gradient: 'from-green-600 to-emerald-500',
            border: 'border-green-400'
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`relative overflow-hidden rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 border-2 sm:border-4 ${stat.border} bg-gradient-to-br ${stat.gradient}`}>
              <div className="absolute inset-0 opacity-20" 
                   style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                     backgroundSize: '10px 10px'
                   }} 
              />
              <div className="relative p-3 sm:p-6 space-y-1 sm:space-y-3">
                <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" strokeWidth={3} />
                <div className="text-xl sm:text-4xl font-black text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white font-bold uppercase tracking-wide">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feed */}
      <div className="space-y-4 sm:space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 transform -skew-x-3 rounded-lg" />
          <h2 className="relative text-2xl sm:text-3xl font-black text-white uppercase tracking-tight px-4 sm:px-6 py-2 sm:py-3">
            {filterType === 'all' ? 'All Posts' : filterType === 'following' ? 'Following' : 'Trending Posts'}
          </h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-12 h-12 text-yellow-400 animate-spin" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {filteredPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onDelete={handleDelete}
                onReport={handleReport}
              />
            ))}
          </div>
        ) : (
          <div className="relative text-center py-20 overflow-hidden rounded-xl border-2 sm:border-4 border-slate-700 bg-slate-800">
            <div className="absolute inset-0 opacity-5" 
                 style={{ 
                   backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                   backgroundSize: '20px 20px'
                 }} 
            />
            <div className="relative space-y-4">
              <div className="text-4xl sm:text-6xl">💬</div>
              <p className="text-xl sm:text-2xl text-white font-black uppercase">No Posts Found</p>
              <p className="text-gray-400 font-bold text-sm sm:text-base">Try a different search or create the first post!</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showNewPost}
        onClose={() => setShowNewPost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}