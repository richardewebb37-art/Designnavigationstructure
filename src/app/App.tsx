import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { Discovery } from './pages/Discovery';
import { Nexus } from './pages/Nexus';
import { Community } from './pages/Community';
import { Events } from './pages/Events';

type Page = 'home' | 'discover' | 'nexus' | 'community' | 'events';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard />;
      case 'discover':
        return <Discovery />;
      case 'nexus':
        return <Nexus />;
      case 'community':
        return <Community />;
      case 'events':
        return <Events />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Comic book halftone pattern background */}
      <div className="fixed inset-0 opacity-5" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }} 
      />
      
      {/* Dynamic character silhouettes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-red-500 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-[500px] bg-gradient-to-l from-blue-500 to-transparent blur-2xl" style={{ clipPath: 'polygon(100% 0, 100% 100%, 60% 100%, 40% 80%, 50% 40%, 40% 0)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-t from-yellow-500 to-transparent blur-2xl" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-orange-500 to-transparent blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Action lines pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5"
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)',
           }}
      />
      
      <TopBar />
      
      <main className="relative pt-24 pb-28 px-6 max-w-7xl mx-auto">
        {renderPage()}
      </main>

      <BottomNav activePage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)} />
    </div>
  );
}