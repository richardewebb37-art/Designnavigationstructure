export interface Work {
  id: string;
  title: string;
  author: string;
  description: string;
  type: 'original' | 'inspired';
  universe?: string;
  source?: string;
  thumbnail: string;
  tags: string[];
  likes: number;
}

export interface Universe {
  id: string;
  name: string;
  icon: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'contest' | 'challenge' | 'announcement';
  status: 'upcoming' | 'ongoing' | 'past';
}

export const universes: Universe[] = [
  { id: '1', name: 'Star Wars', icon: '⚔️' },
  { id: '2', name: 'Marvel', icon: '🦸' },
  { id: '3', name: 'Harry Potter', icon: '⚡' },
  { id: '4', name: 'LOTR', icon: '💍' },
  { id: '5', name: 'Anime', icon: '🎌' },
  { id: '6', name: 'Original', icon: '✨' },
];

export const works: Work[] = [
  {
    id: '1',
    title: 'The Last Jedi Chronicles',
    author: 'SkyWriter',
    description: 'An epic continuation of the Jedi legacy, exploring untold stories from a galaxy far, far away.',
    type: 'inspired',
    universe: 'Star Wars',
    source: 'Star Wars Universe',
    thumbnail: 'space galaxy stars',
    tags: ['sci-fi', 'adventure', 'action'],
    likes: 1248,
  },
  {
    id: '2',
    title: 'Neon Dreams',
    author: 'CyberScribe',
    description: 'A cyberpunk tale of redemption in a city where technology and humanity collide.',
    type: 'original',
    thumbnail: 'cyberpunk neon city',
    tags: ['cyberpunk', 'thriller', 'original'],
    likes: 892,
  },
  {
    id: '3',
    title: 'Avengers: Quantum Paradox',
    author: 'MarvelFan2024',
    description: 'When the quantum realm fractures, the Avengers must face their greatest challenge yet.',
    type: 'inspired',
    universe: 'Marvel',
    source: 'Marvel Cinematic Universe',
    thumbnail: 'superhero action cityscape',
    tags: ['superhero', 'action', 'sci-fi'],
    likes: 2156,
  },
  {
    id: '4',
    title: 'Whispers of Eternity',
    author: 'MysticPen',
    description: 'A fantasy epic where ancient magic awakens and destiny calls to unlikely heroes.',
    type: 'original',
    thumbnail: 'fantasy magic forest',
    tags: ['fantasy', 'magic', 'adventure'],
    likes: 745,
  },
  {
    id: '5',
    title: 'Hogwarts After Dark',
    author: 'WizardingWords',
    description: 'Discover the untold mysteries that unfold in Hogwarts long after the students sleep.',
    type: 'inspired',
    universe: 'Harry Potter',
    source: 'Harry Potter Series',
    thumbnail: 'castle magic night',
    tags: ['magic', 'mystery', 'adventure'],
    likes: 1673,
  },
  {
    id: '6',
    title: 'Chronicles of the Void',
    author: 'CosmicTales',
    description: 'In the depths of space, a crew discovers something that should have remained hidden.',
    type: 'original',
    thumbnail: 'deep space nebula',
    tags: ['sci-fi', 'horror', 'mystery'],
    likes: 534,
  },
  {
    id: '7',
    title: 'The Ring Bearer\'s Return',
    author: 'MiddleEarthFan',
    description: 'A new threat emerges in Middle-earth, and ancient alliances must be rekindled.',
    type: 'inspired',
    universe: 'LOTR',
    source: 'Lord of the Rings',
    thumbnail: 'fantasy mountains landscape',
    tags: ['fantasy', 'epic', 'adventure'],
    likes: 1891,
  },
  {
    id: '8',
    title: 'Tokyo Shadows',
    author: 'AnimeDreamer',
    description: 'A slice-of-life story with supernatural elements set in modern Tokyo.',
    type: 'inspired',
    universe: 'Anime',
    source: 'Original Anime Concept',
    thumbnail: 'tokyo city night lights',
    tags: ['anime', 'supernatural', 'drama'],
    likes: 967,
  },
];

export const threads: Thread[] = [
  {
    id: '1',
    title: 'Tips for writing compelling villain characters?',
    content: 'I\'m working on a story and struggling to make my antagonist feel real and threatening. What are your best tips for creating memorable villains?',
    author: 'NewWriter2024',
    avatar: '📝',
    timestamp: '2026-02-18T10:30:00Z',
    likes: 45,
    replies: 23,
  },
  {
    id: '2',
    title: 'How do you handle writer\'s block?',
    content: 'I\'ve been stuck on the same chapter for weeks. What techniques do you use to push through creative blocks?',
    author: 'BlockedAuthor',
    avatar: '✍️',
    timestamp: '2026-02-17T14:20:00Z',
    likes: 67,
    replies: 31,
  },
  {
    id: '3',
    title: 'Looking for beta readers for my sci-fi novel',
    content: 'Just finished the first draft of my space opera. Would love some feedback from fellow sci-fi enthusiasts!',
    author: 'SpaceStoryteller',
    avatar: '🚀',
    timestamp: '2026-02-17T09:15:00Z',
    likes: 34,
    replies: 18,
  },
  {
    id: '4',
    title: 'World-building resources and tools',
    content: 'What are your favorite tools and resources for creating detailed fictional worlds? Looking for both software and traditional methods.',
    author: 'WorldCrafter',
    avatar: '🌍',
    timestamp: '2026-02-16T16:45:00Z',
    likes: 89,
    replies: 42,
  },
  {
    id: '5',
    title: 'Balancing fanfic with original work',
    content: 'I love writing fanfiction but also want to develop my own stories. How do you split your time between the two?',
    author: 'DualWriter',
    avatar: '⚖️',
    timestamp: '2026-02-16T11:30:00Z',
    likes: 56,
    replies: 27,
  },
];

export const events: Event[] = [
  {
    id: '1',
    title: 'Monthly Writing Challenge: February',
    description: 'Write a 1000-word story incorporating the theme "Lost and Found". Submit by February 28th for a chance to be featured!',
    date: '2026-02-28T23:59:59Z',
    type: 'challenge',
    status: 'ongoing',
  },
  {
    id: '2',
    title: 'Sci-Fi Flash Fiction Contest',
    description: 'Create a complete sci-fi story in exactly 500 words. Winners receive exclusive badges and feature spots!',
    date: '2026-03-15T23:59:59Z',
    type: 'contest',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Platform Update: New Features Incoming',
    description: 'Get ready for exciting new tools including collaborative writing, advanced formatting, and enhanced discovery algorithms.',
    date: '2026-03-01T00:00:00Z',
    type: 'announcement',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Fantasy World-Building Workshop',
    description: 'Join our live workshop on creating immersive fantasy worlds. Expert tips on magic systems, geography, and culture.',
    date: '2026-02-25T18:00:00Z',
    type: 'challenge',
    status: 'upcoming',
  },
  {
    id: '5',
    title: 'January Writing Sprint Results',
    description: 'Congratulations to all participants! Over 500 stories were submitted. Check out the winning entries in the featured section.',
    date: '2026-02-01T00:00:00Z',
    type: 'announcement',
    status: 'past',
  },
];
